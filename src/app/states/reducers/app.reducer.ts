import { createReducer, on } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';
import { Statuses } from 'src/app/utils/constants';

export const appFeatureKey = 'app';

export interface AppState {
  account: {
    data: any;
    status: string;
    error: any;
  },
  biblio: {
    insert: {
      data: any;
      status: string;
      error: any;
    }
  },
  collection: {
    list: {
      data: any;
      status: string;
      error: any;
      source?: string;
    },
    detail: {
      data: any;
      status: string;
      error: any;
    }
  }
}

export const initialState: AppState = {
  account: {
    data: null,
    status: Statuses.Idle,
    error: null,
  },
  biblio: {
    insert: {
      data: null,
      status: Statuses.Idle,
      error: null,
    }
  },
  collection: {
    list: {
      data: null,
      status: Statuses.Idle,
      error: null,
      source: undefined,
    },
    detail: {
      data: null,
      status: Statuses.Idle,
      error: null,
    }
  }
};

export const appReducer = createReducer(
  initialState,

  // ...
  // Sign Up
  // ...
  on(AppActions.signUp, (state) => ({
    ...state,
    account: {
      ...state.account,
      status: Statuses.Loading,
      error: null,
    }
  })),
  on(AppActions.signUpSuccess, (state, { data }) => ({
    ...state,
    account: {
      ...state.account,
      data,
      status: Statuses.Success,
      error: null,
    }
  })),
  on(AppActions.signUpFailure, (state, { error }) => ({
    ...state,
    account: {
      ...state.account,
      status: Statuses.Failure,
      error,
    }
  })),


  // ...
  // Insert Biblio
  // ...
  on(AppActions.insertBiblio, (state) => ({
    ...state,
    biblio: {
      ...state.biblio,
      insert: {
        ...state.biblio.insert,
        status: Statuses.Loading,
        error: null,
      }
    }
  })),

  on(AppActions.insertBiblioSuccess, (state, { data }) => ({
    ...state,
    biblio: {
      ...state.biblio,
      insert: {
        data,
        status: Statuses.Success,
        error: null,
      }
    },
    collection: {
      ...state.collection,
      list: {
        ...state.collection.list,
        data: {
          ...state.collection.list.data,
          results: state.collection.list.data ? [data, ...state.collection.list.data.results] : [data],
          total: state.collection.list.data ? state.collection.list.data.total + 1 : 1,
        }
      }
    }
  })),

  on(AppActions.insertBiblioFailure, (state, { error }) => ({
    ...state,
    biblio: {
      ...state.biblio,
      insert: {
        ...state.biblio.insert,
        status: Statuses.Failure,
        error,
      }
    }
  })),


  // ...
  // Get Collections
  // ...
  on(AppActions.getCollections, (state, { source }) => {
    return {
      ...state,
      collection: {
        ...state.collection,
        list: {
          ...state.collection.list,
          status: source == 'load-more' ? Statuses.Success : Statuses.Loading,
          error: null,
        }
      }
    };
  }),

  on(AppActions.getCollectionsSuccess, (state, { data, source }) => {
    let newData = data;
    if (source === 'load-more' && state.collection.list.data) {
      newData = {
        ...data,
        results: [
          ...state.collection.list.data.results,
          ...data.results
        ]
      };
    }

    return {
      ...state,
      collection: {
        ...state.collection,
        list: {
          ...state.collection.list,
          data: newData,
          status: Statuses.Success,
          error: null,
        }
      }
    };
  }),

  on(AppActions.getCollectionsFailure, (state, { error }) => ({
    ...state,
    collection: {
      ...state.collection,
      list: {
        ...state.collection.list,
        status: Statuses.Failure,
        error,
      }
    }
  })),


  // ...
  // Retrieve Collection
  // ...
  on(AppActions.getCollection, (state) => ({
    ...state,
    collection: {
      ...state.collection,
      detail: {
        ...state.collection.detail,
        status: Statuses.Loading,
        error: null,
      }
    }
  })),

  on(AppActions.getCollectionSuccess, (state, { data }) => ({
    ...state,
    collection: {
      ...state.collection,
      detail: {
        data,
        status: Statuses.Success,
        error: null,
      }
    }
  })),

  on(AppActions.getCollectionFailure, (state, { error }) => ({
    ...state,
    collection: {
      ...state.collection,
      detail: {
        ...state.collection.detail,
        status: Statuses.Failure,
        error,
      }
    }
  })),
);
