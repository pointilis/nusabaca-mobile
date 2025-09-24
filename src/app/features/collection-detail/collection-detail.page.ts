import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/states/reducers/app.reducer';
import { AppActions } from 'src/app/states/actions/app.actions';
import { selectCollectionDetail } from 'src/app/states/selectors/app.selectors';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.page.html',
  styleUrls: ['./collection-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DecimalPipe,
  ]
})
export class CollectionDetailPage implements OnInit {

  collectionId: string | null = this.route.snapshot.paramMap.get('id');
  collection$ = this.store.pipe(select(selectCollectionDetail));

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store.dispatch(AppActions.getCollection({ id: this.collectionId || '' }));
  }

}
