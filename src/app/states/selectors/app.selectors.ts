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
    (state: AppState) => state.biblioCollection.insert
);

// Select biblioCollection list
export const selectCollectionList = createSelector(
    selectState,
    (state: AppState) => state.biblioCollection.list
);

// Select biblioCollection detail
export const selectCollectionDetail = createSelector(
    selectState,
    (state: AppState) => state.biblioCollection.detail
);

// Insert Page selectors
export const selectInsertPage = createSelector(
    selectState,
    (state: AppState) => state.pageFile.insert
);

// Select pageFile list
export const selectPageFileList = createSelector(
    selectState,
    (state: AppState) => state.pageFile.list
);

// Select pageFile detail
export const selectPageFileDetail = createSelector(
    selectState,
    (state: AppState) => state.pageFile.detail
);

// Select pageFile update
export const selectPageFileUpdate = createSelector(
    selectState,
    (state: AppState) => state.pageFile.update
);