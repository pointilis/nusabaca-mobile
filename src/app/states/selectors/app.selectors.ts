import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, appFeatureKey } from '../reducers/app.reducer';

// Feature selector
export const selectState = createFeatureSelector<AppState>(appFeatureKey);

// Account selectors
export const selectAccount = createSelector(
  selectState,
  (state: AppState) => state.account
);

// Insert Biblio selectors
export const selectInsertBiblio = createSelector(
    selectState,
    (state: AppState) => state.biblio.insert
);

// Select collection list
export const selectCollectionList = createSelector(
    selectState,
    (state: AppState) => state.collection.list
);

// Select collection detail
export const selectCollectionDetail = createSelector(
    selectState,
    (state: AppState) => state.collection.detail
);
