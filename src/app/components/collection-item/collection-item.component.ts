import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonItem, IonLabel, IonThumbnail, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { play } from 'ionicons/icons';

@Component({
  selector: 'app-collection-item',
  templateUrl: './collection-item.component.html',
  styleUrls: ['./collection-item.component.scss'],
  imports: [
    RouterModule,
    DecimalPipe,
    IonLabel,
    IonIcon,
    IonItem,
    IonThumbnail,
  ]
})
export class CollectionItemComponent  implements OnInit {

  @Input() collection: any;
  
  constructor() { 
    addIcons({ play })
  }

  ngOnInit() {}

}
