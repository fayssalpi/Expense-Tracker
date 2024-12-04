import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageSource = new BehaviorSubject<string | null>(null); 
  currentMessage = this.messageSource.asObservable();

  constructor() {}

  // Update the message
  changeMessage(message: string | null): void {
    this.messageSource.next(message);
  }

  // Clear the message
  clearMessage(): void {
    this.messageSource.next(null);
  }}
