import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FriendRequest } from '../interfaces/friend-request';
import { User } from '../interfaces/user';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {

  private friendRequestUrl = environment.userControllerUrl;



  private receivedRequestsSubject = new BehaviorSubject<FriendRequest[]>([]);
  receivedRequests$ = this.receivedRequestsSubject.asObservable();



  private sentRequestsSubject = new BehaviorSubject<FriendRequest[]>([]);
  sentRequests$ = this.sentRequestsSubject.asObservable();




  private friendsSubject = new BehaviorSubject<User[]>([]);
  friends$ = this.friendsSubject.asObservable();






  constructor(private http: HttpClient) {}


  // INVIO la richiesta non serve beavhior
  sendFriendRequest(senderId: number, receiverId: number): Observable<any> {
    return this.http.post(`${this.friendRequestUrl}friend_request/send?senderId=${senderId}&receiverId=${receiverId}`, {})
  }


  // RISPONDI la richiesta non serve beavhior
  respondToFriendRequest(requestId: number, accepted: boolean): Observable<any> {
    return this.http.put(`${this.friendRequestUrl}friend_request/respond/${requestId}/${accepted}`,{})
      
  }


//PRENDI richhieste RICEVUTE SERVE beavhior
  getReceivedFriendRequests(receiverId: string): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.friendRequestUrl}friend_request/received/${receiverId}`).pipe(
      tap(requests => this.receivedRequestsSubject.next(requests)),
      catchError(this.handleError)
    );
  }

  //ha senso avere le richieste inviate? 

//PRENDI richieste INVIATE SERVE beavhior
  getSentFriendRequests(senderId: string): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.friendRequestUrl}friend_request/sent/${senderId}`).pipe(
      tap(requests => this.sentRequestsSubject.next(requests)),
      catchError(this.handleError)
    );
  }




  //lista di amici SERVE il beavhior
  getFriendsList(userId:number):Observable<User[]>{
  return this.http.get<User[]>(`${this.friendRequestUrl}friend_request/${userId}/friends`).pipe(
  tap(user => this.friendsSubject.next(user)),
  catchError(this.handleError)
);
  }




  // GESTIONE DEGLI ERRORI

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Si è verificato un errore sconosciuto!';
    if (error.error instanceof Error) {
      // Errore del client-side o di rete
      console.error('Errore:', error.error.message);
      errorMessage = `Errore del client-side o di rete: ${error.error.message}`;
    } else {


      // Errore dal lato del server
      console.error(
        `Codice Errore dal lato server ${error.status},  +
        messaggio di errore: ${error.message}`
      );
      errorMessage = `Errore dal lato server: ${error.status}, messaggio di errore: ${error.message}`;
    }

    // Ritorna un observable con un messaggio di errore utile per il consumatore del servizio
    return throwError(errorMessage);
  }
}
