import  { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostInterface } from 'src/app/interfaces/post-interface';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit, OnDestroy{

  posts!: PostInterface[];
  userId!: number | undefined;
  like!: number;
 

 

  userSubscribe!: Subscription;


  constructor(
    private userSrv:UserService,

  ){}

  ngOnInit(): void {
    this.userSrv.getPosts();


    this.userSubscribe = this.userSrv.posts$.subscribe(
      (data: PostInterface[]) => {
        this.posts = data;
        console.log(data);
      }
    );
    

    
  }
 
   buttonLike(postId: number, like: boolean) {
    this.userSrv.toggleLike(postId, like).subscribe({
      next: likesCount => {
       this.like = likesCount;
      },
      error: error => {
        console.error('Errore durante il like del post!', error);
      }
    });
  }


  ngOnDestroy(): void {
    if (this.userSubscribe) {
      this.userSubscribe.unsubscribe();
    }
  }

}



