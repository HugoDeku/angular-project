import {Component, Input, OnInit} from '@angular/core';
import {HeroWeapon} from '../data/hero_weapons';
import {ActivatedRoute, Router} from '@angular/router';
import {HeroService} from '../services/hero.service';
import {Location} from '@angular/common';
import {WeaponService} from '../services/weapon.service';
import {HeroStatsFinal} from '../data/heroStatsFinal';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.css']
})
export class FightComponent implements OnInit {

  @Input() heroWeapon1: HeroWeapon;
  @Input() heroWeapon2: HeroWeapon;

  heroA: HeroStatsFinal;
  heroB: HeroStatsFinal;

  tourHeroes: HeroStatsFinal[];
  indiceTour: number;

  DODGE_RATE = 0.0225;
  constructor(private route: ActivatedRoute,
              private heroService: HeroService,
              private location: Location,
              private router: Router,
              private weaponService: WeaponService) { }

  ngOnInit(): void {
    this.generateHeroStatsFinals();
    this.generateTour();
    this.fight();
  }

  generateHeroStatsFinals(): void{
    this.heroA.attack = this.heroWeapon1.hero.attack + this.heroWeapon1.weapon.attack;
    this.heroA.health = this.heroWeapon1.hero.health + this.heroWeapon1.weapon.health;
    this.heroA.dodge = this.DODGE_RATE * (this.heroWeapon1.hero.dodge + this.heroWeapon1.weapon.dodge);
    this.heroA.damage = this.heroWeapon1.hero.damage + this.heroWeapon1.weapon.damage;

    this.heroB.attack = this.heroWeapon2.hero.attack + this.heroWeapon2.weapon.attack;
    this.heroB.health = this.heroWeapon2.hero.health + this.heroWeapon2.weapon.health;
    this.heroB.dodge = this.DODGE_RATE * (this.heroWeapon2.hero.dodge + this.heroWeapon2.weapon.dodge);
    this.heroB.damage = this.heroWeapon2.hero.damage + this.heroWeapon2.weapon.damage;
  }

  generateTour(): void{
    this.indiceTour = 0;
    if(this.heroA.attack > this.heroB.attack){
      this.tourHeroes.push(this.heroA);
      this.tourHeroes.push(this.heroB);
    }else if(this.heroA.attack < this.heroB.attack){
      this.tourHeroes.push(this.heroB);
      this.tourHeroes.push(this.heroA);
    }else{
      while(this.tourHeroes.length == 0){
        let heroARandom = Math.random();
        let heroBRandom = Math.random();
  
        if(heroARandom > heroBRandom){
          this.tourHeroes.push(this.heroA);
          this.tourHeroes.push(this.heroB);
        }else if(heroARandom < heroBRandom){
          this.tourHeroes.push(this.heroB);
          this.tourHeroes.push(this.heroA);
        }
      }
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async fight() {
    var heroAttaquant = this.tourHeroes[this.indiceTour];
    var heroDefenseur = this.tourHeroes[this.indiceTour == 0 ? 1 : 0];

    //Test si esquive
    var random = Math.random();

    if(random > heroDefenseur.dodge){
      //Attaque réussie
      heroDefenseur.health = heroDefenseur.health - heroAttaquant.damage;
      //Animation damage
    }else{
      //Esquive
      //Animation esquive
    }

    if(heroDefenseur.health <= 0){
      //Affichage fin
    }{
      //Relance tour
      this.indiceTour = this.indiceTour == 0 ? 1 : 0;
      await this.delay(500);
      this.fight();
    }
  }

}
