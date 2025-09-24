import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppActions } from '../actions/app.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Endpoints } from 'src/app/utils/endpoints';
import { AuthService } from 'src/app/utils/services/auth';
import { Router } from '@angular/router';



@Injectable()
export class AppEffects {

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router,
  ) {}

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
      })
    ), { dispatch: false }
  );

  signUpFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.signUpFailure),
      map(({ error }) => {
        console.error('Sign Up Failed:', error);
      })
    ), { dispatch: false }
  );


  // ...
  // Insert Biblio Effect
  // ...
  insertBiblio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.insertBiblio),
      switchMap(({ data }) => {
        return this.httpClient.post(Endpoints.Collections, data).pipe(
          map((response) => {
            return AppActions.insertBiblioSuccess({
              data: response,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.insertBiblioFailure({ error: error }))
          })
        );
      })
    )
  );

  insertBiblioSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.insertBiblioSuccess),
      map(({ data }) => {
        console.log('Insert Biblio Successful:', data);
        this.router.navigate(['/tabs/home'], { replaceUrl: true });
      })
    ), { dispatch: false }
  );

  insertBiblioFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.insertBiblioFailure),
      map(({ error }) => {
        console.error('Insert Biblio Failed:', error);
      })
    ), { dispatch: false }
  );


  // ...
  // Get Collections Effect
  // ...
  getCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getCollections),
      switchMap(({ params, source }) => {
        return this.httpClient.get(Endpoints.Collections, { params }).pipe(
          map((response) => {
            return AppActions.getCollectionsSuccess({
              data: response,
              params,
              source
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.getCollectionsFailure({ error: error, params, source }))
          })
        );
      })
    )
  );

  getCollectionsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getCollectionsSuccess),
      map(({ data }) => {
        console.log('Get Collections Successful:', data);
      })
    ), { dispatch: false }
  );

  getCollectionsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getCollectionsFailure),
      map(({ error }) => {
        console.error('Get Collections Failed:', error);
      })
    ), { dispatch: false }
  );


  // ...
  // Retrieve Collection Effect
  // ...
  getCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getCollection),
      switchMap(({ id }) => {
        return this.httpClient.get(Endpoints.RetrieveCollection.replace(':id', id)).pipe(
          map((response) => {
            return AppActions.getCollectionSuccess({
              data: response,
              id
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(AppActions.getCollectionFailure({ error: error, id }))
          })
        );
      })
    )
  );

  getCollectionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getCollectionSuccess),
      map(({ data }) => {
        console.log('Get Collection Successful:', data);
      })
    ), { dispatch: false }
  );

  getCollectionFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getCollectionFailure),
      map(({ error }) => {
        console.error('Get Collection Failed:', error);
      })
    ), { dispatch: false }
  );
}
