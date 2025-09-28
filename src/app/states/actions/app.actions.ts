import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IInsertBibilo, IPageFile, IPagination, ISignUp } from 'src/app/utils/interfaces';

export const AppActions = createActionGroup({
  source: 'app',
  events: {
    'Sign Up': props<{ data: ISignUp }>(),
    'Sign Up Success': props<{ data: any }>(),
    'Sign Up Failure': props<{ error: any }>(),

    'Sign Out': emptyProps(),
    'Sign Out Success': emptyProps(),
    'Sign Out Failure': props<{ error: any }>(),

    'Get Account': emptyProps(),
    'Get Account Success': props<{ data: any }>(),
    'Get Account Failure': props<{ error: any }>(),

    'Insert Biblio Collection': props<{ data: IInsertBibilo }>(),
    'Insert Biblio Collection Success': props<{ data: any }>(),
    'Insert Biblio Collection Failure': props<{ error: any }>(),

    'Get Biblio Collections': props<{ params: IPagination, source?: string }>(),
    'Get Biblio Collections Success': props<{ data: any, params: IPagination, source?: string }>(),
    'Get Biblio Collections Failure': props<{ error: any, params: IPagination, source?: string }>(),

    'Get Biblio Collection': props<{ id: string, source?: string }>(),
    'Get Biblio Collection Success': props<{ data: any, id: string, source?: string }>(),
    'Get Biblio Collection Failure': props<{ error: any, id: string, source?: string }>(),

    'Update Biblio Collection': props<{ id: string, data: IInsertBibilo, source?: string }>(),
    'Update Biblio Collection Success': props<{ data: any, id: string, source?: string }>(),
    'Update Biblio Collection Failure': props<{ error: any, id: string, source?: string }>(),

    'Delete Biblio Collection': props<{ id: string, source?: string }>(),
    'Delete Biblio Collection Success': props<{ id: string, source?: string }>(),
    'Delete Biblio Collection Failure': props<{ error: any, id: string, source?: string }>(),

    'Insert Page': props<{ data: IPageFile }>(),
    'Insert Page Success': props<{ data: any }>(),
    'Insert Page Failure': props<{ error: any }>(),

    'Get Pages': props<{ collectionId: string, params: IPagination, source?: string }>(),
    'Get Pages Success': props<{ data: any, collectionId: string, params: IPagination, source?: string }>(),
    'Get Pages Failure': props<{ error: any, collectionId: string, params: IPagination, source?: string }>(),

    'Get Page': props<{ id: string, source?: string }>(),
    'Get Page Success': props<{ data: any, id: string, source?: string }>(),
    'Get Page Failure': props<{ error: any, id: string, source?: string }>(),

    'Delete Page': props<{ pageId: string }>(),
    'Delete Page Success': props<{ pageId: string }>(),
    'Delete Page Failure': props<{ error: any, pageId: string }>(),

    'Update Page': props<{ pageId: string, data: Partial<IPageFile>, source?: string }>(),
    'Update Page Success': props<{ data: any, pageId: string, source?: string }>(),
    'Update Page Failure': props<{ error: any, pageId: string, source?: string }>(),
  }
});
