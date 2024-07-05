import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { gsap } from 'gsap';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/interfaces/review-interface';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-review',
  templateUrl: './user-review.component.html',
  styleUrls: ['./user-review.component.scss']
})
export class UserReviewComponent implements OnInit {
  reviewForm!: FormGroup;
  submitted = false;
  userId!: number;
  @Input() friendId!: number;

  formOpened = false; // Flag per tenere traccia se il form è aperto o chiuso
  ratingSelected = 0; // Valutazione selezionata dall'utente

  constructor(private fb: FormBuilder, private reviewService: ReviewService, private authSrv: AuthService) { }

  ngOnInit(): void {
    this.authSrv.user$.subscribe(user => {
      if (user) {
        this.userId = user.user.id;
      }
    });
    this.initForm();
  }

  initForm(): void {
    this.reviewForm = this.fb.group({
      reviewer: [this.userId, Validators.required], // ID dell'utente che lascia la recensione
      reviewed: [this.friendId, Validators.required], // ID dell'utente che riceve la recensione
      //rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]], // Valutazione da 1 a 5
      reviewText: ['', Validators.required]
    });
  }

  toggleForm(): void {
    this.formOpened = !this.formOpened; // Inverti lo stato del flag per aprire o chiudere il form
  }

  setRating(rating: number): void {
    this.ratingSelected = rating; // Imposta la valutazione selezionata

    // Aggiungi classe CSS "selected" alle stelle fino alla valutazione selezionata
    const stars = document.querySelectorAll('.rating-container .star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });

    // Aggiorna il valore del campo di form "rating"
    this.reviewForm.patchValue({
      rating: rating
    });
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      const reviewData: Review = this.reviewForm.value;
      console.log('Dati recensione:', reviewData);
      this.reviewService.createReview(reviewData, this.userId).subscribe(
        () => {
          console.log('Recensione inviata con successo!');

    
          this.submitted = true; // Visualizza il feedback visivo di successo
          
            // Ripristina lo stato per consentire nuove recensioni
            this.submitted = false;
            this.ratingSelected = 0; // Resetta la valutazione selezionata
            this.reviewForm.reset(); // Reimposta il form dopo l'invio
            this.toggleForm(); // Chiudi il form dopo l'invio
        },
        error => {
          console.error('Errore durante l\'invio della recensione:', error);
          // Gestisci gli errori in base alle esigenze dell'applicazione
        }
      );
    } else {
      console.error('Form non valido');
      // Gestisci eventuali errori di validazione del form
    }
  }
}
