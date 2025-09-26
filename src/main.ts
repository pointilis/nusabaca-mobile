import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appReducer } from './app/states/reducers/app.reducer';
import { httpInterceptor } from './app/utils/interceptor/http-interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppEffects } from './app/states/effects/app.effects';
import { importProvidersFrom } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(
      BrowserAnimationsModule,
      NgxSpinnerModule.forRoot()
    ),
    provideIonicAngular({
      mode: 'md',
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideStore(appReducer),
    provideState({
      name: 'app',
      reducer: appReducer,
    }),
    provideEffects([AppEffects]),
    provideHttpClient(
      withInterceptors([
        httpInterceptor,
      ])
    ),
    FileTransfer,
  ],
});
