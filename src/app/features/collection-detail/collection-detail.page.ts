import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/states/reducers/app.reducer';
import { AppActions } from 'src/app/states/actions/app.actions';
import { selectCollectionDetail } from 'src/app/states/selectors/app.selectors';
import { ellipsisVertical, pencil, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ActionSheetController, AlertController } from '@ionic/angular';

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
    RouterModule,
  ]
})
export class CollectionDetailPage implements OnInit {

  collectionId: string | null = this.route.snapshot.paramMap.get('id');
  collection$ = this.store.pipe(select(selectCollectionDetail));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
  ) { 
    addIcons({ ellipsisVertical, pencil, trash })
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            console.log('Edit clicked');  
            this.router.navigate(['/collection-editor', this.collectionId]);
          }
        },
        {
          text: 'Delete', 
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
            this.presentDeleteConfirm();
          }
        }
      ]
    });

    await actionSheet.present();
  }

  async presentDeleteConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete cancelled');
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Item deleted');
            this.store.dispatch(AppActions.deleteBiblioCollection({ id: this.collectionId || '', source: 'detail-page' }));
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    if (this.collectionId) {
      this.store.dispatch(AppActions.getBiblioCollection({ id: this.collectionId || '' }));
    }
  }

}
