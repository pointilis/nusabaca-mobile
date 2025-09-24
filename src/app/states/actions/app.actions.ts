import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IInsertBibilo, IPagination, ISignUp } from 'src/app/utils/interfaces';

export const AppActions = createActionGroup({
  source: 'app',
  events: {
    'Sign Up': props<{ data: ISignUp }>(),
    'Sign Up Success': props<{ data: any }>(),
    'Sign Up Failure': props<{ error: any }>(),

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
  }
});
