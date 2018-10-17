import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from './overview/overview.component';
import {ScanComponent} from './scan/scan.component';
import {Routes, RouterModule} from '@angular/router';
import {EditComponent} from './edit/edit.component';
import {DetailComponent} from './detail/detail.component';
import {CreateComponent} from './create/create.component';
import {HomeComponent} from './home/home.component';
import {AuthGuardService} from './services/auth/auth-guard.service';
import { AframeComponent } from './scan/aframe/aframe.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'overview', component: OverviewComponent, canActivate: [AuthGuardService]},
  {path: 'scan/:firebaseId', component: ScanComponent},
  {path: 'detail/:firebaseId', component: DetailComponent},
  {path: 'edit/:firebaseId', component: EditComponent, canActivate: [AuthGuardService]},
  {path: 'create', component: CreateComponent, canActivate: [AuthGuardService]},
  {path: 'home', component: HomeComponent },
  {path: 'aframe', component: AframeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
