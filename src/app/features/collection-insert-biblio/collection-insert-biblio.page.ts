import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons } from '@ionic/angular/standalone';
import { BiblioEditorComponent } from 'src/app/components/biblio-editor/biblio-editor.component';

@Component({
  selector: 'app-collection-insert-biblio',
  templateUrl: './collection-insert-biblio.page.html',
  styleUrls: ['./collection-insert-biblio.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButton,
    IonButtons,
    IonBackButton,
    CommonModule, 
    FormsModule,
    BiblioEditorComponent,
  ]
})
export class CollectionInsertBiblioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
