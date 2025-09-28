import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent, IonSpinner, IonList, ActionSheetController, ModalController, AlertController, IonText, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TakePhotoComponent } from '../take-photo/take-photo.component';
import { addIcons } from 'ionicons';
import { camera, close, cloudUpload, trash } from 'ionicons/icons';
import { IPageFile, IPagination } from 'src/app/utils/interfaces';
import { Photo } from '@capacitor/camera';
import { AppActions } from 'src/app/states/actions/app.actions';
import { AppState } from 'src/app/states/reducers/app.reducer';
import { select, Store } from '@ngrx/store';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { Endpoints } from 'src/app/utils/endpoints';
import { AuthService } from 'src/app/utils/services/auth';
import { UploadPageOptionsComponent } from '../upload-page-options/upload-page-options.component';
import { Observable } from 'rxjs';
import { selectPageFileList } from 'src/app/states/selectors/app.selectors';
import { AsyncPipe } from '@angular/common';
import { PageFileItemComponent } from '../page-file-item/page-file-item.component';
import { Actions } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-page-file-list',
  templateUrl: './page-file-list.component.html',
  styleUrls: ['./page-file-list.component.scss'],
  imports: [
    IonButton,
    IonIcon,
    IonText,
    IonList,
    IonSpinner,
    TakePhotoComponent,
    AsyncPipe,
    PageFileItemComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  providers: [
    FileTransfer,
  ]
})
export class PageFileListComponent  implements OnInit {

  @Input('collection') collection: any;

  @ViewChild(TakePhotoComponent) takePhotoComponent!: TakePhotoComponent;

  options: any = {};
  params: IPagination = {
    limit: 50,
    offset: 0,
  };

  pages$!: Observable<{ data: any; status: string; error: any; }>;
  reUploadPage: any = null;

  infiniteEvent: InfiniteScrollCustomEvent | undefined;
  disableInfinite: boolean = false;
  
  constructor(
    private store: Store<AppState>,
    private fileTransfer: FileTransfer,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private sheetCtrl: ActionSheetController,
    private actions$: Actions,
  ) { 
    addIcons({ camera, trash, cloudUpload, close });

    this.pages$ = this.store.pipe(select(selectPageFileList));

    this.actions$.pipe(takeUntilDestroyed()).subscribe((action: any) => {
      switch (action.type) {
        case AppActions.getPagesSuccess.type:
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

  /**
   * Upload page options modal
   */
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

  /**
   * Actionsheet edit
   */
  async editPageOptions(page: any) {
    const sheet = await this.sheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Re-upload Halaman',
          icon: 'cloud-upload',
          handler: () => {
            this.onReUploadPage(page);
          }
        },
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            this.onDeletePage(page);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        }
      ]
    });

    await sheet.present();
  }

  ngOnInit() {
    this.store.dispatch(AppActions.getPages({ collectionId: this.collection.id, params: this.params }));
  }

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
    console.log('reUploadPage:', this.reUploadPage);
    
    let endpoint = `${environment.apiUrl}${Endpoints.AudiobookPages}`;
    if (this.reUploadPage) {
      endpoint = `${environment.apiUrl}${Endpoints.RetrieveAudiobookPage.replace(':id', this.reUploadPage.id)}`;
      this.options = {
        ...this.options,
        page_number: this.reUploadPage.page_number,
        biblio_collection: this.reUploadPage.biblio_collection,
        language: this.reUploadPage.language,
        voice_gender: this.reUploadPage.voice_gender,
      }
    }

    try {
      const token = await this.authService.getToken();
      const fileTransfer = this.fileTransfer.create();

      console.log('Uploading to endpoint:', endpoint);
      console.log('With options:', this.options);

      const { response } = await fileTransfer.upload(
        photo.path as string, 
        endpoint, 
        {
          // headers and params as needed
          fileKey: 'page_file',
          fileName: `${this.collection.id}-page.jpg`,
          mimeType: 'image/jpeg',
          chunkedMode: false,
          httpMethod: this.reUploadPage ? 'PUT' : 'POST',
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
      
      if (this.reUploadPage) {
        console.log('Re-upload success');
        this.store.dispatch(AppActions.updatePageSuccess({ 
          data: JSON.parse(response), 
          pageId: this.reUploadPage.id,
          source: 'reuploaded',
        }));
        this.reUploadPage = null; // reset after re-upload
      } else {
        console.log('Upload success');
        this.store.dispatch(AppActions.insertPageSuccess({ data: JSON.parse(response) }));
      }
    } catch (error) {
      this.store.dispatch(AppActions.insertPageFailure({ error }));
    }
  }

  /**
   * Listen to re-upload event from child component
   */
  onReUploadPage(page: any) {
    this.reUploadPage = page;
    this.takePhotoComponent.openCamera();
  }

  /**
   * Listen to edit event from child component
   */
  onEditPage(page: any) {
    console.log('Edit page event received:', page);
    this.reUploadPage = page;
    this.editPageOptions(page);
  }

  /**
   * Delete page handler
   * @param page The page to delete
   */
  onDeletePage(page: any) {
    console.log('Delete page event received:', page);
    this.store.dispatch(AppActions.deletePage({ pageId: page.id }));
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.infiniteEvent = event;

    this.params = {
      ...this.params,
      offset: this.params.offset + this.params.limit,
    };

    this.store.dispatch(AppActions.getPages({ 
      collectionId: this.collection.id, 
      params: this.params, 
      source: 'load-more' 
    }));
  }

}
