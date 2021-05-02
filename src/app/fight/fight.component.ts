import {Component, Input, OnInit} from '@angular/core';
import {HeroWeapon} from '../data/hero_weapons';
import {ActivatedRoute, Router} from '@angular/router';
import {HeroService} from '../services/hero.service';
import {Location} from '@angular/common';
import {WeaponService} from '../services/weapon.service';
import {HeroStatsFinal} from '../data/heroStatsFinal';
import {LogsEnum, LogsFight} from '../data/logs_fight';
import {ThrowStmt} from '@angular/compiler';
import {scheduleObservable} from "rxjs/internal/scheduled/scheduleObservable";

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
  heroWinner: HeroStatsFinal;

  heroAMessage: LogsFight[] = [];
  heroBMessage: LogsFight[] = [];

  tourHeroes: HeroStatsFinal[] = [];
  mapIdHeroMessage: Map<number, LogsFight[]>;
  indiceTour: number;

  logsEnum = LogsEnum;

  DODGE_RATE = 0.0225;

  constructor(private route: ActivatedRoute,
              private heroService: HeroService,
              private location: Location,
              private router: Router,
              private weaponService: WeaponService) {
  }

  ngOnInit(): void {
    this.generateHeroStatsFinals();
    this.generateTour();
    this.fight();
  }

  generateHeroStatsFinals(): void {
    this.heroA = new HeroStatsFinal();
    this.heroB = new HeroStatsFinal();

    this.heroA.id = this.heroWeapon1.hero.id;
    this.heroA.name = this.heroWeapon1.hero.name;
    this.heroA.attack = this.heroWeapon1.hero.attack + this.heroWeapon1.weapon.attack;
    this.heroA.health = (this.heroWeapon1.hero.health + this.heroWeapon1.weapon.health) * 5;
    this.heroA.dodge = this.DODGE_RATE * (this.heroWeapon1.hero.dodge + this.heroWeapon1.weapon.dodge);
    this.heroA.damage = (this.heroWeapon1.hero.damage + this.heroWeapon1.weapon.damage) / 2;
    this.heroA.image = this.heroWeapon1.hero.image;
    this.heroA.weaponImage = this.heroWeapon1.weapon.image;

    this.heroB.id = this.heroWeapon2.hero.id;
    this.heroB.name = this.heroWeapon2.hero.name;
    this.heroB.attack = this.heroWeapon2.hero.attack + this.heroWeapon2.weapon.attack;
    this.heroB.health = (this.heroWeapon2.hero.health + this.heroWeapon2.weapon.health) * 5;
    this.heroB.dodge = this.DODGE_RATE * (this.heroWeapon2.hero.dodge + this.heroWeapon2.weapon.dodge);
    this.heroB.damage = (this.heroWeapon2.hero.damage + this.heroWeapon2.weapon.damage) / 2;
    this.heroB.image = this.heroWeapon2.hero.image;
    this.heroB.weaponImage = this.heroWeapon2.weapon.image;


    this.mapIdHeroMessage = new Map<number, LogsFight[]>();

    this.mapIdHeroMessage.set(this.heroA.id, this.heroAMessage);
    this.mapIdHeroMessage.set(this.heroB.id, this.heroBMessage);
  }

  generateTour(): void {
    this.indiceTour = 0;
    if (this.heroA.attack > this.heroB.attack) {
      this.tourHeroes.push(this.heroA);
      this.tourHeroes.push(this.heroB);
    } else if (this.heroA.attack < this.heroB.attack) {
      this.tourHeroes.push(this.heroB);
      this.tourHeroes.push(this.heroA);
    } else {
      while (this.tourHeroes.length == 0) {
        let heroARandom = Math.random();
        let heroBRandom = Math.random();

        if (heroARandom > heroBRandom) {
          this.tourHeroes.push(this.heroA);
          this.tourHeroes.push(this.heroB);
        } else if (heroARandom < heroBRandom) {
          this.tourHeroes.push(this.heroB);
          this.tourHeroes.push(this.heroA);
        }
      }
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fight() {

    // console.log("Fight");
    var heroAttaquant = this.tourHeroes[this.indiceTour];
    var heroDefenseur = this.tourHeroes[this.indiceTour == 0 ? 1 : 0];

    //Test si esquive
    var random = Math.random();

    this.scrollTop();
    if (random > heroDefenseur.dodge) {
      //Attaque réussie
      heroDefenseur.health = heroDefenseur.health - heroAttaquant.damage;
      //Animation damage
      this.pushMessage(heroAttaquant.id, this.createMessage(LogsEnum.DamageDealt, heroAttaquant.damage));
      this.pushMessage(heroDefenseur.id, this.createMessage(LogsEnum.DamageTaken, heroAttaquant.damage));
    } else {
      //Esquive
      //Animation esquive
      this.pushMessage(heroDefenseur.id, this.createMessage(LogsEnum.Dodge));
      this.pushMessage(heroAttaquant.id, this.createMessage(LogsEnum.Miss));
    }

    if (heroDefenseur.health <= 0) {
      this.heroWinner = heroAttaquant;
    } else {
      //Relance tour
      this.indiceTour = this.indiceTour == 0 ? 1 : 0;
      await this.delay(1000);
      await this.fight();
    }
  }

  pushMessage(id: number, logsFight: LogsFight): void {
    this.mapIdHeroMessage.get(id).push(logsFight);
    // console.log(this.mapIdHeroMessage.get(id));
  }

  createMessage(type: LogsEnum, value?: number): LogsFight {
    var logsFight = new LogsFight();
    logsFight.type = type;
    if (value !== undefined)
      logsFight.value = value;
    return logsFight;
  }

  scrollTop(): void {
    setTimeout(() => {
      const scrollables = document.getElementsByClassName('hero-messages');
      var i = scrollables.length;

      while (i--) {
        scrollables[i].scrollTop = 0 - scrollables[i].scrollHeight;
      }
    }, 1);
  }

  refresh(): void {
    window.location.reload();
  }
}
