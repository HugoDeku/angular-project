import {Component, OnInit, Input} from '@angular/core';
import {Hero} from '../data/hero';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

import {HeroService} from '../services/hero.service';

@Component({
    selector: 'app-hero-detail',
    templateUrl: './hero-detail.component.html',
    styleUrls: ['../app.component.css', './hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

    @Input() hero: Hero | undefined;
    messageError: string;

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

    goBack(): void {
        this.location.back();
    }

    applyChanges(): void {
        if (this.hero.health > 20 || this.hero.health < 0) {
            this.messageError = 'Oops, health has to be between 0 and 20';
        } else if (this.hero.strength > 20 || this.hero.strength < 0) {
            this.messageError = 'Oops, strength has to be between 0 and 20';
        } else if (typeof this.hero.health === 'string' && !/^\d+$/.test(this.hero.health)) {
            this.messageError = 'Oops, health has to be a number';
        } else if (typeof this.hero.strength === 'string' && !/^\d+$/.test(this.hero.strength)) {
            this.messageError = 'Oops, strength has to be a number';
        } else {
            this.messageError = null;
            this.heroService.updateHero(this.hero);
            this.router.navigate(['heroes']);
        }
    }

}
