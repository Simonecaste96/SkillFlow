import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import  { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { PostInterface } from '../interfaces/post-interface';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {


userURL = environment.userControllerUrl

private postsSubject = new BehaviorSubject<PostInterface[]>([]);
public posts$ = this.postsSubject.asObservable();
 

private usersSubject = new BehaviorSubject<User[]>([]);
public users$ = this.usersSubject.asObservable();


private userSubject = new BehaviorSubject<User | null>(null);
public user$ = this.userSubject.asObservable();




  constructor(private http: HttpClient) {}



  updateUserOnlineStatus(isOnline: boolean): Observable<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      const userId: string = user.user.id;
      console.log(`Updating user status for user ID: ${userId} to ${isOnline ? 'online' : 'offline'}`);
      return this.http.put(`${this.userURL}status/${userId}?isOnline=${isOnline}`, null);
    }
    return new Observable(observer => {
      observer.error('User not found in localStorage');
    });
  }


  //ricerca utenti
  searchUsers(name: string, surname: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.userURL}search`, {
      params: {name,surname}
    });
  }




//gstione utenti
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.userURL}users`).pipe(
      tap(users => this.usersSubject.next(users)),
      catchError(this.handleError)
    );
  }
  

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.userURL}users/${id}`).pipe(
      tap(user => this.userSubject.next(user)),
      catchError(this.handleError)
    );
  }

  putUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.userURL}/${id}`, user).pipe(
      tap(user => this.userSubject.next(user)),
      catchError(this.handleError)
      
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.userURL}users/${id}`)
  }






//gestione post
 
  /*setPost(posts:PostInterface[]){
  this.postsSubject.next(posts)
  }*/

  toggleLike(postId: number, like: boolean): Observable<number> {
    return this.http.put<{ likesCount: number }>(`${this.userURL}like/${postId}?like=${like}`, {})
      .pipe(
        map(response => response.likesCount)
      );
  }


  getPosts(): void {
     this.http.get<PostInterface[]>(`${this.userURL}users/posts`).pipe(
      tap((posts:PostInterface[]) => this.postsSubject.next(posts),    //devo passare i dati della get al subject 
      catchError(this.handleError)
     )).subscribe();
  }



  /*createPost(formData: FormData): Observable<PostInterface[]> {
    return this.http.post<PostInterface[]>(`${this.userURL}users/posts`, formData).pipe(
      tap(response => {
        this.getPosts(); // Chiamo getPosts() dopo la creazione del post
        console.log('Post creato', response);
      })
    );
  }*/

  


  //gestione post per un certo tipo di utente

getPostsByUser(id:string): Observable<PostInterface[]> {
    return this.http.get<PostInterface[]>(`${this.userURL}users/${id}/posts`).pipe(
      tap((posts:PostInterface[]) => this.postsSubject.next(posts)),
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

