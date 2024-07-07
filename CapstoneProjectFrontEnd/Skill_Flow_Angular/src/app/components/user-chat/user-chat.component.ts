import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ChatInterface } from 'src/app/interfaces/chat-interface';
import { User } from 'src/app/interfaces/user';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthLogin } from 'src/app/interfaces/auth-login';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.scss']
})
export class UserChatComponent implements OnInit, OnDestroy {
  friends!: User[];
  searchText: string = '';
  selectedFriend?: User;
  messageContent!: string;
  messages: ChatInterface[] = [];
  private subscriptions: Subscription[] = [];
  user!:User

  constructor(private webSocketService: WebSocketService, private friendSrv:FriendRequestService, private authSrv:AuthService) {}

  ngOnInit(): void {
    this.webSocketService.connect();
    this.authSrv.user$.subscribe(
      (user: AuthLogin | null) => {
          if (user) {
            this.user = user.user;
            console.log('User ID:', this.user);
            this.friendSrv.getFriendsList(this.user.id);
          }
      },
      (error) => {
        console.error('Errore nel caricamento dell\'utente', error);
      }
    );
    /*
    setInterval(() => {
     this.loadFriends(); 
    }, 1000);*/ 


   
    this.subscriptions.push(
    this.webSocketService.privateMessages$.subscribe((message) => {
      if (message) {
        this.messages.push(message);
        this.scrollToBottom();
      }
    })
  );

    this.subscriptions.push(
    this.friendSrv.friends$.subscribe(
      (data: User[]) => {
        this.friends = data;
        console.log('Friends loaded:', this.friends);
      },
      (error) => {
        console.error('Error loading friends:', error);
      }
    )
  );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.webSocketService.disconnect();
  }

  get filteredFriends() {
    return this.friends.filter(friend =>
      friend.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      friend.surname.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }




  selectFriend(friend: User, event: MouseEvent): void {
    this.selectedFriend = friend;
    this.clearMessages();
    this.getRoomId();
    event.stopPropagation();
  }

  getRoomId(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFriend) {
      const user = JSON.parse(userJson).user;
      const userId = user.id;
      const friendId = this.selectedFriend.id;
      this.webSocketService.getRoomId(userId, friendId).subscribe(
        (roomId) => {
          this.webSocketService.subscribeToPrivateMessages(user.id, this.selectedFriend!.id );
          this.getHistoryMessage(roomId);
        },
        (error) => {
          console.error('Failed to get room ID', error);
        }
      );
    }
  }

  getHistoryMessage(roomId:number): void {
      this.webSocketService.loadChatHistory(roomId).subscribe(
        (data: ChatInterface[]) => {
          this.messages = data;
          this.scrollToBottom();
        },
        (error) => {
          console.error('Failed to load chat history', error);
        }
      );
  }

getFriendName(senderName: string): string {
  const user = this.user
  if (!user) {
    return this.selectedFriend?.name || 'Unknown';
  }

  if (senderName === user.name) {
    return 'You';
  }

  const friend = this.friends.find(f => f.name === senderName);
  console.log(friend?.name, senderName);
  return friend ? friend.name : 'Unknown';
}

  sendMessage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFriend) {
      const user = JSON.parse(userJson).user;

      if (this.messageContent.trim() !== '') {
        const message: ChatInterface = {
          sender: user.id,
          recipient: this.selectedFriend.id,
          content: this.messageContent,
          timestamp: new Date().toISOString()
        };
          

        this.webSocketService.sendPrivateMessage(message, user.id, this.selectedFriend.id);
        
        
        this.messageContent = '';
        this.scrollToBottom(); 
      } else {
        console.error('Message content is missing');
      }
    } else {
      console.error('User not found in localStorage or no friend selected');
    }
  }




  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  private clearMessages() {
    this.messages = [];
  }



  @HostListener('document:click', ['$event'])
  closeChatIfOutside(event: MouseEvent): void {
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow && !chatWindow.contains(event.target as Node)) {
      this.selectedFriend = undefined;
    }
  }
  

}



