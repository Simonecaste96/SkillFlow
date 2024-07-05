import { Component, OnInit } from '@angular/core';
import { AuthSignup } from 'src/app/interfaces/auth-signup';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupInterface: AuthSignup = {
    username: '',
    name: '',
    surname: '',
    dateOfBirth: '',
    email: '',
    password: '',
    pictureProfile: null,
    interests: []
  };

  allInterests: string[] = [];
  selectedInterest: string = '';
  selectedFile: File | null = null;

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSrv.getInterestList().subscribe((data: string[]) => {
      this.allInterests = data;
    }, (error) => {
      console.error("Error loading interests", error);
    });
  }

  onSubmit(form: NgForm) {
    const formData = new FormData();
    formData.append('userDTO', new Blob([JSON.stringify({
      username: this.signupInterface.username,
      name: this.signupInterface.name,
      surname: this.signupInterface.surname,
      dateOfBirth: this.signupInterface.dateOfBirth,
      email: this.signupInterface.email,
      password: this.signupInterface.password,
      interests: this.signupInterface.interests
    })], {
      type: 'application/json'
    }));

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    this.authSrv.signup(formData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Errore durante la registrazione:', error);
        alert('Errore durante la registrazione: ' + error.message);
      }
    });
  
  }

  addInterest() {
    if (this.selectedInterest && !this.signupInterface.interests.includes(this.selectedInterest)) {
      this.signupInterface.interests.push(this.selectedInterest);
      this.selectedInterest = '';
    }
  }

  deleteInterest(index: number) {
    this.signupInterface.interests.splice(index, 1);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
