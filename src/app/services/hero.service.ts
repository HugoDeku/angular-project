import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Hero } from '../data/hero';
import {MessageService} from './message.service';

import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Guild} from '../data/guild';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private static url = 'heroes';
  private static urlGuild = 'guild';

  constructor(private messageService: MessageService,
              private db: AngularFirestore) { }
  getHeroes(): Observable<Hero[]> {

    //
    return this.db.collection<Hero>(HeroService.url)
      .snapshotChanges()
      .pipe(
        map(liste => {

          // log
          console.log('getHeroes()');

          // Traitement de la liste
          return liste.map(item => {

            // Get document data
            const data = item.payload.doc.data();

            // New Hero
            const hero = new Hero().fromJSON(data);

            // Get document id
            const id = item.payload.doc.id;
            hero.id = id;

            // log
            console.log('   hero ' + id);

            // Use spread operator to add the id to the document data
            return hero;

          });
        })
      );
  }

  // Récupération d'un héro en fonction de son id
  getHero(id: string): Observable<Hero> {

    // Return hero observable
    return this.getHeroDocument(id).snapshotChanges()
      .pipe(
        map(item => {

          // Get document data
          const data = item.payload.data();

          // New Hero
          const hero = new Hero().fromJSON(data);
          hero.id = id;

          // log
          console.log('getHero(' + id + ')');

          // Use spread operator to add the id to the document data
          return hero;
        })
      );
  }

  // Ajout d'un héro
  addHero(hero: Hero): void {
    this.db.collection<Hero>(HeroService.url).add(Object.assign({}, hero));
  }

  // Modification d'un héro
  updateHero(hero: Hero): void {

    // Update document
    this.getHeroDocument(hero.id).update(Object.assign({}, hero));
  }

  // Suppression d'un héro
  deleteHero(id: string): void {

    // Delete the document
    this.getHeroDocument(id).delete();
  }


  // Création du service Firebase en fonction de l'id du héro
  private getHeroDocument(id: string): AngularFirestoreDocument<Hero> {

    // return document
    return this.db.doc<Hero>(HeroService.url + `/` + id);
  }

  getGuilds(): Observable<Guild[]> {
    return this.db.collection<Guild>(HeroService.urlGuild)
      .snapshotChanges()
      .pipe(
        map(liste => {

          // log
          console.log('getGuilds()');

          // Traitement de la liste
          return liste.map(item => {

            // Get document data
            const data = item.payload.doc.data();

            // New Hero
            const guild = new Guild().fromJSON(data);

            // Get document id
            const id = item.payload.doc.id;
            guild.id = id;

            // log
            console.log('   guild ' + id);

            // Use spread operator to add the id to the document data
            return guild;
          });
        })
      );
  }
}
