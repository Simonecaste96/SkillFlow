import { Component, OnDestroy, OnInit } from '@angular/core';
import { SkillExchangeRequestService } from 'src/app/services/skill-exchange-request.service';
import { SkillExchangeResponse } from 'src/app/interfaces/skill-exchange-response';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exchange-request-list',
  templateUrl: './exchange-request-list.component.html',
  styleUrls: ['./exchange-request-list.component.scss']
})
export class ExchangeRequestListComponent implements OnInit, OnDestroy {

  exchangeRequests: SkillExchangeResponse[] = [];
  userId!: number;
  updateIntervalId: any;
  private subscriptions: Subscription[] = [];

  constructor(private skillExchangeRequestService: SkillExchangeRequestService) {}

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson).user;
      this.userId = user.id;

    this.updateIntervalId = setInterval(() => {

        this.skillExchangeRequestService.getSkillExchangeRequests(this.userId).subscribe((requests: SkillExchangeResponse[]) => {
          this.exchangeRequests = requests;
        });
      }, 1000);
    }
  }


  
  ngOnDestroy(): void {
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  acceptRequest(requestId: number): void {
    this.subscriptions.push(
      this.skillExchangeRequestService.handleSkillExchangeRequest(requestId, true, this.userId).subscribe(
        () => {
          console.log('Richiesta accettata con successo');
        },
        error => {
          console.error('Errore nell\'accettare la richiesta:', error);
        }
      )
    );
  }

  rejectRequest(requestId: number): void {
    this.subscriptions.push(
      this.skillExchangeRequestService.handleSkillExchangeRequest(requestId, false, this.userId).subscribe(
        () => {
          console.log('Richiesta rifiutata con successo');
        },
        error => {
          console.error('Errore nel rifiutare la richiesta:', error);
        }
      )
    );
  }
}
