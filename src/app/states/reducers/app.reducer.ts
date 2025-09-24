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
  biblioCollection: {
    insert: {
      data: any;
      status: string;
      error: any;
    },
    update: {
      data: any;
      status: string;
      error: any;
    },
    delete: {
      data: any;
      status: string;
      error: any;
    },
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
  biblioCollection: {
    insert: {
      data: null,
      status: Statuses.Idle,
      error: null,
    },
    update: {
      data: null,
      status: Statuses.Idle,
      error: null,
    },
    delete: {
      data: null,
      status: Statuses.Idle,
      error: null,
    },
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
  // Insert Biblio Collection
  // ...
  on(AppActions.insertBiblioCollection, (state) => ({
    ...state,
    biblioCollection: {
      ...state.biblioCollection,
      insert: {
        ...state.biblioCollection.insert,
        status: Statuses.Loading,
        error: null,
      }
    }
  })),

  on(AppActions.insertBiblioCollectionSuccess, (state, { data }) => ({
    ...state,
    biblioCollection: {
      ...state.biblioCollection,
      insert: {
        data,
        status: Statuses.Success,
        error: null,
      },
      list: {
        ...state.biblioCollection.list,
        data: {
          ...state.biblioCollection.list.data,
          results: state.biblioCollection.list.data ? [data, ...state.biblioCollection.list.data.results] : [data],
          total: state.biblioCollection.list.data ? state.biblioCollection.list.data.total + 1 : 1,
        }
      }
    }
  })),

  on(AppActions.insertBiblioCollectionFailure, (state, { error }) => ({
    ...state,
    biblioCollection: {
      ...state.biblioCollection,
      insert: {
        ...state.biblioCollection.insert,
        status: Statuses.Failure,
        error,
      }
    }
  })),


  // ...
  // Get Biblio Collections
  // ...
  on(AppActions.getBiblioCollections, (state, { source }) => {
    return {
      ...state,
      biblioCollection: {
        ...state.biblioCollection,
        list: {
          ...state.biblioCollection.list,
          status: source == 'load-more' ? Statuses.Success : Statuses.Loading,
          error: null,
        }
      }
    };
  }),

  on(AppActions.getBiblioCollectionsSuccess, (state, { data, source }) => {
    let newData = data;
    if (source === 'load-more' && state.biblioCollection.list.data) {
      newData = {
        ...data,
        results: [
          ...state.biblioCollection.list.data.results,
          ...data.results
        ]
      };
    }

    return {
      ...state,
      biblioCollection: {
        ...state.biblioCollection,
        list: {
          ...state.biblioCollection.list,
          data: newData,
          status: Statuses.Success,
          error: null,
        }
      }
    };
  }),

  on(AppActions.getBiblioCollectionsFailure, (state, { error }) => ({
    ...state,
    biblioCollection: {
      ...state.biblioCollection,
      list: {
        ...state.biblioCollection.list,
        status: Statuses.Failure,
        error,
      }
    }
  })),


  // ...
  // Retrieve Collection
  // ...
  on(AppActions.getBiblioCollection, (state) => ({
    ...state,
    biblioCollection: {
      ...state.biblioCollection,
      detail: {
        ...state.biblioCollection.detail,
        status: Statuses.Loading,
        error: null,
      }
    }
  })),

  on(AppActions.getBiblioCollectionSuccess, (state, { data }) => ({
    ...state,
    biblioCollection: {
      ...state.biblioCollection,
      detail: {
        data,
        status: Statuses.Success,
        error: null,
      }
    }
  })),

  on(AppActions.getBiblioCollectionFailure, (state, { error }) => ({
    ...state,
    biblioCollection: {
      ...state.biblioCollection,
      detail: {
        ...state.biblioCollection.detail,
        status: Statuses.Failure,
        error,
      }
    }
  })),


  // ..
  // Update Biblio Collection
  // ...
  on(AppActions.updateBiblioCollection, (state) => ({
    ...state,
    biblioCollection: {
      ...state.biblioCollection,
      update: {
        ...state.biblioCollection.update,
        status: Statuses.Loading,
        error: null,
      }
    }
  })),
  on(AppActions.updateBiblioCollectionSuccess, (state, { data, id }) => {
    const index = state.biblioCollection.list.data?.results.findIndex((item: any) => item.id === id);

    return {
      ...state,
      biblioCollection: {
        ...state.biblioCollection,
        update: {
          data,
          status: Statuses.Success,
          error: null,
        },
        detail: {
          ...state.biblioCollection.detail,
          data: data,
          error: null,
        },
        list: {
          ...state.biblioCollection.list,
          data: {
            ...state.biblioCollection.list.data,
            results: [
              ...(state.biblioCollection.list.data?.results.slice(0, index ?? 0) || []),
              {
                ...state.biblioCollection.list.data?.results[index ?? 0],
                ...data
              },
              ...(state.biblioCollection.list.data?.results.slice((index ?? 0) + 1) || []),
            ]
          }
        }
      }
    };
  }),
  on(AppActions.updateBiblioCollectionFailure, (state, { error }) => ({
    ...state,
    biblioCollection: {
      ...state.biblioCollection,
      update: {
        ...state.biblioCollection.update,
        status: Statuses.Failure,
        error,
      }
    }
  })),


  // ...
  // Delete Biblio Collection
  // ...
  on(AppActions.deleteBiblioCollection, (state) => ({
    ...state,
    biblioCollection: {
      ...state.biblioCollection,
      delete: {
        ...state.biblioCollection.delete,
        status: Statuses.Loading,
        error: null,
      }
    }
  })),
  on(AppActions.deleteBiblioCollectionSuccess, (state, { id }) => {
    const newResults = state.biblioCollection.list.data?.results.filter((item: any) => item.id !== id);

    return {
      ...state,
      biblioCollection: {
        ...state.biblioCollection,
        delete: {
          data: null,
          status: Statuses.Success,
          error: null,
        },
        detail: {
          ...state.biblioCollection.detail,
          data: null,
          error: null,
        },  
        list: {
          ...state.biblioCollection.list,
          data: {
            ...state.biblioCollection.list.data,
            results: newResults,
            total: state.biblioCollection.list.data ? state.biblioCollection.list.data.total - 1 : 0,
          }
        }
      }
    };
  }),
  on(AppActions.deleteBiblioCollectionFailure, (state, { error }) => ({
    ...state,
    biblioCollection: {
      ...state.biblioCollection,
      delete: {
        ...state.biblioCollection.delete,
        status: Statuses.Failure,
        error,
      }
    }
  })),
);
