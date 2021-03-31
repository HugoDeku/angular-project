import { Injectable } from '@angular/core';

import {Observable, of, Subject} from 'rxjs';

import { Hero } from '../data/hero';
import {MessageService} from './message.service';

import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import {first, map} from 'rxjs/operators';
import {Guild} from '../data/guild';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private static url = 'heroes';

  constructor(private messageService: MessageService,
              private db: AngularFirestore) {
  }

  getHeroes(): Observable<Hero[]> {

    //
    return this.db.collection<Hero>(HeroService.url,ref => ref.orderBy('id', 'asc'))
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
  addHero(hero: Hero): Promise<void> {
    return this.db.collection<Hero>(HeroService.url).doc(hero.id.toString()).set(Object.assign({}, hero));
  }

  // Modification d'un héro
  updateHero(hero: Hero): void {

    // Update document
    this.getHeroDocument(hero.id.toString()).update(Object.assign({}, hero));
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

  getLastId(): Observable<number>{
    const subject = new Subject<number>();
    this.db.collection<Hero>(HeroService.url, ref => ref.orderBy('id', 'desc')
      .limit(1))
      .valueChanges()
      .pipe(first())
      .subscribe(
        hero => {
          subject.next((+(hero[0].id)) + 1);
        }
      );
    return subject.asObservable();
  }
  reset(): void{
    this.db.collection<Hero>(HeroService.url)
      .valueChanges()
      .pipe(first())
      .subscribe(
        liste => {
          // Traitement de la liste
            liste.map(hero => {
              if (hero.id > 9){
                this.deleteHero(hero.id.toString());
              }
            });
        }
      );
  }
}
