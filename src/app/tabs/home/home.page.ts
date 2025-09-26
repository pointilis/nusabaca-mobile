import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonIcon, IonText, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle } from 'ionicons/icons';
import { CollectionListComponent } from 'src/app/components/collection-list/collection-list.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton,
    IonButtons,
    IonIcon,
    IonText,
    RouterModule,
    NgStyle,
    CollectionListComponent,
  ],
})
export class HomePage {

  constructor() {
    addIcons({ addCircle });
  }

}
