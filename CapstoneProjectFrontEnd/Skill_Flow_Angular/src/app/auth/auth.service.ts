import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthLogin } from '../interfaces/auth-login';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURL = environment.authUrl;
  interestListUrl = environment.interestsEnumControllerUrl;
  userControllerUrl = environment.userControllerUrl;
  jwtHelper = new JwtHelperService();
  userId!: number;

  private authSub = new BehaviorSubject<AuthLogin | null>(null);
  user$ = this.authSub.asObservable();

  private timeOut: any;

  constructor(private http: HttpClient, private router: Router) {
    this.restore();
  }

  login(data: { email: string; password: string }): Observable<AuthLogin> {
    return this.http.post<AuthLogin>(`${this.apiURL}login`, data).pipe(
      tap((data) => {
        if (!data || !data.token) {
          console.error('Dati di login non validi');
          throw new Error('Dati di login non validi');
        }
        this.authSub.next(data);
        localStorage.setItem('user', JSON.stringify(data));
        this.userId = data.user.id;
        this.setIsOnline(this.userId,true).subscribe();
        this.autoLogout(data);
      }),
      catchError((error) => this.errors(error))
    );
  }

  signup(formData: FormData): Observable<void> {
    return this.http.post<void>(`${this.apiURL}signup`, formData).pipe(
      tap(() => {console.log('Utente registrato con successo')}),
      catchError((error) => this.errors(error))
    );
  }

  getInterestList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.interestListUrl}interests`);
  }

  setIsOnline(userId:number,isOnline: boolean): Observable<void> {
     return this.http.put<void>(`${this.userControllerUrl}status/${userId}/${isOnline}`, null);
  }


  logout() {
    this.setIsOnline(this.userId,false).subscribe();
    this.authSub.next(null);
    localStorage.removeItem('user');
    clearTimeout(this.timeOut);
    this.router.navigate(['/']);
  }

  restore() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      console.log('Nessun utente nel localStorage');
      return;
    }
    try {
      const user: AuthLogin = JSON.parse(userJson);
      if (!user || !user.token || this.jwtHelper.isTokenExpired(user.token)) {
        console.log('Token non valido o scaduto, effettuare il login');
        this.logout();
      } else {
        console.log('Sessione valida:', user);
        this.authSub.next(user);
        this.autoLogout(user);
      }
    } catch (e) {
      console.error('Errore durante il parsing del token:', e);
      this.logout();
    }
  }

  autoLogout(user: AuthLogin) {
    const dateExpiration = this.jwtHelper.getTokenExpirationDate(user.token) as Date;
    const millisecondsExp = dateExpiration.getTime() - new Date().getTime();
    this.timeOut = setTimeout(() => {
      this.logout();
    }, millisecondsExp);
  }

  private errors(err: any) {
    console.log(err.error);
    switch (err.error) {
      case 'Email already exists':
        return throwError('utente già presente');
      case 'Incorrect password':
        return throwError('password errata');
      case 'Cannot find user':
        return throwError('Utente non trovato');
      default:
        return throwError('Errore nella chiamata');
    }
  }
}
