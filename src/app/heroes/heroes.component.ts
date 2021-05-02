import { Component, OnInit } from '@angular/core';

import { Hero } from '../data/hero';
import { HeroService } from '../services/hero.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['../app.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[] = [];

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  resetHeroes(): void{
    this.heroService.reset();
  }

  arrow(side): void {
    const targetContainer = document.getElementsByClassName('heroes-list')[0],
      maxScroll = targetContainer.scrollWidth - targetContainer.clientWidth,
      actualScroll = targetContainer.scrollLeft,
      cardWidth = 720;
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
