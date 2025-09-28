import { createReducer, on } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';
import { Statuses } from 'src/app/utils/constants';

const getFilename = (path: string) => {
  return path?.split('/')?.pop()!.split('\\').pop() || '';
}

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
  },
  pageFile: {
    insert: {
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
    delete: {
      data: any;
      status: string;
      error: any;
    },
    update: {
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
  },
  pageFile: {
    insert: {
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
    delete: {
      data: null,
      status: Statuses.Idle,
      error: null,
    },
    update: {
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
          results: [
            data, 
            ...state.biblioCollection.list.data.results
          ],
          count: state.biblioCollection.list.data ? state.biblioCollection.list.data.count + 1 : 1,
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
            count: state.biblioCollection.list.data ? state.biblioCollection.list.data.count - 1 : 0,
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


  // ...
  // Sign Out
  // ...
  on(AppActions.signOut, (state) => ({
    ...state,
    account: {
      ...state.account,
      status: Statuses.Loading,
      error: null,
    }
  })),
  on(AppActions.signOutSuccess, (state) => ({
    ...initialState
  })),
  on(AppActions.signOutFailure, (state, { error }) => ({
    ...state,
    account: {
      ...state.account,
      status: Statuses.Failure,
      error,
    }
  })),


  // ...
  // Get Account
  // ...
  on(AppActions.getAccount, (state) => ({
    ...state,
    account: {
      ...state.account,
      status: Statuses.Loading,
      error: null,
    }
  })),
  on(AppActions.getAccountSuccess, (state, { data }) => ({
    ...state,
    account: {
      ...state.account,
      data,
      status: Statuses.Success,
      error: null,
    }
  })),
  on(AppActions.getAccountFailure, (state, { error }) => ({
    ...state,
    account: {
      ...state.account,
      status: Statuses.Failure,
      error,
    }
  })),


  // ...
  // Insert Page File
  // ...
  on(AppActions.insertPage, (state) => ({
    ...state,
    pageFile: {
      ...state.pageFile,
      insert: {
        ...state.pageFile.insert,
        status: Statuses.Loading,
        error: null,
      }
    }
  })),
  on(AppActions.insertPageSuccess, (state, { data }) => {
    const index = state.pageFile.list.data?.results.findIndex((item: any) => item.id === data.id);
    let results = state.pageFile.list.data?.results || [];

    if (index !== -1) {
      // if exists, update the item
      results = [
        ...state.pageFile.list.data!.results.slice(0, index),
        {
          ...state.pageFile.list.data!.results[index],
          ...data,
          recently_added: true,
        },
        ...state.pageFile.list.data!.results.slice(index + 1)
      ];
    } else {
      results = [
        {
          ...data,
          recently_added: true,
        },
        ...results
      ];
    }

    return {
      ...state,
      pageFile: {
        ...state.pageFile,
        insert: {
          data,
          status: Statuses.Success,
          error: null,
        },
        list: {
          ...state.pageFile.list,
          data: {
            ...state.pageFile.list.data,
            results: results,
            count: state.pageFile.list.data ? state.pageFile.list.data.count + 1 : 1,
          }
        }
      }
    };
  }),
  on(AppActions.insertPageFailure, (state, { error }) => ({
    ...state,
    pageFile: {
      ...state.pageFile,
      insert: {
        ...state.pageFile.insert,
        status: Statuses.Failure,
        error,
      }
    }
  })),


  // ...
  // Get Page Files
  // ...
  on(AppActions.getPages, (state, { source }) => ({
    ...state,
    pageFile: {
      ...state.pageFile,
      list: {
        ...state.pageFile.list,
        status: source == 'load-more' ? Statuses.Success : Statuses.Loading,
        error: null,
      }
    }
  })),
  on(AppActions.getPagesSuccess, (state, { data, source }) => {
    let newData = data;
    if (source === 'load-more' && state.pageFile.list.data) {
      newData = {
        ...data,
        results: [
          ...state.pageFile.list.data.results,
          ...data.results
        ]
      };
    }
    return {
      ...state,
      pageFile: {
        ...state.pageFile,
        list: {
          ...state.pageFile.list,
          data: newData,
          status: Statuses.Success,
          error: null,
        }
      }
    };
  }),
  on(AppActions.getPagesFailure, (state, { error }) => ({
    ...state,
    pageFile: {
      ...state.pageFile,
      list: {
        ...state.pageFile.list,
        status: Statuses.Failure,
        error,
      }
    }
  })),


  // ...
  // Retrieve Page File
  // ...
  on(AppActions.getPage, (state) => ({
    ...state,
    pageFile: {
      ...state.pageFile,
      detail: {
        ...state.pageFile.detail,
        status: Statuses.Loading,
        error: null,
      }
    }
  })),
  on(AppActions.getPageSuccess, (state, { data, source }) => {
    const index = state.pageFile.list.data?.results.findIndex((item: any) => item.id === data.id);
    const currentPage = state.pageFile.list.data?.results[index ?? 0];
    const oldFile = getFilename(currentPage?.audiofile?.audio_file?.split('?')[0]);
    const newFile = data.audiofile?.audio_file ? getFilename(data.audiofile?.audio_file?.split('?')[0]) : '';
    let metadataUpdate = {};
    
    if (source === 'recently-reuploaded') {
      metadataUpdate = { 
        ...metadataUpdate,
        recently_reuploaded: true,
      };

      if (currentPage?.audiofile) {
        if (oldFile !== newFile) {
          metadataUpdate = { 
            ...metadataUpdate,
            recently_reuploaded: false,
          };
        }
      }
    }

    if (source === 'recently-added') {
      metadataUpdate = { 
        ...metadataUpdate,
        recently_added: true,
        created: currentPage?.created || false,
        updated: currentPage?.updated || false,
      };

      if (data.audiofile) {
        if (currentPage?.created == true) {
          metadataUpdate = { 
            ...metadataUpdate,
            recently_added: false,
          };
        } else if (currentPage?.updated == true) {
          if (oldFile !== newFile) {
            metadataUpdate = { 
              ...metadataUpdate,
              recently_added: false,
              updated: false,
            };
          }
        }
      }
    }

    return {
      ...state,
      pageFile: {
        ...state.pageFile,
        detail: {
          data,
          status: Statuses.Success,
          error: null,
        },
        list: {
          ...state.pageFile.list,
          data: {
            ...state.pageFile.list.data,
            results: [
              ...state.pageFile.list.data?.results.slice(0, index ?? 0),
              {
                ...state.pageFile.list.data?.results[index ?? 0],
                ...data,
                ...metadataUpdate,
              },
              ...state.pageFile.list.data?.results.slice((index ?? 0) + 1)
            ]
          },
        }
      }
    }
  }),
  on(AppActions.getPageFailure, (state, { error }) => ({
    ...state,
    pageFile: {
      ...state.pageFile,
      detail: {
        ...state.pageFile.detail,
        status: Statuses.Failure,
        error,
      }
    }
  })),


  // ...
  // Delete Page File
  // ...
  on(AppActions.deletePage, (state) => ({
    ...state,
    pageFile: {
      ...state.pageFile,
      delete: {
        ...state.pageFile.delete,
        status: Statuses.Loading,
        error: null,
      }
    }
  })),
  on(AppActions.deletePageSuccess, (state, { pageId }) => {
    const newResults = state.pageFile.list.data?.results.filter((item: any) => item.id !== pageId);

    return {
      ...state,
      pageFile: {
        ...state.pageFile,
        detail: {
          ...state.pageFile.detail,
          data: null,
          error: null,
        },
        list: {
          ...state.pageFile.list,
          data: {
            ...state.pageFile.list.data,
            results: newResults
          }
        }
      }
    }
  }),
  on(AppActions.deletePageFailure, (state, { error }) => ({
    ...state,
    pageFile: {
      ...state.pageFile,
      detail: {
        ...state.pageFile.detail,
        status: Statuses.Failure,
        error,
      }
    }
  })),


  // ...
  // Update Page File
  // ...
  on(AppActions.updatePage, (state, { source}) => ({
    ...state,
    pageFile: {
      ...state.pageFile,
      update: {
        ...state.pageFile.update,
        status: Statuses.Loading,
        error: null,
        source,
      }
    }
  })),
  on(AppActions.updatePageSuccess, (state, { data, pageId, source }) => {
    const index = state.pageFile.list.data?.results.findIndex((item: any) => item.id === pageId);
    return {
      ...state,
      pageFile: {
        ...state.pageFile,
        detail: {
          data,
          status: Statuses.Success,
          error: null,
        },
        update: {
          data,
          status: Statuses.Success,
          error: null,
          source,
        },
        list: {
          ...state.pageFile.list,
          data: {
            ...state.pageFile.list.data,
            results: [
              ...state.pageFile.list.data?.results.slice(0, index ?? 0),
              {
                ...state.pageFile.list.data?.results[index ?? 0],
                ...data,
                recently_reuploaded: true,
              },
              ...state.pageFile.list.data?.results.slice((index ?? 0) + 1)
            ],
            source,
          },
        }
      }
    }
  }),
  on(AppActions.updatePageFailure, (state, { error , source}) => ({
    ...state,
    pageFile: {
      ...state.pageFile,
      update: {
        ...state.pageFile.update,
        status: Statuses.Failure,
        error,
        source,
      }
    }
  })),
);