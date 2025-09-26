import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonImg, IonContent, IonButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';
import { GoogleLoginResponseOffline, GoogleLoginResponseOnline, SocialLogin } from '@capgo/capacitor-social-login';
import { environment } from 'src/environments/environment';
import { AppState } from '../states/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { AppActions } from '../states/actions/app.actions';
import { ISignUp } from '../utils/interfaces';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  imports: [
    IonContent, 
    IonButton,
    IonIcon,
    IonText,
    IonImg,
    CommonModule, 
    FormsModule
  ]
})
export class WelcomePage implements OnInit {

  constructor(private store: Store<AppState>) { 
    addIcons({ logoGoogle });
  }

  ngOnInit() {
  }

  /**
   * Sigin in with Google handler
   */
  async onSignInWithGoogle() {
    const res = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['profile', 'email'],
      }
    });

    if (res) {
      console.log('Google login response:', res);
      const result: GoogleLoginResponseOnline | GoogleLoginResponseOffline= res.result;

      // For django allauth headless
      if (result.responseType === 'online') {
        const idToken = result.idToken;
        const clientId = environment.googleWebClientId;
        const payload: ISignUp = {
          process: 'login',
          provider: res.provider,
          token: {
            client_id: clientId,
            id_token: idToken as string,
          }
        }

        this.store.dispatch(AppActions.signUp({ data: payload }));
      }
    }
  }

}
