import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SkillExchangeRequestInterface } from '../interfaces/skill-exchange-request-interface';
import { SkillExchangeResponse } from '../interfaces/skill-exchange-response';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SkillExchangeRequestService {

  userURL = environment.userControllerUrl;

  private skillExchangeRequest = new BehaviorSubject<SkillExchangeRequestInterface[]>([]);

  public skillExchangeRequest$ = this.skillExchangeRequest.asObservable();

  private skillExchangeResponse = new BehaviorSubject<SkillExchangeResponse[]>([]);
  public skillExchangeResponse$ = this.skillExchangeResponse.asObservable();



  constructor(private http: HttpClient) { }


  //Creazione di una richiesta di scambio di competenze
  createSkillExchangeRequest(skillExchangeRequest: SkillExchangeRequestInterface, userId:number): Observable<SkillExchangeRequestInterface> {
    return this.http.post<SkillExchangeRequestInterface>(`${this.userURL}skill_exchange_request/create`, skillExchangeRequest).pipe(
      tap(() => {
        this.getSkillExchangeRequests(userId).subscribe();
      }),
      catchError(this.handleError)
    );
  }

  // Gestione della richiesta di scambio di competenze (accetta o rifiuta)
  handleSkillExchangeRequest(requestId: number, isAccepted: boolean, userId: number): Observable<void> {
    return this.http.put<void>(`${this.userURL}skill_exchange_request/response/${requestId}?isAccepted=${isAccepted}`, null).pipe(
      tap(() => {
        this.getSkillExchangeRequests(userId).subscribe();
      }),
      catchError(this.handleError)
    );
  }
/*//Ottenere le richieste di scambio di competenze
  getSkillExchangeRequests(userId: number): Observable<SkillExchangeResponse[]> {
    return this.http.get<SkillExchangeResponse[]>(`${this.userURL}skill_exchange_request/${userId}`).pipe(
      tap(skillExchangeRequests => this.skillExchangeRequest.next(skillExchangeRequests)),
      catchError(this.handleError)
    );
  }
*/


// Ottenere le richieste di scambio di competenze
getSkillExchangeRequests(userId: number): Observable<SkillExchangeResponse[]> {
  return this.http.get<SkillExchangeResponse[]>(`${this.userURL}skill_exchange_request/${userId}`).pipe(
    tap(skillExchangeResponse => this.skillExchangeResponse.next(skillExchangeResponse)),
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
