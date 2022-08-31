import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeoFenceComponent } from './geo-fence.component';
import { ManageGeoFenceComponent } from './manage-geo-fence/manage-geo-fence.component';
import { FormMode } from '../../../enums/form-mode.enum';
const routes: Routes = [
  {
    path: '',
    component: GeoFenceComponent,
    data: {
      permissions: {
        only: ['ReadGeofence', 'UpdateGeofence','AddGeofence','DeleteGeofence'],
        redirectTo: '/'
      }
    }
  },
  {
    path: 'add',
    component: ManageGeoFenceComponent,
    // data: { mode: FormMode.Create }
  },
  {
    path: 'edit/:id',
    component: ManageGeoFenceComponent,
    // data: { mode: FormMode.Edit }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeoFenceRoutingModule { }
