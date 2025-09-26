import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController, IonText, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TakePhotoComponent } from '../take-photo/take-photo.component';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { IPageFile } from 'src/app/utils/interfaces';
import { Photo } from '@capacitor/camera';
import { AppActions } from 'src/app/states/actions/app.actions';
import { AppState } from 'src/app/states/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { Endpoints } from 'src/app/utils/endpoints';
import { AuthService } from 'src/app/utils/services/auth';
import { UploadPageOptionsComponent } from '../upload-page-options/upload-page-options.component';

@Component({
  selector: 'app-page-file-list',
  templateUrl: './page-file-list.component.html',
  styleUrls: ['./page-file-list.component.scss'],
  imports: [
    IonButton,
    IonIcon,
    IonText,
    TakePhotoComponent,
  ],
  providers: [
    FileTransfer,
  ]
})
export class PageFileListComponent  implements OnInit {

  @Input('collection') collection: any;

  @ViewChild(TakePhotoComponent) takePhotoComponent!: TakePhotoComponent;

  options: any = {};
  
  constructor(
    private store: Store<AppState>,
    private fileTransfer: FileTransfer,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) { 
    addIcons({ camera })
  }

  async uploadPageOptions() {
    const modal = await this.modalCtrl.create({
      component: UploadPageOptionsComponent,
      backdropDismiss: true,
      cssClass: 'small-modal',
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      this.options = data;
      console.log('Upload options:', this.options);
      this.takePhotoComponent.openCamera();
    }
  }

  ngOnInit() {}

  /**
   * Handle the photo taken event from TakePhotoComponent
   * @param photo The photo object returned from the camera
   */
  onAddPage() {
    this.uploadPageOptions();
  }

  /**
   * Process the uploaded photo
   * @param photo The photo object to upload
   * Upload the photo using FileTransfer and dispatch success/failure actions
   */
  async onPhotoTaken(photo: Photo) {
    console.log('Photo taken:', photo);

    try {
      const token = await this.authService.getToken();
      const fileTransfer = this.fileTransfer.create();
      const { response } = await fileTransfer.upload(
        photo.path as string, 
        `${environment.apiUrl}${Endpoints.AudiobookPages}`, 
        {
          // headers and params as needed
          fileKey: 'page_file',
          fileName: `${this.collection.id}-page.jpg`,
          mimeType: 'image/jpeg',
          chunkedMode: false,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            page_number: this.options.page_number,
            biblio_collection: this.collection.id,
            language: this.collection.language,
            voice_gender: this.options.voice_gender,
          }
        }
      );

      this.store.dispatch(AppActions.insertPageSuccess({ data: JSON.parse(response) }));
    } catch (error) {
      this.store.dispatch(AppActions.insertPageFailure({ error }));
    }
  }

}
