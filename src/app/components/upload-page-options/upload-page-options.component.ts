import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalController, IonItem, IonRadio, IonRadioGroup, IonInput, IonButton, IonIcon, IonSelect, IonSelectOption, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { albums, cloudUpload, documentText } from 'ionicons/icons';

@Component({
  selector: 'app-upload-page-options',
  templateUrl: './upload-page-options.component.html',
  styleUrls: ['./upload-page-options.component.scss'],
  imports: [
    IonButton,
    IonIcon,
    IonText,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonRadio,
    IonRadioGroup,
    IonItem,
    FormsModule,
    ReactiveFormsModule,
    NgStyle,
  ],
})
export class UploadPageOptionsComponent  implements OnInit {

  pageNumber: string = '';
  voiceGender: string = 'male';

  constructor(
    private modalCtrl: ModalController,
  ) { 
    addIcons({ cloudUpload, albums, documentText });
  }

  ngOnInit() {}

  submitOptions() {
    this.modalCtrl.dismiss({
      page_number: this.pageNumber,
      voice_gender: this.voiceGender,
    }, 'confirm');
  }

}
