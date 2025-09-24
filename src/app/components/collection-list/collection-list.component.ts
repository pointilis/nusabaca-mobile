import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable, takeUntil } from 'rxjs';
import { AppActions } from 'src/app/states/actions/app.actions';
import { AppState } from 'src/app/states/reducers/app.reducer';
import { selectCollectionList } from 'src/app/states/selectors/app.selectors';
import { IPagination } from 'src/app/utils/interfaces';
import { CollectionItemComponent } from '../collection-item/collection-item.component';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Actions } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    CollectionItemComponent,
  ]
})
export class CollectionListComponent  implements OnInit {
  
  params: IPagination = {
    limit: 10,
    offset: 0,
  };
  collections$!: Observable<{ data: any; status: string; error: any; }>;
  infiniteEvent: InfiniteScrollCustomEvent | undefined;
  disableInfinite: boolean = false;

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
  ) { 
    this.collections$ = this.store.pipe(select(selectCollectionList));

    this.actions$.pipe(takeUntilDestroyed()).subscribe((action: any) => {
      switch (action.type) {
        case AppActions.getBiblioCollectionsSuccess.type:
          if (action.source === 'load-more' && this.infiniteEvent) {
            this.infiniteEvent.target.complete();
          }

          if (action.data.results.length <= 0) {
            this.disableInfinite = true;
          }
          break;
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getBiblioCollections();
  }

  getBiblioCollections(source: string = '') {
    this.store.dispatch(AppActions.getBiblioCollections({ params: this.params, source: source }));
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.infiniteEvent = event;

    this.params = {
      ...this.params,
      offset: this.params.offset + this.params.limit,
    };

    this.getBiblioCollections('load-more');
  }

}
