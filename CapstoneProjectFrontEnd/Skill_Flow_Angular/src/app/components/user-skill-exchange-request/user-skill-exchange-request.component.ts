import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillExchangeRequestService } from 'src/app/services/skill-exchange-request.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-skill-exchange-request',
  templateUrl: './user-skill-exchange-request.component.html',
  styleUrls: ['./user-skill-exchange-request.component.scss']
})
export class UserSkillExchangeRequestComponent implements OnInit, OnChanges {
  @Input() friendId!: number;
  skillExchangeForm!: FormGroup;
  formVisible = false; // Gestisce la visibilità del form
  userId!: number;

  constructor(private fb: FormBuilder, private skillExchangeService: SkillExchangeRequestService, private authSrv: AuthService ) { }

  ngOnInit(): void {
    this.initializeForm(); // Inizializza il form al caricamento del componente
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['friendId'] && !changes['friendId'].firstChange) {
      // Aggiorna il valore di responderId nel form solo se è cambiato dopo la prima inizializzazione
      this.skillExchangeForm.get('friendId')?.setValue(this.friendId);
    }
  }

  private initializeForm(): void {
    this.authSrv.user$.subscribe(user => {
      if (user && user.user.id) {
       this.userId = user.user.id;
       console.log('User ID:', this.userId, 'friendId:',this.friendId);  
      } else {
        console.error('User ID is not available.');
      }

    this.skillExchangeForm = this.fb.group({
      requesterId: [this.userId, Validators.required],
      responderId: [this.friendId, Validators.required],
      details: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required]
    });
    });
  }

  toggleForm(): void {
    this.formVisible = !this.formVisible;
  }

  submitRequest(): void {
    if (this.skillExchangeForm.valid) {
      this.skillExchangeService.createSkillExchangeRequest(this.skillExchangeForm.value, this.userId).subscribe({
        next: () => {
          console.log('Request sent successfully');
          this.toggleForm(); // Chiudi il form dopo l'invio
        },
        error: (err) => console.error('Error sending request:', err)
      });
    } else {
      console.error('Form is not valid:', this.skillExchangeForm.errors);
    }
  }
}
