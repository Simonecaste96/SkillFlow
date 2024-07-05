import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SkillInterface } from '../interfaces/skill-interface';

@Injectable({
  providedIn: 'root'
})
export class UserSkillService {

  userURL = environment.userControllerUrl;
  enumURL = environment.interestsEnumControllerUrl;

  private skillsSubject = new BehaviorSubject<SkillInterface[]>([]);
  public skills$ = this.skillsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Creazione delle skill
  createSkill(skill: SkillInterface, userId: string): Observable<void> {
    return this.http.post<void>(`${this.userURL}skills/${userId}`, skill).pipe(
      tap(() => {
        this.getSkills(userId).subscribe();
      }),
      catchError(this.handleError)
    );
  }

  // Modifica delle skill
  editSkill(skill: SkillInterface, skillId: number, userId: string): Observable<void> {
    return this.http.put<void>(`${this.userURL}skills/${skillId}`, skill).pipe(
      tap(() => {
        this.getSkills(userId).subscribe();
      }),
      catchError(this.handleError)
    );
  }

  // Ottenere le skill
  getSkills(userId: string): Observable<SkillInterface[]> {
    return this.http.get<SkillInterface[]>(`${this.userURL}skills/${userId}`).pipe(
      tap(skills => this.skillsSubject.next(skills)),
      catchError(this.handleError)
    );
  }

  // Eliminare una skill
  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.userURL}skills/${id}`).pipe(
      tap(() => {
        this.skillsSubject.next(this.skillsSubject.getValue().filter(skill => skill.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  // Ottenere i livelli di esperienza
  getLevelList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.enumURL}level`).pipe(
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
