import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DriversLoginRequestsComponent } from "./drivers-login-requests.component";
import { CancelReasonTypeComponent } from "./cancel-reason-type.component/cancel-reason-type.component";

const routes: Routes = [
  {
    path: "",
    component: DriversLoginRequestsComponent,
  },
  {
    path: "",
    component: CancelReasonTypeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriversLoginRequestsRoutingModule {}
