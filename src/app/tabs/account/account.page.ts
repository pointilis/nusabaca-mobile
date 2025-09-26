import { AsyncPipe, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { IonSpinner, IonText, IonIcon, IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { select, Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { logOut } from 'ionicons/icons';
import { Observable } from 'rxjs';
import { AppActions } from 'src/app/states/actions/app.actions';
import { AppState } from 'src/app/states/reducers/app.reducer';
import { selectAccount } from 'src/app/states/selectors/app.selectors';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonButton,
    IonIcon,
    IonText,
    IonSpinner,
    AsyncPipe,
    NgStyle,
  ],
})
export class AccountPage {

  account$!: Observable<{ data: any; status: string; error: any }>;
  
  constructor(
    private store: Store<AppState>,
  ) {
    addIcons({ logOut });

    this.account$ = this.store.pipe(select(selectAccount));
  }

  onSignOut() {
    // Dispatch sign out action
    this.store.dispatch(AppActions.signOut());
  }

  ngAfterViewInit() {
    console.log('AccountPage initialized');
    this.store.dispatch(AppActions.getAccount());
  }

}
