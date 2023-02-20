import { ZonesComponent } from './components/zones/zones.component';
import { JeuxComponent } from './components/jeux/jeux.component';
import { BenevolesComponent } from './components/benevoles/benevoles.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AffectationsComponent } from './components/benevoles/affectations/affectations.component';
import { SingleBenevoleAffectationsComponent } from './components/benevoles/single-benevole-affectations/single-benevole-affectations.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'zones', component: ZonesComponent},
  {path:'jeux', component: JeuxComponent},
  {path:'benevoles', component: BenevolesComponent},
  {path:'affectations', component: AffectationsComponent},
  {path:'single-benevole-affectations/:id', component: SingleBenevoleAffectationsComponent},
  {path:'', component: HomeComponent},
  // si tout ce qui est avant ne marche pas faire ceci
  {path:'**', pathMatch:'full', redirectTo: 'not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
