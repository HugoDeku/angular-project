import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeroService} from '../services/hero.service';
import {Location} from '@angular/common';
import {WeaponService} from '../services/weapon.service';
import {Hero} from '../data/hero';
import {Weapon} from '../data/weapon';
import {HeroWeapon} from '../data/hero_weapons';
import {IndexPlayer} from '../data/indexPlayer';
import {max} from 'rxjs/operators';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['../app.component.css', './battle.component.css']
})
export class BattleComponent implements OnInit {

  listHeroes: Hero[];
  listWeapons: Weapon[];
  heroWeaponPlayerOne: HeroWeapon;
  heroWeaponPlayerTwo: HeroWeapon;

  weaponsAllowedPlayerOne: Weapon[];
  weaponsAllowedPlayerTwo: Weapon[];

  indexPlayerOne: IndexPlayer;
  indexPlayerTwo: IndexPlayer;
  isStarted: boolean;

  messageEror: String;

  constructor(private route: ActivatedRoute,
              private heroService: HeroService,
              private location: Location,
              private router: Router,
              private weaponService: WeaponService) {
    this.isStarted = false;
  }

  ngOnInit(): void {
    this.loadHeroesAndWeapons();
  }

  private loadHeroesAndWeapons(): void {
    this.heroService.getHeroes().subscribe(
      heroes => {
        this.listHeroes = heroes;
        this.weaponService.getWeapons().subscribe(
          weapons => {
            this.listWeapons = weapons;
            this.heroWeaponPlayerOne = new HeroWeapon();
            this.indexPlayerOne = new IndexPlayer();
            this.indexPlayerOne.hero = 0;
            this.heroWeaponPlayerOne.hero = this.listHeroes[this.indexPlayerOne.hero];

            this.heroWeaponPlayerTwo = new HeroWeapon();
            this.indexPlayerTwo = new IndexPlayer();
            this.indexPlayerTwo.hero = this.listHeroes.length - 1;
            this.heroWeaponPlayerTwo.hero = this.listHeroes[this.indexPlayerTwo.hero];

            this.updateListWeaponsPlayerOne();
            this.updateListWeaponsPlayerTwo();
          }
        );
      }
    );
  }

  updateListWeaponsPlayerOne(): void {
    this.weaponsAllowedPlayerOne = [];
    for (const weapon of this.listWeapons) {
      if (weapon.guild.id === this.heroWeaponPlayerOne.hero.guild.id) {
        this.weaponsAllowedPlayerOne.push(weapon);
      }
    }
    this.indexPlayerOne.weapon = 0;
    this.heroWeaponPlayerOne.weapon = this.weaponsAllowedPlayerOne[this.indexPlayerOne.weapon];
  }

  updateListWeaponsPlayerTwo(): void {
    this.weaponsAllowedPlayerTwo = [];
    for (const weapon of this.listWeapons) {
      if (weapon.guild.id === this.heroWeaponPlayerTwo.hero.guild.id) {
        this.weaponsAllowedPlayerTwo.push(weapon);
      }
    }
    this.indexPlayerTwo.weapon = 0;
    this.heroWeaponPlayerTwo.weapon = this.weaponsAllowedPlayerTwo[this.indexPlayerTwo.weapon];
  }

  leftHeroPlayerOne(): void {
    if (this.indexPlayerOne.hero > 0) {
      this.heroWeaponPlayerOne.hero = this.listHeroes[--this.indexPlayerOne.hero];
      this.updateListWeaponsPlayerOne();
    }
  }

  rightHeroPlayerOne(): void {
    if (this.indexPlayerOne.hero < this.listHeroes.length - 1) {
      this.heroWeaponPlayerOne.hero = this.listHeroes[++this.indexPlayerOne.hero];
      this.updateListWeaponsPlayerOne();
    }
  }

  leftWeaponPlayerOne(): void {
    if (this.indexPlayerOne.weapon > 0) {
      this.heroWeaponPlayerOne.weapon = this.weaponsAllowedPlayerOne[--this.indexPlayerOne.weapon];
    }
  }

  rightWeaponPlayerOne(): void {
    if (this.indexPlayerOne.weapon < this.weaponsAllowedPlayerOne.length - 1) {
      this.heroWeaponPlayerOne.weapon = this.indexPlayerOne[++this.indexPlayerOne.weapon];
    }
  }

  leftHeroPlayerTwo(): void {
    if (this.indexPlayerTwo.hero > 0) {
      this.heroWeaponPlayerTwo.hero = this.listHeroes[--this.indexPlayerTwo.hero];
      this.updateListWeaponsPlayerTwo();
    }
  }

  rightHeroPlayerTwo(): void {
    if (this.indexPlayerTwo.hero < this.listHeroes.length - 1) {
      this.heroWeaponPlayerTwo.hero = this.listHeroes[++this.indexPlayerTwo.hero];
      this.updateListWeaponsPlayerTwo();
    }
  }

