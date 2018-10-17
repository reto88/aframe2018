import {BrowserModule} from '@angular/platform-browser';
import {NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
// components
import {AppComponent} from './app.component';
import {ScanComponent} from './scan/scan.component';
import {HeaderComponent} from './nav/header/header.component';
import {OverviewComponent} from './overview/overview.component';
import {EditComponent} from './edit/edit.component';
import {AppRoutingModule} from './app-routing.module';
import {DetailComponent} from './detail/detail.component';
import {FabComponent} from './nav/fab/fab.component';
import {HomeComponent} from './home/home.component';
import {CreateComponent} from './create/create.component';
import {OverviewListComponent} from './overview/overview-list/overview-list.component';
import {OverviewCardComponent} from './overview/overview-card/overview-card.component';
import {LoginDialogComponent} from './auth/login/login-dialog/login-dialog.component';
import {QrComponent} from './common/qr/qr.component';

// material
import {
  MatTabsModule,
  MatToolbarModule,
  MatMenuModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatCardModule,
  MatInputModule,
  MatExpansionModule,
  MatGridListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatFormFieldModule,
  MatDialogModule,
  MatListModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatRadioModule

} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// flex layout
import {FlexLayoutModule} from '@angular/flex-layout';
// Fab Button
import {RbFabSpeedDialModule} from 'rb-fab-speed-dial';
// AngularFire
import {environment} from '../environments/environment';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {AngularFireAuthModule} from 'angularfire2/auth';
// Services
import {TextureComponent} from './scan/texture/texture.component';
// Filter
import {FilterPipeModule} from 'ngx-filter-pipe';
// Select
import {NgSelectModule} from '@ng-select/ng-select';
import {QRCodeModule} from 'angularx-qrcode';

import {AuthService} from './services/auth/auth.service';
import { SelectorDialogComponent } from './common/selector-dialog/selector-dialog.component';

import { ChecktStringelementComponent } from './common/checkt-string-out/checkt-stringelement.component';
import { ChecktUrlelementComponent } from './common/url/checkt-urlelement.component';
import { ItemChangeComponent } from './common/item-change/item-change.component';
import { InputHeaderComponent } from './common/input-header/input-header.component';
import { DeleteDialogComponent } from './common/delete-dialog/delete-dialog.component';
import { AframeComponent } from './scan/aframe/aframe.component';


@NgModule({
  declarations: [
    AppComponent,
    ScanComponent,
    HeaderComponent,
    OverviewComponent,
    EditComponent,
    DetailComponent,
    FabComponent,
    TextureComponent,
    HomeComponent,
    CreateComponent,
    OverviewListComponent,
    OverviewCardComponent,
    LoginDialogComponent,
    SelectorDialogComponent,
    ChecktStringelementComponent,
    ChecktUrlelementComponent,
    ItemChangeComponent,
    InputHeaderComponent,
    DeleteDialogComponent,
    QrComponent,
    AframeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatTabsModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    RbFabSpeedDialModule,
    MatTooltipModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireStorageModule,
    HttpClientModule,
    MatInputModule,
    FilterPipeModule,
    NgSelectModule,
    QRCodeModule,
    MatExpansionModule,
    MatGridListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatListModule,
    MatChipsModule,
    MatAutocompleteModule

  ],
  entryComponents: [
    LoginDialogComponent, SelectorDialogComponent, DeleteDialogComponent
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
