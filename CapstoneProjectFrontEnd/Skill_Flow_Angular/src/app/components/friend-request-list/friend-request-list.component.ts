import { Component, OnInit, OnDestroy } from '@angular/core';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { FriendRequest } from 'src/app/interfaces/friend-request';
import { User } from 'src/app/interfaces/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friend-request-list',
  templateUrl: './friend-request-list.component.html',
  styleUrls: ['./friend-request-list.component.scss']
})
export class FriendRequestListComponent implements OnInit, OnDestroy {
  receivedFriendRequests: FriendRequest[] = [];
  sentFriendRequests: FriendRequest[] = [];
  friends: User[] = [];
   updateIntervalId: any;
   userId!: number;

  constructor(
    private friendRequestService: FriendRequestService
  ) {}

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson).user;
      this.userId = user.id;

      //this.updateReceivedRequests();
      //this.updateSentRequests();
      //this.updateFriendsList();

      
      this.updateIntervalId = setInterval(() => {
        this.updateReceivedRequests();
        //this.updateSentRequests();
        //this.updateFriendsList();
      }, 1000); // rimetti a 1000 dopo aver finito di testare
    } else {
      console.error('User not found in localStorage');
    }
  }

  ngOnDestroy(): void {
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
  }

  updateReceivedRequests(): void {
    if (this.userId) {
      this.friendRequestService.getReceivedFriendRequests(this.userId.toString()).subscribe(requests => {
        this.receivedFriendRequests = requests;
      });
    }
  }

  /*
  updateSentRequests(): void {
    if (this.userId) {
      this.friendRequestService.getSentFriendRequests(this.userId.toString()).subscribe(requests => {
        this.sentFriendRequests = requests;
      });
    }
  }
*/
/*
  updateFriendsList(): void {
    if (this.userId) {
      this.friendRequestService.getFriendsList(this.userId).subscribe(friends => {
        this.friends = friends;
      });
    }
  }
*/

  acceptRequest(requestId: number): void {
    this.friendRequestService.respondToFriendRequest(requestId, true).subscribe(() => {
      this.friendRequestService.getFriendsList(this.userId).subscribe(friends => {
        this.friends = friends;
      });
    });
  }

  declineRequest(requestId: number): void {
    this.friendRequestService.respondToFriendRequest(requestId, false).subscribe(() => {
      //this.updateReceivedRequests();
    });
  }
}
