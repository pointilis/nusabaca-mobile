import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-collection-item',
  templateUrl: './collection-item.component.html',
  styleUrls: ['./collection-item.component.scss'],
  imports: [
    IonicModule,
    RouterModule,
    DecimalPipe,
  ]
})
export class CollectionItemComponent  implements OnInit {

  @Input() collection: any;
  
  constructor() { }

  ngOnInit() {}

}
