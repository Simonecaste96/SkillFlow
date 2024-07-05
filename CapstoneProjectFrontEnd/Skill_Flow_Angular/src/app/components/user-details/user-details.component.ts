import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthLogin } from 'src/app/interfaces/auth-login';
import { ReviewsReceived } from 'src/app/interfaces/reviews-received';
import { User } from 'src/app/interfaces/user';
import { ReviewService } from 'src/app/services/review.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  user!: User;
  userInterest!: string;
  userId!: number;
  userIdParam!: string;
  reviews!: ReviewsReceived[];


  constructor(private authSrv:AuthService, private reviewSrv:ReviewService, private route:ActivatedRoute, private userSrv:UserService) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe(user => {
      this.userId = user?.user.id!;
      
    }
    );
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.userIdParam = id!;
    });

    if(this.userIdParam) {
      this.userSrv.getUser(this.userIdParam).subscribe(
        (data: User) => {
          this.user = data;
          console.log('User:', this.user);
        },
        (error) => {
          console.error('Errore nel caricamento dell\'utente', error);
        }
      );
      this.reviewSrv.getReviewsFindId(this.userIdParam).subscribe(
        (data: ReviewsReceived[]) => {
          this.reviews = data;
          console.log('Reviews:', this.reviews);
        },
        
        (error) => {
          console.error('Errore nel caricamento delle recensioni', error);
        }
      );
    

    }
    else{
      this.userSrv.getUser(this.userId.toString()).subscribe(
        (data: User) => {
          this.user = data;
          console.log('User:', this.user);
        },
        (error) => {
          console.error('Errore nel caricamento dell\'utente', error);
        }
      );
     this.reviewSrv.getReviewsFindId(this.userId).subscribe(
      (data: ReviewsReceived[]) => {
        this.reviews = data;
        console.log('Reviews:', this.reviews);
      },
      (error) => {
        console.error('Errore nel caricamento delle recensioni', error);
      }
    ); 
    }
  }

}