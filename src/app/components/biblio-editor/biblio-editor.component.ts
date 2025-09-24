import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { albums, business, calendarClear, document, person } from 'ionicons/icons';
import { AppActions } from 'src/app/states/actions/app.actions';
import { AppState } from 'src/app/states/reducers/app.reducer';

@Component({
  selector: 'app-biblio-editor',
  templateUrl: './biblio-editor.component.html',
  styleUrls: ['./biblio-editor.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ]
})
export class BiblioEditorComponent  implements OnInit {

  formGroup: FormGroup = new FormGroup({});

  constructor(
    private store: Store<AppState>,
  ) { 
    addIcons({ document, person, calendarClear, business, albums })
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      author: new FormControl(''),
      publisher: new FormControl(''),
      publication_year: new FormControl('', [Validators.required]),
      total_pages: new FormControl('', [Validators.min(1), Validators.pattern("^[0-9]*$"), Validators.required]),
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;
      console.log('Form Submitted!', formData);

      // Split publisher into array
      const publishers = formData.publisher ? formData.publisher.split('|').map((pub: string) => pub.trim()) : [];
      const authors = formData.author ? formData.author.split('|').map((auth: string) => auth.trim()) : [];

      const processedData = {
        ...formData,
        publishers: publishers,
        authors: authors,
      };

      console.log('Processed Data:', processedData);
      this.store.dispatch(AppActions.insertBiblio({ data: processedData }));
    }
  }

}
