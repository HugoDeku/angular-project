import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import {FormsModule} from '@angular/forms';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import { WeaponsComponent } from './weapons/weapons.component';
import { WeaponDetailComponent } from './weapon-detail/weapon-detail.component';
import { BattleComponent } from './battle/battle.component';
import { FightComponent } from './fight/fight.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent,
    WeaponsComponent,
    WeaponDetailComponent,
    BattleComponent,
    FightComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
