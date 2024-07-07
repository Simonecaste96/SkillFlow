import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthLogin } from 'src/app/interfaces/auth-login';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  user!: AuthLogin | null;

  searchControl = new FormControl();

  usersSearchResult:User[] = [];

  friends!:User[];

  

  
  private userSubscription!: Subscription;

  private receivedRequestsSubscription!: Subscription;
  
  private friendsSubscription!: Subscription;

  private searchSubscription!: Subscription;


  constructor(
    private authSrv: AuthService,
    private userSrv: UserService,
    private router: Router,
    private frndRqstSrv: FriendRequestService,
  
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authSrv.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.frndRqstSrv.getReceivedFriendRequests(user.user.id.toString()).subscribe();
        this.frndRqstSrv.getFriendsList(user.user.id).subscribe();
      }
    });

    this.receivedRequestsSubscription = this.frndRqstSrv.receivedRequests$.subscribe(receivedRequests => {
      if (this.user) {
        this.user.user.receivedFriendRequests = receivedRequests;
      }
    });

    this.friendsSubscription = this.frndRqstSrv.friends$.subscribe(friends => {
      this.friends = friends;
    });

    this.searchSubscription = this.searchControl.valueChanges.pipe(
      switchMap(query => {
        const [name, surname] = this.splitSearchQuery(query);
        if (query.trim()) {
          return this.userSrv.searchUsers(name, surname);
        } else {
          this.usersSearchResult = []; // Resetta i risultati della ricerca
          return [];
        }
      })
    ).subscribe(results => {
      const currentUserId = this.user?.user.id;
      this.usersSearchResult = results.filter(user =>
        user.id !== currentUserId
      );
    });
  }



  // distruggo i dati sotto osservazione per risparmiare mamoria
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.receivedRequestsSubscription) {
      this.receivedRequestsSubscription.unsubscribe();
    }
    if (this.friendsSubscription) {
      this.friendsSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }



  logout() {
    console.log('Attempting to update user online status to false');
    this.userSrv.updateUserOnlineStatus(false).subscribe(
      () => {
        console.log('User online status updated to false, logging out');
        this.authSrv.logout();
      },
      error => {
        console.error('Failed to update user online status', error);
        this.authSrv.logout();
      }
    );
  }
  

  navigateToProfile(user: User): void {
    this.router.navigate(['/userProfile/', user.id]).then(() => {
      this.searchControl.setValue('');
      this.usersSearchResult = [];
     });
  }


  splitSearchQuery(query: string): [string, string] {
    const parts = query.split(' ').filter(part => part.length > 0);
    return parts.length === 2 ? [parts[0], parts[1]] : [query, ''];
  }

  sendRequest(userId: number): void {
    if (this.user) {
      this.frndRqstSrv.sendFriendRequest(this.user.user.id, userId).subscribe(() => {
        console.log('Richiesta di amicizia inviata');
        this.frndRqstSrv.getReceivedFriendRequests(this.user!.user.id.toString()).subscribe();
      }, error => {
        console.error('Richiesta di amicizia già inviata:', error);
      });
    }
  }
}
