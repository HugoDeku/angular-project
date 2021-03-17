import {Component, OnInit, Input} from '@angular/core';
import {Hero} from '../data/hero';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

import {HeroService} from '../services/hero.service';
import {Guild} from '../data/guild';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['../app.component.css', './hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero | undefined;
  messageError: string;
  pointsToDistribute: number;
  readonly maxPoints: number = 40;
  guilds: Guild[] = [];

  constructor(private route: ActivatedRoute,
              private heroService: HeroService,
              private location: Location,
              private router: Router) {
  }


  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id.toString())
      .subscribe(hero => this.hero = hero);
  }

  getGuilds(): void {
    this.heroService.getGuilds()
      .subscribe(guild => this.guilds = guild);
  }

  goBack(): void {
    this.location.back();
  }

  applyChanges(): void {
    if (this.addAllPoints() > this.maxPoints) {
      this.messageError = "Vous avez dépassé les " + this.maxPoints + " points à répartir";
    } else {
      this.messageError = null;
      this.heroService.updateHero(this.hero);
      this.router.navigate(['heroes']);
    }
  }

  changeGuild(num): void {
    this.hero.guild = Object.assign({}, this.guilds[num - 1]);
  }

  updatePoints(): void {
    this.pointsToDistribute = this.maxPoints - this.addAllPoints();
  }

  addAllPoints(): number {
    return (this.hero.health + this.hero.attack + this.hero.damage + this.hero.dodge);
  }

}
