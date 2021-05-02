import {Component, OnInit, Input} from '@angular/core';
import {Hero} from '../data/hero';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

import {HeroService} from '../services/hero.service';
import {Guild} from '../data/guild';
import {GuildService} from '../services/guild.service';

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
  defaultsName: string[] = ["Juan", "Paolo", "Hinata",
    "Laure", "Margot", "Penelope", "Kageyama", "Jocelyne", "Alfred", "Jerôme"
    , "Viviane"];

  constructor(private route: ActivatedRoute,
              private heroService: HeroService,
              private location: Location,
              private router: Router,
              private guildService: GuildService) {
  }


    ngOnInit(): void {
        this.getHero();
    }

    getHero(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        if (id !== 0){
          this.heroService.getHero(id.toString())
            .subscribe(hero => {
              this.hero = hero;
              this.updatePoints();
              this.getGuilds();
            });
        }else{
          this.getGuilds();
          this.hero = new Hero();
          this.hero.name = this.defaultsName[Math.round(Math.random() * (this.defaultsName.length - 1))];
          this.hero.description = 'Default description';
          this.hero.attack = Math.round(Math.random() * 10);
          this.hero.dodge = Math.round(Math.random() * 10);
          this.hero.damage = Math.round(Math.random() * 10);
          this.hero.health = Math.round(Math.random() * 10);
          this.hero.victories = 0;
          this.updatePoints();
        }
    }

    goBack(): void {
        this.location.back();
    }

    applyChanges(): void {
        if ( this.addAllPoints() > this.maxPoints) {
            this.messageError = "Vous avez dépassé les "+ this.maxPoints +" points à répartir";
        } else {
            this.messageError = null;
            if (this.hero.id !== undefined){
              this.heroService.updateHero(this.hero);
              this.router.navigate(['heroes']);
            }else{
                this.heroService.getLastId().subscribe(
                  id => {
                    this.hero.id = id;
                    this.heroService.addHero(this.hero).then(
                      result => {
                        this.router.navigate(['detail/' + this.hero.id]);
                      }
                    );
                  }
                );
            }
        }
    }

  changeGuild(num): void {
    this.hero.guild = Object.assign({}, this.guilds[num - 1]);
  }

  updatePoints(): void {
    this.pointsToDistribute = this.maxPoints - this.addAllPoints();
  }

  addAllPoints(): number{
    return (this.hero.health + this.hero.attack + this.hero.damage + this.hero.dodge);
  }

  getGuilds(): void {
    this.guildService.getGuilds()
      .subscribe(guilds => {
        this.guilds = guilds;
        if (this.hero.guild === undefined){
          console.log(this.guilds.length);
          this.hero.guild = Object.assign({}, this.guilds[Math.round(Math.random() * (this.guilds.length - 1))]);
        }
      });
  }

}
