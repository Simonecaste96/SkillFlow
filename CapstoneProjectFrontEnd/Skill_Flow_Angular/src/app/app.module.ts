import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
/*Importo router*/
import { Route, RouterModule } from '@angular/router';
/*Importo http*/
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
/*Importo form*/
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';

/*Importo token interceptor */
import { TokenInterceptor } from './auth/token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ErrorComponent } from './components/error/error.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AuthGuard } from './auth/auth.guard';
import { UserChatComponent } from './components/user-chat/user-chat.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserPostComponent } from './components/user-post/user-post.component';
import { NotificationContainerComponent } from './components/notification-container/notification-container.component';
import { FriendRequestListComponent } from './components/friend-request-list/friend-request-list.component';
import { FriendRequestItemComponent } from './components/friend-request-item/friend-request-item.component';
import { UserSkillComponent } from './components/user-skill/user-skill.component';
import { WebSocketService } from './services/web-socket.service';
import { InterestFormatPipe } from './pipes/interest-format.pipe';
import { UserSkillExchangeRequestComponent } from './components/user-skill-exchange-request/user-skill-exchange-request.component';
import { UserReviewComponent } from './components/user-review/user-review.component';
import { ExchangeRequestListComponent } from './components/exchange-request-list/exchange-request-list.component';
import { UserAppointmentsComponent } from './components/user-appointments/user-appointments.component';

import { DatePipe } from '@angular/common';




//socket io
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// configurazione di Socket.io
const config: SocketIoConfig = { url: 'http://localhost:8080/ws', options: {} };

const routes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'mainContent',
    component: MainContentComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'chat',
        component: UserChatComponent,
      },
    ],
  },
  {
    path: 'userProfile/:id',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'skills',
        component: UserSkillComponent,
      },
      {
        path: 'appointments',
        component: UserProfileComponent,
      },
    ],
  },
  {
    path: '**',
    component: ErrorComponent,
  },
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    UserProfileComponent,
    UserDetailsComponent,
    UserChatComponent,
    MainContentComponent,
    FooterComponent,
    UserPostComponent,
    NotificationContainerComponent,
    FriendRequestListComponent,
    FriendRequestItemComponent,
    UserSkillComponent,
    InterestFormatPipe ,
    UserSkillExchangeRequestComponent,
    UserReviewComponent,
    ExchangeRequestListComponent,
    UserAppointmentsComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    DatePipe,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    SocketIoModule.forRoot(config)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    AuthService,
    WebSocketService,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
