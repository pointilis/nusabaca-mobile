import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons } from '@ionic/angular/standalone';
import { BiblioEditorComponent } from 'src/app/components/biblio-editor/biblio-editor.component';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/states/reducers/app.reducer';
import { AppActions } from 'src/app/states/actions/app.actions';
import { Actions } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-collection-editor',
  templateUrl: './collection-editor.page.html',
  styleUrls: ['./collection-editor.page.scss'],
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
export class CollectionEditorPage implements OnInit {

  @ViewChild('biblioEditor') biblioEditor!: BiblioEditorComponent;

  collectionId: string | null = null;
  collection: any = null;
  title: string = 'Add New Book';

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private actions$: Actions,
  ) { 
    this.actions$.pipe(takeUntilDestroyed()).subscribe((action: any) => {
      switch (action.type) {
        case AppActions.getBiblioCollectionSuccess.type:
          if (action.source === 'edit-biblio') {
            this.collection = action.data;
          }
          break;
      }
    });
  }

  ngOnInit() {
    this.collectionId = this.route.snapshot.paramMap.get('id');
    if (this.collectionId) {
      this.title = 'Edit Book';
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.collectionId) {
        this.store.dispatch(AppActions.getBiblioCollection({ 
          id: this.collectionId as string,
          source: 'edit-biblio',
        }));
      }
    }, 100);
  }

}