  leftWeaponPlayerTwo(): void {
    if (this.indexPlayerTwo.weapon > 0) {
      this.heroWeaponPlayerTwo.weapon = this.weaponsAllowedPlayerTwo[--this.indexPlayerTwo.weapon];
    }
  }

  rightWeaponPlayerTwo(): void {
    if (this.indexPlayerTwo.weapon < this.weaponsAllowedPlayerTwo.length - 1) {
      this.heroWeaponPlayerTwo.weapon = this.weaponsAllowedPlayerTwo[++this.indexPlayerTwo.weapon];
    }
  }

  validate(): void {
    const selectedItems = document.getElementsByClassName('selected-item');
    if (selectedItems.length < 4) {
      this.messageEror = "Selection is not complete.";
    }else if(this.heroWeaponPlayerOne.hero.id === this.heroWeaponPlayerTwo.hero.id){
      this.messageEror = "You can't choose the same characters.";
    }else if(!this.checkStatsHero1()){
      this.messageEror = "Combo player 1 hero and player 1 weapon is wrong, hero have negative stat.";
    }else if(!this.checkStatsHero2()){
      this.messageEror = "Combo player 2 hero and player 2 weapon is wrong, hero have negative stat.";
    }else {
      this.isStarted = true;
    }
    console.log(this.messageEror)
  }

  arrow(item, side, player): void {
    const targetContainer = document.getElementById(item + '-' + player);
    const maxScroll = targetContainer.scrollWidth - targetContainer.clientWidth;
    const actualScroll = targetContainer.scrollLeft;
    const cardWidth = 430;
    let newScroll;

    if (side === 'left') {
      if (actualScroll - cardWidth <= 5) {
        newScroll = 5;
      } else {
        newScroll = actualScroll - cardWidth;
      }
    } else {
      if (actualScroll + cardWidth >= maxScroll) {
        newScroll = maxScroll;
      } else {
        newScroll = actualScroll + cardWidth;
      }
    }

    targetContainer.scrollTo({
      top: 0,
      left: newScroll,
      behavior: 'smooth'
    });
  }

  select(e, item, id, player): void {
    id = id - 1; // quicker than looping or even looking into db

    if (player === '1') {
      if (item === 'hero') {
        this.heroWeaponPlayerOne.hero = this.listHeroes[id];
      } else {
        this.heroWeaponPlayerOne.weapon = this.listWeapons[id];
      }
    } else {
      if (item === 'hero') {
        this.heroWeaponPlayerTwo.hero = this.listHeroes[id];
      } else {
        this.heroWeaponPlayerTwo.weapon = this.listWeapons[id];
      }
    }

    const scrollable = e.target.closest('.battle-item-window');
    const card = e.target.closest('.battle-item-card');
    const previouslySelected = scrollable.getElementsByClassName('selected-item')[0];

    if (previouslySelected) {
      previouslySelected.classList.remove('selected-item');
    }

    card.classList.add('selected-item');

    // activate fight button
    const button = document.getElementById('fight-button');
    if (button.classList.contains('disabled-button')) {
      button.classList.replace('disabled-button', 'enabled-button');
    }
  }

  checkStatsHero1(): boolean{

    var verif = this.heroWeaponPlayerOne.hero.health + this.heroWeaponPlayerOne.weapon.health > 0;
    console.log(this.heroWeaponPlayerOne.hero.health + this.heroWeaponPlayerOne.weapon.health);
    verif = this.heroWeaponPlayerOne.hero.attack + this.heroWeaponPlayerOne.weapon.attack > 0;
    console.log(this.heroWeaponPlayerOne.hero.attack + this.heroWeaponPlayerOne.weapon.attack);
    verif = this.heroWeaponPlayerOne.hero.damage + this.heroWeaponPlayerOne.weapon.damage > 0;
    console.log(this.heroWeaponPlayerOne.hero.damage + this.heroWeaponPlayerOne.weapon.damage);
    verif = this.heroWeaponPlayerOne.hero.dodge + this.heroWeaponPlayerOne.weapon.dodge > 0;
    console.log(this.heroWeaponPlayerOne.hero.dodge + this.heroWeaponPlayerOne.weapon.dodge);
    return verif;
  }

  checkStatsHero2(): boolean{    
    var verif = this.heroWeaponPlayerTwo.hero.health + this.heroWeaponPlayerTwo.weapon.health > 0;
    verif = this.heroWeaponPlayerTwo.hero.attack + this.heroWeaponPlayerTwo.weapon.attack > 0;
    verif = this.heroWeaponPlayerTwo.hero.damage + this.heroWeaponPlayerTwo.weapon.damage > 0;
    verif = this.heroWeaponPlayerTwo.hero.dodge + this.heroWeaponPlayerTwo.weapon.dodge > 0;
    return verif;
  }
}
