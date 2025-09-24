import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppActions } from '../actions/app.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Endpoints } from 'src/app/utils/endpoints';
import { AuthService } from 'src/app/utils/services/auth';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Injectable()
export class AppEffects {

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private toastCtrl: ToastController,
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
        this.presentToast('Sign Up Failed. Please try again.', 2000, 'danger');
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
        return this.httpClient.patch(Endpoints.RetrieveCollection.replace(':id', id), data).pipe(
          map((response) => {
            return AppActions.updateBiblioCollectionSuccess({
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

  updateBiblioCollectionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateBiblioCollectionSuccess),
      map(({ data }) => {
        console.log('Update Biblio Collection Successful:', data);
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
        return this.httpClient.delete(Endpoints.RetrieveCollection.replace(':id', id)).pipe(
          map(() => {
            return AppActions.deleteBiblioCollectionSuccess({
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

  deleteBiblioCollectionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteBiblioCollectionSuccess),
      map(({ id }) => {
        console.log('Delete Biblio Collection Successful:', id);
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
        this.presentToast('Failed to delete book.', 2000, 'danger');
      })
    ), { dispatch: false }
  );
}
