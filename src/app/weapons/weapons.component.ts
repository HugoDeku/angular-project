import {Component, OnInit} from '@angular/core';
import {Weapon} from '../data/weapon';
import {WeaponService} from '../services/weapon.service';
import {MessageService} from '../services/message.service';

@Component({
  selector: 'app-weapons',
  templateUrl: './weapons.component.html',
  styleUrls: ['../app.component.css']
})
export class WeaponsComponent implements OnInit {

  weapons: Weapon[] = [];

  constructor(private weaponService: WeaponService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getWeapons();
  }

  getWeapons(): void {
    this.weaponService.getWeapons()
      .subscribe(weapons => this.weapons = weapons);
  }

  arrow(side): void {
    const targetContainer = document.getElementsByClassName('weapons-list')[0],
      maxScroll = targetContainer.scrollWidth - targetContainer.clientWidth,
      actualScroll = targetContainer.scrollLeft,
      cardWidth = 400;
    var newScroll;

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
}
