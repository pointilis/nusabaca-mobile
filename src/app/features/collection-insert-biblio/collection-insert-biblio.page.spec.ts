import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionInsertBiblioPage } from './collection-insert-biblio.page';

describe('CollectionInsertBiblioPage', () => {
  let component: CollectionInsertBiblioPage;
  let fixture: ComponentFixture<CollectionInsertBiblioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionInsertBiblioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
