import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class AccountPage {
  constructor() {}
}
