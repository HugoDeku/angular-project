import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import {WeaponsComponent} from './weapons/weapons.component';
import {WeaponDetailComponent} from './weapon-detail/weapon-detail.component';

const routes: Routes = [
  { path: 'heroes/detail/:id', component: HeroDetailComponent },
  { path: 'heroes/create', component: HeroDetailComponent },
  { path: 'weapon/:id', component: WeaponDetailComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'weapons', component: WeaponsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
