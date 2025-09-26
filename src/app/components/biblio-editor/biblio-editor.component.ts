import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { albums, business, calendarClear, document, language, person } from 'ionicons/icons';
import { AppActions } from 'src/app/states/actions/app.actions';
import { AppState } from 'src/app/states/reducers/app.reducer';
import { IonInput, IonIcon, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { languages } from 'src/app/utils/constants';

@Component({
  selector: 'app-biblio-editor',
  templateUrl: './biblio-editor.component.html',
  styleUrls: ['./biblio-editor.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonInput,
    IonIcon,
    IonButton,
    IonSelect,
    IonSelectOption,
  ]
})
export class BiblioEditorComponent  implements OnInit {

  @Input() collection: any = null;
  
  formGroup: FormGroup = new FormGroup({});
  languages = languages;
  
  constructor(
    private store: Store<AppState>,
  ) { 
    addIcons({ document, person, calendarClear, business, albums })
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      language: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
      author: new FormControl(''),
      publisher: new FormControl(''),
      publication_year: new FormControl('', [Validators.required]),
      total_pages: new FormControl('', [Validators.min(1), Validators.pattern("^[0-9]*$"), Validators.required]),
    });
  }

  /**
   * Trigger fill the form from outside
   */
  ngOnChanges() { 
    if (this.collection) {
      let publishers = this.collection.publishers;
      let authors = this.collection.authors;
      
      // convert array to string with | delimiter
      if (Array.isArray(publishers)) {
        publishers = publishers.join(' | ');
      }

      if (Array.isArray(authors)) {
        authors = authors.join(' | ');
      }

      this.formGroup.patchValue({
        title: this.collection.title,
        author: authors,
        publisher: publishers,
        publication_year: this.collection.publication_year,
        total_pages: this.collection.total_pages,
        language: this.collection.language,
      });
    }
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

      if (this.collection && this.collection.id) {
        this.store.dispatch(AppActions.updateBiblioCollection({ id: this.collection.id, data: processedData }));
      } else {
        this.store.dispatch(AppActions.insertBiblioCollection({ data: processedData }));
      }
    }
  }

}
