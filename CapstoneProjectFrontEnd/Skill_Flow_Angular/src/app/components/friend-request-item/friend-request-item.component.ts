import { Component, Input } from '@angular/core';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { User } from 'src/app/interfaces/user';
import { FriendRequest } from 'src/app/interfaces/friend-request';

@Component({
  selector: 'app-friend-request-item',
  templateUrl: './friend-request-item.component.html',
  styleUrls: ['./friend-request-item.component.scss']
})
export class FriendRequestItemComponent {
  @Input() request!: FriendRequest;
  user!:User;

  constructor(private friendRequestService: FriendRequestService) {}


  acceptRequest(): void {
    this.friendRequestService.respondToFriendRequest(this.request.id, true).subscribe(() => {
      // Aggiorna l'interfaccia utente o rimuovi la richiesta accettata dall'elenco
    });
  }

  declineRequest(): void {
    this.friendRequestService.respondToFriendRequest(this.request.id, false).subscribe(() => {
      // Aggiorna l'interfaccia utente o rimuovi la richiesta rifiutata dall'elenco
    });
  }
}
