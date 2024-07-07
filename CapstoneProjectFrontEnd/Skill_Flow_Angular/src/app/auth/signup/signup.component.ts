/*import { Component, OnInit } from '@angular/core';
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
  */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  allInterests: string[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      pictureProfile: [null],
      interests: [[]],
      selectedInterest: ['']
    });
  }

  ngOnInit(): void {
    this.authSrv.getInterestList().subscribe(
      (data: string[]) => {
        this.allInterests = data;
      },
      (error) => {
        console.error('Error loading interests', error);
      }
    );
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = new FormData();
      formData.append('userDTO', new Blob([JSON.stringify(this.signupForm.value)], { type: 'application/json' }));

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
  }

  addInterest(): void {
    const interest = this.signupForm.get('selectedInterest')?.value;
    const interests = this.signupForm.get('interests')?.value || [];

    if (interest && !interests.includes(interest)) {
      interests.push(interest);
      this.signupForm.get('interests')?.setValue(interests);
      this.signupForm.get('selectedInterest')?.setValue('');
    }
  }

  deleteInterest(index: number): void {
    const interests = this.signupForm.get('interests')?.value || [];
    interests.splice(index, 1);
    this.signupForm.get('interests')?.setValue(interests);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        const previewImage = document.getElementById('profilePreview') as HTMLImageElement;
        if (previewImage) {
          previewImage.src = e.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    const previewImage = document.getElementById('profilePreview') as HTMLImageElement;
    if (previewImage) {
      previewImage.src = '../../../assets/img/profile-default.svg';
    }
  }
}


