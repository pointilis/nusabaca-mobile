import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppActions } from '../actions/app.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Endpoints } from 'src/app/utils/endpoints';
import { AuthService } from 'src/app/utils/services/auth';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular/standalone';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { FileTransfer, FileUploadOptions, FileUploadResult } from '@awesome-cordova-plugins/file-transfer/ngx';

@Injectable()
export class AppEffects {

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private toastCtrl: ToastController,
    private spinner: NgxSpinnerService,
    private fileTransfer: FileTransfer,
  ) {}

  async presentToast(message: string, duration: number = 2000, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  // ...
  // Sign Up Effect
  // ...
  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.signUp),
      mergeMap(({ data }) => {
        this.spinner.show();

        return this.httpClient.post(Endpoints.SignUp, data).pipe(
          map((response) => {
            return AppActions.signUpSuccess({
              data: response,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.signUpFailure({ error: error }))
          })
        )
      })
    )
  );

  signUpSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.signUpSuccess),
      map(async ({ data }) => {
        console.log('Sign Up Successful:', data);
        this.spinner.hide();
        await this.authService.saveSignUpData(data);
        this.router.navigate(['/tabs/home'], { replaceUrl: true });
        this.presentToast('Sign Up Successful!', 2000, 'success');
      })
    ), { dispatch: false }
  );

  signUpFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.signUpFailure),
      map(({ error }) => {
        console.error('Sign Up Failed:', error);
        this.spinner.hide();
        this.presentToast('Sign Up Failed. Please try again.', 2000, 'danger');
      })
    ), { dispatch: false }
  );


  // ...
  // Sign Out Effect
  // ...
  signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.signOut),
      switchMap(() => {
        this.spinner.show();
        return this.authService.clearAuthData().then(() => {
          return AppActions.signOutSuccess();
        }).catch((error) => {
          return AppActions.signOutFailure({ error });
        });
      })
    )
  );

  signOutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.signOutSuccess),
      map(() => {
        console.log('Sign Out Successful');
        this.spinner.hide();
        this.router.navigate(['/'], { replaceUrl: true });
        this.presentToast('Signed out successfully!', 2000, 'success');
      })
    ), { dispatch: false }
  );

  signOutFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.signOutFailure),
      map(({ error }) => {
        console.error('Sign Out Failed:', error);
        this.spinner.hide();
        this.presentToast('Failed to sign out. Please try again.', 2000, 'danger');
      })
    ), { dispatch: false }
  );


  // ...
  // Get Account Effect
  // ...
  getAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getAccount),
      switchMap(() => {
        return this.authService.getSignUpData().then((data) => {
          if (data) {
            return AppActions.getAccountSuccess({ data });
          } else {
            return AppActions.getAccountFailure({ error: 'No account data found' });
          }
        });
      })
    )
  );

  getAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getAccountSuccess),
      map(({ data }) => {
        console.log('Get Account Successful:', data);
      })
    ), { dispatch: false }
  );

  getAccountFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getAccountFailure),
      map(({ error }) => {
        console.error('Get Account Failed:', error);
      })
    ), { dispatch: false }
  );

  // ...
  // Insert Biblio Effect
  // ...
  insertBiblioCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.insertBiblioCollection),
      switchMap(({ data }) => {
        this.spinner.show();

        return this.httpClient.post(Endpoints.Collections, data).pipe(
          map((response) => {
            return AppActions.insertBiblioCollectionSuccess({
              data: response,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.insertBiblioCollectionFailure({ error: error }))
          })
        );
      })
    )
  );

  insertBiblioCollectionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.insertBiblioCollectionSuccess),
      map(({ data }) => {
        console.log('Insert Biblio Successful:', data);
        this.spinner.hide();
        this.router.navigate(['/tabs/home'], { replaceUrl: true });
        this.presentToast('Book added successfully!', 2000, 'success');
      })
    ), { dispatch: false }
  );

  insertBiblioCollectionFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.insertBiblioCollectionFailure),
      map(({ error }) => {
        console.error('Insert Biblio Failed:', error);
        this.spinner.hide();
        this.presentToast('Failed to add book.', 2000, 'danger');
      })
    ), { dispatch: false }
  );


  // ...
  // Get Biblio Collections Effect
  // ...
  getBiblioCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getBiblioCollections),
      switchMap(({ params, source }) => {
        return this.httpClient.get(Endpoints.Collections, { params }).pipe(
          map((response) => {
            return AppActions.getBiblioCollectionsSuccess({
              data: response,
              params,
              source
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.getBiblioCollectionsFailure({ error: error, params, source }))
          })
        );
      })
    )
  );

  getBiblioCollectionsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getBiblioCollectionsSuccess),
      map(({ data }) => {
        console.log('Get Biblio Collections Successful:', data);
      })
    ), { dispatch: false }
  );

  getBiblioCollectionsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getBiblioCollectionsFailure),
      map(({ error }) => {
        console.error('Get Biblio Collections Failed:', error);
      })
    ), { dispatch: false }
  );


  // ...
  // Retrieve Collection Effect
  // ...
  getBiblioCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getBiblioCollection),
      switchMap(({ id, source }) => {
        return this.httpClient.get(Endpoints.RetrieveCollection.replace(':id', id)).pipe(
          map((response) => {
            return AppActions.getBiblioCollectionSuccess({
              data: response,
              id,
              source
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.getBiblioCollectionFailure({ error: error, id, source }))
          })
        );
      })
    )
  );

  getBiblioCollectionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getBiblioCollectionSuccess),
      map(({ data }) => {
        console.log('Get Biblio Collection Successful:', data);
      })
    ), { dispatch: false }
  );

  getBiblioCollectionFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getBiblioCollectionFailure),
      map(({ error }) => {
        console.error('Get Biblio Collection Failed:', error);
      })
    ), { dispatch: false }
  );


  // ...
  // Update Collection Effect
  // ...
  updateBiblioCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateBiblioCollection),
      switchMap(({ id, data, source }) => {
        this.spinner.show();

        return this.httpClient.patch(Endpoints.RetrieveCollection.replace(':id', id), data).pipe(
          map((response) => {
            return AppActions.updateBiblioCollectionSuccess({
              data: response,
              id,
              source
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.updateBiblioCollectionFailure({ error: error, id, source }))
          })
        );
      })
    )
  );

  updateBiblioCollectionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateBiblioCollectionSuccess),
      map(({ data }) => {
        console.log('Update Biblio Collection Successful:', data);
        this.spinner.hide();
        this.presentToast('Book updated successfully!', 2000, 'success');
        this.location.back();
      })
    ), { dispatch: false }
  );

  updateBiblioCollectionFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateBiblioCollectionFailure),
      map(({ error }) => {
        console.error('Update Biblio Collection Failed:', error);
        this.spinner.hide();
        this.presentToast('Failed to update book.', 2000, 'danger');
      })
    ), { dispatch: false }
  );


  // ...
  // Delete Collection Effect
  // ...
  deleteBiblioCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteBiblioCollection),
      switchMap(({ id, source }) => {
        this.spinner.show();
        
        return this.httpClient.delete(Endpoints.RetrieveCollection.replace(':id', id)).pipe(
          map(() => {
            return AppActions.deleteBiblioCollectionSuccess({
              id,
              source
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.deleteBiblioCollectionFailure({ error: error, id, source }))
          })
        );
      })
    )
  );

  deleteBiblioCollectionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteBiblioCollectionSuccess),
      map(({ id }) => {
        console.log('Delete Biblio Collection Successful:', id);
        this.spinner.hide();
        this.router.navigate(['/tabs/home'], { replaceUrl: true });
        this.presentToast('Book deleted successfully!', 2000, 'success');
      })
    ), { dispatch: false }
  );

  deleteBiblioCollectionFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteBiblioCollectionFailure),
      map(({ error }) => {
        console.error('Delete Biblio Collection Failed:', error);
        this.spinner.hide();
        this.presentToast('Failed to delete book.', 2000, 'danger');
      })
    ), { dispatch: false }
  );


  // ...
  // Insert Page Effect
  // ...
  insertPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.insertPage),
      switchMap(async ({ data }) => {
        this.spinner.show();

        // Using Capacitor File Transfer to upload the file
        try {
          console.log('Insert Page Payload:', data);
          const options: FileUploadOptions = {
            fileKey: 'page_file',
            fileName: 'page.jpg',
            mimeType: 'image/jpeg',
            params: {
              page_number: data.page_number,
              biblio_collection: data.biblio_collection,
              voice_gender: data.voice_gender,
              language: data.language,
            },
            headers: {
              // Add any headers if needed, e.g., Authorization
              'Authorization': `Bearer ${await this.authService.getToken()}`
            }
          }

          const fileTransfer = this.fileTransfer.create();
          const uploadResult: FileUploadResult = await fileTransfer.upload(
            data.page_file,
            `${environment.apiUrl}${Endpoints.AudiobookPages}`,
            options,
          );

          return AppActions.insertPageSuccess({ data: uploadResult });
        } catch (error) {
          console.error('Error uploading file:', error);
          return AppActions.insertPageFailure({ error });
        }
      })
    )
  );

  insertPageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.insertPageSuccess),
      map(({ data }) => {
        console.log('Insert Page Successful:', data);
        this.spinner.hide();
        this.presentToast('Page added successfully!', 2000, 'success');
      })
    ), { dispatch: false }
  );
  insertPageFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.insertPageFailure),
      map(({ error }) => {
        console.error('Insert Page Failed:', error);
        this.spinner.hide();
        this.presentToast('Failed to add page.', 2000, 'danger');
      })
    ), { dispatch: false }
  );


  // ...
  // Get Pages Effect
  // ...
  getPages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getPages),
      switchMap(({ collectionId, params, source }) => {
        return this.httpClient.get(Endpoints.AudiobookPages, { params }).pipe(
          map((response) => {
            return AppActions.getPagesSuccess({
              data: response,
              collectionId,
              params,
              source
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.getPagesFailure({ error: error, collectionId, params, source }))
          })
        );
      })
    )
  );

  getPagesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getPagesSuccess),
      map(({ data }) => {
        console.log('Get Pages Successful:', data);
      })
    ), { dispatch: false }
  );

  getPagesFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getPagesFailure),
      map(({ error }) => {
        console.error('Get Pages Failed:', error);
      })
    ), { dispatch: false }
  );


  // ...
  // Get Page Effect
  // ...
  getPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getPage),
      switchMap(({ id, source }) => {
        return this.httpClient.get(Endpoints.RetrieveAudiobookPage.replace(':id', id)).pipe(
          map((response) => {
            return AppActions.getPageSuccess({
              data: response,
              id,
              source
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.getPageFailure({ error: error, id, source }))
          })
        );
      })
    )
  );

  getPageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getPageSuccess),
      map(({ data }) => {
        console.log('Get Page Successful:', data);
      })
    ), { dispatch: false }
  );

  getPageFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getPageFailure),
      map(({ error }) => {
        console.error('Get Page Failed:', error);
      })
    ), { dispatch: false }
  );


  // ...
  // Delete Page Effect
  // ...
  deletePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deletePage),
      switchMap(({ pageId }) => {
        this.spinner.show();
        return this.httpClient.delete(Endpoints.RetrieveAudiobookPage.replace(':id', pageId)).pipe(
          map(() => {
            return AppActions.deletePageSuccess({ pageId });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.deletePageFailure({ error, pageId }));
          })
        );
      })
    )
  );
  
  deletePageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deletePageSuccess),
      map(({ pageId }) => {
        console.log('Delete Page Successful:', pageId);
        this.spinner.hide();
        this.presentToast('Page deleted successfully!', 2000, 'success');
      })
    ), { dispatch: false }
  );

  deletePageFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deletePageFailure),
      map(({ error }) => {
        console.error('Delete Page Failed:', error);
        this.spinner.hide();
        this.presentToast('Failed to delete page.', 2000, 'danger');
      })
    ), { dispatch: false }
  )
}
