import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionEditorPage } from './collection-editor.page';

describe('CollectionEditorPage', () => {
  let component: CollectionEditorPage;
  let fixture: ComponentFixture<CollectionEditorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
