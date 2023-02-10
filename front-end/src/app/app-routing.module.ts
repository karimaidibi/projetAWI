import { ZonesComponent } from './components/zones/zones.component';
import { JeuxComponent } from './components/jeux/jeux.component';
import { BenevolesComponent } from './components/benevoles/benevoles.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'zone', component: ZonesComponent},
  {path:'jeu', component: JeuxComponent},
  {path:'benevole', component: BenevolesComponent},
  {path:'', component: HomeComponent},
  // si tout ce qui est avant ne marche pas faire ceci
  {path:'**', pathMatch:'full', redirectTo: 'not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
