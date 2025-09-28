import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { IonText, IonButtons, IonButton, IonSpinner, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { camera, cloudUpload, documentText, documentTextOutline, play, settings, settingsOutline } from 'ionicons/icons';
import { AppActions } from 'src/app/states/actions/app.actions';
import { AppState } from 'src/app/states/reducers/app.reducer';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileTransfer as FileTransferCapacitor } from '@capacitor/file-transfer';
import { NativeAudio } from '@capacitor-community/native-audio';

declare var Media: any;

@Component({
  selector: 'app-page-file-item',
  templateUrl: './page-file-item.component.html',
  styleUrls: ['./page-file-item.component.scss'],
  imports: [
    IonItem,
    IonLabel,
    IonIcon,
    IonButtons,
    IonButton,
    IonSpinner,
    IonText,
  ],
  providers: [
    FileTransfer,
    File,
  ]
})
export class PageFileItemComponent  implements OnInit {

  @Input() page: any;

  @Output() onReUploadPage = new EventEmitter<any>();
  @Output() onEditPage = new EventEmitter<any>();

  intervalId: any;
  reuploadIntervalId: any;
  downloadInProgress: boolean = false;
  localPath: string | null = null;
  media: any = null;

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private fileTransfer: FileTransfer,
    private file: File,
  ) { 
    addIcons ({ documentTextOutline, play, settingsOutline, camera, cloudUpload });

    this.actions$.pipe(takeUntilDestroyed()).subscribe((action: any) => {
      switch (action.type) {
        case AppActions.getPageSuccess.type:
          if (action.data.id === this.page.id) {
            const newFile = this.getFilename(action.data?.audiofile?.audio_file?.split('?')[0]);
            const oldFile = this.getFilename(this.page?.audiofile?.audio_file?.split('?')[0]);

            console.log('newFile:', newFile);
            console.log('oldFile:', oldFile);

            if (action.source === 'recently-added') {
              if (this.page?.created == true) {
                if (action.data.audiofile) {
                  // stop interval if audiofile is available
                  // NOTE!: make sure only accepted from source 'recently-added'
                  console.log('Clear interval for recently added page');
                  clearInterval(this.intervalId);
                  this.processDownload(action.data.audiofile);
                }
              } else if (this.page?.updated == true) {
                // compare file is same or not
                if (this.page?.audiofile && (newFile !== oldFile)) {
                  console.log('Clear interval for recently added page (updated)');
                  clearInterval(this.intervalId);
                  this.processDownload(action.data.audiofile);
                }
              }
            } else if (action.source === 'recently-reuploaded') {
              console.log('Received updated page from recently-reuploaded');
              if ((this.page?.audiofile && (newFile !== oldFile)) || (!this.page?.audiofile && action.data?.audiofile)) {
                console.log('Clear interval for recently uploaded page');
                clearInterval(this.reuploadIntervalId);
                this.processDownload(action.data.audiofile);
              }
            }
          }
          break;
        
        case AppActions.updatePageSuccess.type:
          if (action.data.id === this.page.id) {
            if (action.source === 'reuploaded') {
              console.log('This page was recently re-uploaded:', this.page);
              if (!this.reuploadIntervalId) {
                this.reuploadIntervalId = setInterval(() => {
                  this.store.dispatch(AppActions.getPage({ id: this.page.id, source: 'recently-reuploaded' }));
                }, 5000);
              }
            }
          }
          break;
        
        case AppActions.insertPageSuccess.type:
          if (action.data.id === this.page.id) {
            if (action.data.updated) {
              console.log('This page was recently updated:', this.page);
              this.intervalId = setInterval(() => {
                this.store.dispatch(AppActions.getPage({ id: this.page.id, source: 'recently-added' }));
              }, 5000);
            }
          }
          break;
      }
    });
  }

  getFilename(path: string) {
    return path?.split('/')?.pop()!.split('\\').pop() || '';
  }

  getFilenameFromUrl(url: string) {
    const urlObj = new URL(url);
    return urlObj.pathname?.split('/').pop();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.page?.recently_added && this.page?.created) {
      console.log('This page was recently added:', this.page);
      this.intervalId = setInterval(() => {
        this.store.dispatch(AppActions.getPage({ id: this.page.id, source: 'recently-added' }));
      }, 5000);
    }

    if (this.page?.recently_reuploaded) {
      console.log('This page was recently re-uploaded:', this.page);
      this.reuploadIntervalId = setInterval(() => {
        this.store.dispatch(AppActions.getPage({ id: this.page.id, source: 'recently-reuploaded' }));
      }, 5000);
    }

    // get local audio file path if exists
    setTimeout(() => {
      this.localPath = this.getLocalAudioFilePath(this.page);
    }, 250);
  }

  /**
   * Process the download of a Google Storage audiofile.
   * Group the audio files in a directory named after the collection ID.
   * 
   * @param audiofile Google Storage audiofile object
   * @returns 
   */
  async processDownload(audiofile: any) {
    const collectionId = this.page?.biblio_collection;
    const collectionDir = `sounds/${collectionId}`;
    
    if (!collectionId) {
      console.log('No collection associated with this page');
      return;
    }

    const file = audiofile?.audio_file;  // from google storage
    if (!file) {
      console.log('No audio file to download');
      return;
    }

    console.log('Starting file download:', file);

    const filename = this.getFilenameFromUrl(file);
    this.downloadInProgress = true;

    // ensure the directory exists
    const dirExists = await this.file.checkDir(this.file.dataDirectory, collectionDir);
    if (!dirExists) await this.createSoundsDir(collectionDir);

    try {
      const fileTransfer = this.fileTransfer.create();
      const target = `${collectionDir}/${filename}`;
      const response = await fileTransfer.download(file, this.file.dataDirectory + target, true);
      console.log('File downloaded successfully:', response);

      // release previous media if any
      if (this.media) {
        this.media.release();
        this.media = null;
      }

      // Initialize Media object for playback
      this.media = new Media(response.nativeURL,
        () => { console.log('Media success'); },
        (err: any) => { console.error('Media error:', err); }
      );
    } catch (error) {
      console.error('File download error:', error);
    }

    // download complete
    this.downloadInProgress = false;

    // debug: list files in the directory
    const files = await Filesystem.readdir({
      directory: Directory.Data,
      path: collectionDir,
    });

    console.log('Files in data directory:', files.files);
  }

  async createSoundsDir(collectionDir: string) {
    await Filesystem.mkdir({
      directory: Directory.Data,
      path: collectionDir,
      recursive: true
    });
  }

  reUploadPage(page: any) {
    this.onReUploadPage.emit(page);
  }

  editPage(page: any) {
    this.onEditPage.emit(page);
  }

  getLocalAudioFilePath(page: any) {
    if (page?.audiofile?.audio_file) {
      const filename = this.getFilenameFromUrl(page.audiofile.audio_file?.split('?')[0]);
      return `${filename}`;
    }

    return null;
  }

  /**
   * Play local audio file
   */
  async playAudio(page: any) {
    console.log('Playing audio for page:', page);

    if (!this.media) {
      console.log('Media object not initialized');
      return;
    }

    this.media.play();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.reuploadIntervalId) {
      clearInterval(this.reuploadIntervalId);
    }
  }

}
