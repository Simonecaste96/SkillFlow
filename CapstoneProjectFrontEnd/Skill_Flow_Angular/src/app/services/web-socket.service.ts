import { Injectable } from '@angular/core';
import { Client, Frame } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatInterface } from '../interfaces/chat-interface';
import { StompSubscription } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;

  private privateMessagesSubject = new BehaviorSubject<ChatInterface | null>(null);
  privateMessages$ = this.privateMessagesSubject.asObservable();

  private subscriptionsMap: { [key: string]: StompSubscription } = {};

  private baseUrl = 'http://localhost:4201/skill_flow/';
  

  constructor(private http: HttpClient) {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:4201/ws') as WebSocket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(new Date(), str);
      }
    });

    
    this.client.onConnect = (frame: Frame) => {
      console.log('Connected to WebSocket:', frame);
    };

    this.client.onStompError = (frame: Frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.onWebSocketClose = (event: CloseEvent) => {
      console.error('WebSocket connection closed:', event);
      this.handleReconnect();
    };

    this.client.onWebSocketError = (event: Event) => {
      console.error('WebSocket error:', event);
      this.handleReconnect();
    };

    this.client.activate();
  }

  connect() {
    if (!this.client.active) {
      console.log('Activating WebSocket client');
      this.client.activate();
    }
  }

  disconnect() {
    if (this.client.active) {
      console.log('Deactivating WebSocket client');
      this.client.deactivate();
    }
  }

  subscribeToPrivateMessages(userId1: number, userId2: number) {
    const subscriptionKey = `${userId1}-${userId2}`;

    // Disconnetti la vecchia sottoscrizione se esiste
    if (this.subscriptionsMap[subscriptionKey]) {
      console.log('Unsubscribing from previous subscription for', subscriptionKey);
      this.subscriptionsMap[subscriptionKey].unsubscribe();
      delete this.subscriptionsMap[subscriptionKey];
    }

    this.getRoomId(userId1, userId2).toPromise().then(roomId => {
      console.log(`Subscribing to room ${roomId}`);
      const subscription = this.client.subscribe(`/topic/${roomId}`, (message) => {
        if (message.body) {
          const newMessage: ChatInterface = JSON.parse(message.body);
          console.log('Received private message:', newMessage);
          this.privateMessagesSubject.next(newMessage);
        }
      }, { id: subscriptionKey });

      this.subscriptionsMap[subscriptionKey] = subscription;
    }).catch(error => {
      console.error('Errore durante la sottoscrizione ai messaggi privati:', error);
    });
  }


    sendPrivateMessage(message: ChatInterface, userId1: number, userId2: number) {
      this.getRoomId(userId1, userId2).subscribe(roomId => {
        this.client.publish({ destination: `/app/chat/${roomId}`, body: JSON.stringify(message) });
      });
    }

    
  getRoomId(userId1: number, userId2: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}chat/room-id/${userId1}/${userId2}`);
  }

  loadChatHistory(roomId:number): Observable<ChatInterface[]> {
    return this.http.get<ChatInterface[]>(`${this.baseUrl}chat/history/${roomId}`);
  }


  private handleReconnect() {
    console.log('Attempting to reconnect...');
    setTimeout(() => {
      if (!this.client.active) {
        this.client.activate();
      }
    }, this.client.reconnectDelay);
  }


}
