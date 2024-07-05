import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Review } from '../interfaces/review-interface';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReviewsReceived } from '../interfaces/reviews-received';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private review = new BehaviorSubject<ReviewsReceived[]>([]);
  public review$ = this.review.asObservable();

  constructor(private http: HttpClient) { }

  // Creazione di una recensione
  createReview(review: Review, userId: number): Observable<void> {
    return this.http.post<void>(`${environment.userControllerUrl}review`, review).pipe(
      tap(() => {
        this.getReviewsFindId(userId).subscribe();
      }),
      catchError(this.handleError)
    );
  }

  //Ottenere le recensioni ricevute dagli utenti
  getReviewsFindId(userId: number | string): Observable<ReviewsReceived[]> {
    return this.http.get<ReviewsReceived[]>(`${environment.userControllerUrl}review_reviewed/${userId}`).pipe(
      tap(reviews => this.review.next(reviews)),
      catchError(this.handleError)
    );
  }



// Gestione degli errori
private handleError(error: HttpErrorResponse) {
  let errorMessage = 'Si è verificato un errore sconosciuto!';
  if (error.error instanceof ErrorEvent) {
    // Errore del client-side o di rete
    console.error('Errore:', error.error.message);
    errorMessage = `Errore del client-side o di rete: ${error.error.message}`;
  } else {
    // Errore dal lato del server
    console.error(
      `Codice Errore dal lato server ${error.status}, messaggio di errore: ${error.message}`
    );
    errorMessage = `Errore dal lato server: ${error.status}, messaggio di errore: ${error.message}`;
  }

  // Ritorna un observable con un messaggio di errore utile per il consumatore del servizio
  return throwError(errorMessage);
}

}
