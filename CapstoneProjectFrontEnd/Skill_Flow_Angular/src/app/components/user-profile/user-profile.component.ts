import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { PostInterface } from 'src/app/interfaces/post-interface';
import { UserSkillService } from 'src/app/services/user-skill.service';
import { SkillInterface } from 'src/app/interfaces/skill-interface';
import { ReviewService } from 'src/app/services/review.service';
import { ReviewsReceived } from 'src/app/interfaces/reviews-received';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user!: User;
  skills!: SkillInterface[];
  reviews!: ReviewsReceived[];
  //loading: boolean = true; // Stato di caricamento valuare se tenerlo o no
  postByUserId!:PostInterface[];

  userId!: string;
  userIdParam!: string;

  constructor(
    private userSrv: UserService, 
    private route: ActivatedRoute,
    private skillSrv: UserSkillService,
    private reviewSrv: ReviewService,
    
  ) {}

  /*
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
    
        this.userSrv.getUser(id).subscribe({
          next: (data: User) => {
            this.user = data;
            this.loadUserPosts(id);
          },
          error: (error) => {
            console.error("Errore nel recupero dell'utente:", error);
          
          }
        });
      } else {
        console.error("ID utente non trovato nella rotta");
   
      }
    });
  }
*/

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    this.userIdParam = id!;
    this.loadUserPosts(id!);
  });
  
  const userString = localStorage.getItem('user');
    if (userString) { 
      const user = JSON.parse(userString);
      const id = user.user.id;
      this.userId = id;
    }

}
  
  loadUserPosts(id: string): void {
    this.userSrv.getPostsByUser(id).subscribe({
      next: (posts: PostInterface[]) => {
        this.postByUserId = posts;
        console.log("Posts dell'utente:", posts);
      },
      error: (error) => {
        console.error("Errore nel recupero dei post dell'utente:", error);
      }
    });
  }


  loadUserSkills(id: string): void {
    this.skillSrv.getSkills(id).subscribe({
      next: (skills: SkillInterface[]) => {
        this.skills = skills;
        console.log("Skills dell'utente:", skills);
      },
      error: (error) => {
        console.error("Errore nel recupero delle skills dell'utente:", error);
      }
    });
  }

  loadUserReviews(id: number): void {
this.reviewSrv.getReviewsFindId(id).subscribe({
next: (reviews: ReviewsReceived[]) => {
this.reviews = reviews;
}
});
}

}
