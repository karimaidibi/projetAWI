import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JeuxComponent } from './components/jeux/jeux.component';
import { ZonesComponent } from './components/zones/zones.component';
import { BenevolesComponent } from './components/benevoles/benevoles.component';
import { PartialsComponent } from './components/partials/partials.component';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { CreateBenevoleComponent } from './components/benevoles/create-benevole/create-benevole.component';
import { UpdateBenevoleComponent } from './components/benevoles/update-benevole/update-benevole.component';
import { DeleteBenevoleComponent } from './components/benevoles/delete-benevole/delete-benevole.component';
import { UpdateJeuComponent } from './components/jeux/update-jeu/update-jeu.component';
import { CreateJeuComponent } from './components/jeux/create-jeu/create-jeu.component';
import { DeleteJeuComponent } from './components/jeux/delete-jeu/delete-jeu.component';
import { ZonePipe } from './pipes/zone.pipe';
import { CreneauPipe } from './pipes/creneau.pipe';
import { JeuPipe } from './pipes/jeu/jeu.pipe';
import { NomJeuPipe } from './pipes/jeu/nom-jeu.pipe';
import { TypeJeuPipe } from './pipes/jeu/type-jeu.pipe';
import { ConfirmDialogComponent } from './components/partials/confirm-dialog/confirm-dialog.component';
import { MatSortModule } from '@angular/material/sort';
import { AffectationsComponent } from './components/benevoles/affectations/affectations.component';
import { SingleBenevoleAffectationsComponent } from './components/benevoles/single-benevole-affectations/single-benevole-affectations.component';


@NgModule({
  declarations: [
    AppComponent,
    JeuxComponent,
    ZonesComponent,
    BenevolesComponent,
    PartialsComponent,
    AuthComponent,
    HomeComponent,
    SigninComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    CreateBenevoleComponent,
    UpdateBenevoleComponent,
    DeleteBenevoleComponent,
    UpdateJeuComponent,
    CreateJeuComponent,
    DeleteJeuComponent,
    ZonePipe,
    CreneauPipe,
    JeuPipe,
    NomJeuPipe,
    TypeJeuPipe,
    ConfirmDialogComponent,
    AffectationsComponent,
    SingleBenevoleAffectationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSortModule,
    MatIconModule
  ],
  providers: [
    // interceptor, sa classe,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
