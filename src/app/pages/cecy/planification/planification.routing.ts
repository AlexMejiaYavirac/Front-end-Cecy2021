import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { PlanificationComponent } from './planification.component';

export const PlanificationRoutes: Routes = [
  {
    path: '',
    component: PlanificationComponent,
    canActivate: [AuthGuard]
},
];
 
