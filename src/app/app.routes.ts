import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { BoardComponent } from './features/board.component';
import { authGuard } from './features/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
  },
  {
    path: 'board',
    canActivate: [authGuard],
    component: BoardComponent,
  },
];
