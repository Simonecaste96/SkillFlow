/*
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ChatInterface } from 'src/app/interfaces/chat-interface';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.scss']
})
export class UserChatComponent implements OnInit, OnDestroy {
  friends: User[] = [];
  selectedFriend?: User;
  messageContent!: string;
  messages: ChatInterface[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private webSocketService: WebSocketService) {}


// Inizializza il componente e si connette al servizio WebSocket
  ngOnInit(): void {
    this.loadFriends(); // carico la lista degli amici

// Sottoscrive l'utente ai messaggi privati in arrivo
    this.subscriptions.push(
      this.webSocketService.privateMessages$.subscribe((message: any) => {
        console.log('Received chat message:', message);
        if (message && this.selectedFriend &&
            (message.senderId === this.selectedFriend.id || message.recipientId === this.selectedFriend.id)) {
          this.addMessage(JSON.parse(message.body));
          this.loadChatHistory(); 
        }
      })
    );
  }


// Disconnette il servizio WebSocket e cancella tutte le sottoscrizioni
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.webSocketService.disconnect();
  }


// Carica gli amici dell'utente
  loadFriends(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson).user;
      this.friends = user.friends;
      console.log('Friends loaded:', this.friends);
    }
  }


// Seleziona un amico per chattare
  selectFriend(friend: User): void {
    this.selectedFriend = friend;
    this.clearMessages();
    console.log('Selected friend:', this.selectedFriend);

    // Carica i messaggi precedenti
    this.loadChatHistory();
  }

  // Carica la cronologia della chat
  loadChatHistory(): void {
    if (this.selectedFriend) {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson).user;
        const roomId = 6// this.getRoomId(user.id, this.selectedFriend.id);
        this.webSocketService.loadChatHistory(roomId).subscribe(
          (data) => {
            this.messages = data;
            this.scrollToBottom(); // Scrolla automaticamente verso il basso per vedere i messaggi caricati
          },
          (error) => {
            console.error('Failed to load chat history', error);
          }
        );
      }
    }
  }


// Invia un messaggio alla chat
  sendMessage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFriend) {
      const user = JSON.parse(userJson).user;

      if (this.messageContent.trim() !== '') {
        const message: ChatInterface = {
          senderId: user.id,
          recipientId: this.selectedFriend.id,
          content: this.messageContent,
          timestamp: new Date().toISOString()
        };

        console.log('Sending message:', message);
        this.webSocketService.sendPrivateMessage(message);
        this.messages.push(message);
        this.messageContent = '';
      } else {
        console.error('Message content is missing');
      }
    } else {
      console.error('User not found in localStorage or no friend selected');
    }
  }


// Aggiunge un messaggio alla chat? ha senso?
  private addMessage(message: ChatInterface) {
    console.log('Adding message to local chat:', message);
    this.messages.push(message);
    this.scrollToBottom(); // Scrolla automaticamente verso il basso per vedere il nuovo messaggio
  }

  // scrolla automaticamente verso il basso per vedere i nuovi messaggi
  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  // cancella tutti i messaggi dalla chat
  private clearMessages() {
    console.log('Clearing messages');
    this.messages = [];
  }

  getUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson).user : null;
  }
}
  /*
 import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ChatInterface } from 'src/app/interfaces/chat-interface';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.scss']
})
export class UserChatComponent implements OnInit, OnDestroy {
  friends: User[] = [];
  selectedFriend?: User;
  messageContent!: string;
  messages: ChatInterface[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.loadFriends();
    this.subscriptions.push(
      this.webSocketService.getPrivateMessages().subscribe((message) => {
        if (message && this.selectedFriend &&
            (message.senderId === this.selectedFriend.id || message.recipientId === this.selectedFriend.id)) {
          this.addMessage(message);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadFriends(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson).user;
      this.friends = user.friends;
      console.log('Friends loaded:', this.friends);
    }
  }

  selectFriend(friend: User): void {
    this.selectedFriend = friend;
    this.clearMessages();
    console.log('Selected friend:', this.selectedFriend);
    this.loadChatHistory();

    // Subscribe to the chat room
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson).user;
      const chatId = this.getChatId(user.id, this.selectedFriend.id.toString());
      this.webSocketService.subscribeToPrivateMessages(chatId);
      this.subscriptions.push(
        this.webSocketService.getPrivateMessages().subscribe((message) => {
          if (message) {
            this.addMessage(message);
          }
        })
      );
    }
  }


  loadChatHistory(): void {
    if (this.selectedFriend) {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson).user;
        const chatId = this.getChatId(user.id, this.selectedFriend.id.toString());
      }
    }
  }

  sendMessage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFriend) {
      const user = JSON.parse(userJson).user;

      if (this.messageContent.trim() !== '') {
        const message: ChatInterface = {
          senderId: user.id,
          recipientId: this.selectedFriend.id,
          content: this.messageContent,
          timestamp: new Date().toISOString()
        };

        const chatId = this.getChatId(user.id, this.selectedFriend.id.toString());
        console.log('Sending message:', message);
        this.webSocketService.sendPrivateMessage(chatId, message);
        this.messages.push(message);
        this.messageContent = '';
        this.scrollToBottom();
      } else {
        console.error('Message content is missing');
      }
    } else {
      console.error('User not found in localStorage or no friend selected');
    }
  }

  private addMessage(message: ChatInterface) {
    this.messages.push(message);
    this.scrollToBottom();
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

  getUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson).user : null;
  }

  private getChatId(userId1: string, userId2: string): string {
    return `${Math.min(+userId1, +userId2)}-${Math.max(+userId1, +userId2)}`;
  }
}
*/
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
    console.log('Selected Friend:', this.selectedFriend);  // Log per verificare il dato selezionato
    console.log('Selected Friend Online:', this.selectedFriend.online);  
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
        this.scrollToBottom();  // Scorri fino in fondo dopo aver inviato il messaggio
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

/*

  ngOnInit(): void {
    this.webSocketService.joinRoom("1");
  }


  sendMessage(): void {
    const chatMessage: ChatInterface = {
      senderId: 1,
      recipientId:2,
      roomId: 1,
      content: "Hello",
      timestamp: new Date().toISOString()
    };
    this.webSocketService.sendMessage("1", chatMessage);
  }

  //ottengo l'utente colelgato
    getUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson).user : null;
  }

  //carica gli amici dell'utente
  loadFriends(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson).user;
      this.friends = user.friends;
    }
  }

  selectFriend(friend: User, event: MouseEvent): void {
    this.selectedFriend = friend;
    this.clearMessages();
    this.getRoomId();
    event.stopPropagation();
  }

  private clearMessages() {
    this.messages = [];
  }




// ottengo storico dei mesaggi
  loadChatHistory(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFriend) {
      const user = JSON.parse(userJson).user;
      this.webSocketService.loadChatHistory(user.id, this.selectedFriend.id).subscribe(
        (data) => {
          this.messages = data;
          this.scrollToBottom();
        },
        (error) => {
          console.error('Failed to load chat history', error);
        }
      );
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


  getRoomId(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFriend) {
      const user = JSON.parse(userJson).user;
      this.webSocketService.getRoomId(user.id, this.selectedFriend.id).subscribe(
        (roomId) => {
          this.webSocketService.subscribeToPrivateMessages(user.id.toString());
          this.loadChatHistory();
        },
        (error) => {
          console.error('Failed to get room ID', error);
        }
      );
    }
  }


  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  
  @HostListener('document:click', ['$event'])
  closeChatIfOutside(event: MouseEvent): void {
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow && !chatWindow.contains(event.target as Node)) {
      this.selectedFriend = undefined;
    }

}
*/



