import { Component, OnInit } from '@angular/core';
import { Hero } from '../data/hero';
import { HeroService } from '../services/hero.service';
import {Weapon} from '../data/weapon';
import {WeaponService} from '../services/weapon.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../app.component.css', './dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  weapons: Weapon[] = [];

  constructor(private heroService: HeroService, private weaponService: WeaponService) { }

  ngOnInit(): void {
    this.getHeroes();
    this.getWeapons();
  }

  getHeroes(): void {
    this.heroService.getStrongestHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(0, 4));
  }

  getWeapons(): void {
    this.weaponService.getStrongestWeapons()
      .subscribe(weapons => this.weapons = weapons.slice(0, 4));
  }
}
