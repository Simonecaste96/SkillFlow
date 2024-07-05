import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { PostInterface } from 'src/app/interfaces/post-interface';
import { OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-post',
  templateUrl: './user-post.component.html',
  styleUrls: ['./user-post.component.scss']
})
export class UserPostComponent implements OnInit {
  userURL = environment.userControllerUrl;

  post = {
    content: ''
  };
  previews: string[] = [];
  file!: File;
  userId!: number;
  constructor(private http: HttpClient, private userSrv:UserService, private authSrv:AuthService) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe(user => {
      this.userId = user!.user.id!;
  });
  }
  
  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.previews = [];
      this.file = files[0];
  
      const reader = new FileReader();
      reader.onload = (e: any) => this.previews.push(e.target.result);
      reader.readAsDataURL(this.file);
    }
  }
  
  isImage(preview: string): boolean {
    return preview.startsWith('data:image');
  }
  
  onSubmit() {
    const formData = new FormData();
    formData.append('postDTO', new Blob([JSON.stringify(this.post)], { type: 'application/json' }));
    
    if (this.file) {
      formData.append('file', this.file, this.file.name);
    }
  
    this.http.post<PostInterface[]>(this.userURL + `users/post/${this.userId}`, formData).subscribe({
      next: response => {
        this.userSrv.getPosts()
        console.log('Post creato', response);
        this.post.content = '';
        this.previews = [];
       
      },
      error: error => {
        console.error('Errore durante la creazione del post!', error);
      }
    });

 
  }
  
  
  }
