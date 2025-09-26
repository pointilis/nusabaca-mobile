import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { Platform } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { StatusBar, Style } from '@capacitor/status-bar';
import { environment } from 'src/environments/environment';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, NgxSpinnerModule],
})
export class AppComponent {

  constructor(private platform: Platform) {
    this.platform.ready().then(async () => {
      await this.platformInit();
    });
  }

  async platformInit() {
    console.log('Platform initialized');

    await SocialLogin.initialize({
      google: {
        webClientId: environment.googleWebClientId,        // Required for Android and Web
        mode: 'online',  // 'online' or 'offline'
      }
    });

    if (Capacitor.isNativePlatform()) {
      const setBackgroundColor = async () => {
        await EdgeToEdge.setBackgroundColor({ color: '#000000' });
        await StatusBar.setStyle({ style: Style.Dark });
      };

      setBackgroundColor();
    }
  }

}
