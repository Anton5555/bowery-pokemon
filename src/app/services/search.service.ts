import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private textSource = new BehaviorSubject('');
  currentText = this.textSource.asObservable();

  constructor() { }

  changeText(text: string) {
    this.textSource.next(text);
  }
}
