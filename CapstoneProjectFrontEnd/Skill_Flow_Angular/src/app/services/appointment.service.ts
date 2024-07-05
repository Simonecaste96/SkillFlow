import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Appointment } from '../interfaces/appointment-interface';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  
userURL = environment.userControllerUrl;

private appointemnt = new BehaviorSubject<Appointment[]>([]);
public appointment$ = this.appointemnt.asObservable();

  constructor(private http: HttpClient) { }


  //Creazione di un appuntamento
  createAppointment(appointment: Appointment, userId: number): Observable<void> {
    return this.http.post<void>(`${this.userURL}appointments/${userId}`, appointment).pipe(
      tap(() => {
        this.getAppointments(userId).subscribe();
      }),
      catchError(this.handleError)
    );
  }



  //Modifica di un appuntamento
  editAppointment(appointment: Appointment, appointmentId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.userURL}appointments/${appointmentId}`, appointment).pipe(
      tap(() => {
        this.getAppointments(userId).subscribe();
      }),
      catchError(this.handleError)
    );
  }

  //Ottenere gli appuntamenti
  getAppointments(userId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.userURL}appointments/${userId}`).pipe(
      tap(appointments => this.appointemnt.next(appointments)),
      catchError(this.handleError)
    );
  }

  //Eliminare un appuntamento
  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.userURL}appointments/${id}`).pipe(
      tap(() => {
        this.appointemnt.next(this.appointemnt.getValue().filter(appointment => appointment.id !== id));
      }),
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
