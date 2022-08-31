import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from '@dms/app/guards/auth.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/app',
        pathMatch: 'full'
      },
      {
        path: 'app',
        loadChildren: () => import('@dms/app/dashboard/main/main.module').then(m => m.MainModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tasks',
        loadChildren: () => import('@dms/app/dashboard/main/tasks/tasks.module').then(m => m.TasksModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'auth',
        loadChildren: () => import('@dms/app/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'rate/customer/:customerId/driver/:name/:driverId/task/:tasksId',
        loadChildren: () => import('@dms/app/rate-customer/rate-customer.module').then(m => m.RateCustomerModule)
      },
      {
        path: 'task-tracking',
        loadChildren: () => import('@dms/app/task-tracking/task-tracking.module').then(module => module.TaskTrackingModule)
      },
      {
        path: 'super-admin-dashboard',
        loadChildren: () => import('./dashboard/super-admin-dashboard/super-admin-dashboard.module').then(m => m.SuperAdminDashboardModule),
        canActivate: [AuthGuard]
      }
    ]
  },
];
