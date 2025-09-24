import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IInsertBibilo, IPagination, ISignUp } from 'src/app/utils/interfaces';

export const AppActions = createActionGroup({
  source: 'app',
  events: {
    'Sign Up': props<{ data: ISignUp }>(),
    'Sign Up Success': props<{ data: any }>(),
    'Sign Up Failure': props<{ error: any }>(),

    'Insert Biblio': props<{ data: IInsertBibilo }>(),
    'Insert Biblio Success': props<{ data: any }>(),
    'Insert Biblio Failure': props<{ error: any }>(),

    'Get Collections': props<{ params: IPagination, source?: string }>(),
    'Get Collections Success': props<{ data: any, params: IPagination, source?: string }>(),
    'Get Collections Failure': props<{ error: any, params: IPagination, source?: string }>(),

    'Get Collection': props<{ id: string }>(),
    'Get Collection Success': props<{ data: any, id: string }>(),
    'Get Collection Failure': props<{ error: any, id: string }>(),
  }
});
