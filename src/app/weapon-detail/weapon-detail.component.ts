import {Component, Input, OnInit} from '@angular/core';
import {Weapon} from '../data/weapon';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

import {WeaponService} from '../services/weapon.service';
import {Guild} from '../data/guild';

@Component({
  selector: 'app-weapon-detail',
  templateUrl: './weapon-detail.component.html',
  styleUrls: ['../app.component.css', './weapon-detail.component.css']
})
export class WeaponDetailComponent implements OnInit {

  @Input() weapon: Weapon | undefined;
  messageError: string;
  pointsToDistribute: number;
  readonly maxPoints: number = 0;
  guilds: Guild[] = [];

  constructor(private route: ActivatedRoute,
              private weaponService: WeaponService,
              private location: Location,
              private router: Router) {
  }


  ngOnInit(): void {
    this.getWeapon();
  }

  getWeapon(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.weaponService.getWeapon(id.toString())
      .subscribe(weapon => {
        this.weapon = weapon;
        this.updatePoints();
      });
  }

  goBack(): void {
    this.location.back();
  }

  applyChanges(): void {
    if ( this.addAllPoints() > this.maxPoints) {
      this.messageError = 'La somme des points doit être égale à ' + this.maxPoints;
    } else {
      this.messageError = null;
      this.weaponService.updateWeapon(this.weapon);
      this.router.navigate(['weapons']);
    }
  }

  changeGuild(num): void {
    this.weapon.guild = Object.assign({}, this.guilds[num - 1]);
  }

  updatePoints(): void {
    this.pointsToDistribute = this.maxPoints - this.addAllPoints();
  }

  addAllPoints(): number{
    return (this.weapon.health + this.weapon.attack + this.weapon.damage + this.weapon.dodge);
  }

}
