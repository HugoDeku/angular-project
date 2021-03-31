import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Weapon } from '../data/weapon';
import {MessageService} from './message.service';

import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Hero} from "../data/hero";


@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  private static url = 'weapons';
  private static urlGuild = 'guild';

  constructor(private messageService: MessageService,
              private db: AngularFirestore) { }
  getWeapons(): Observable<Weapon[]> {

    //
    return this.db.collection<Weapon>(WeaponService.url)
        .snapshotChanges()
        .pipe(
            map(liste => {

              // log
              console.log('getWeapons()');

              // Traitement de la liste
              return liste.map(item => {

                // Get document data
                const data = item.payload.doc.data();

                // New Weapon
                const weapon = new Weapon().fromJSON(data);

                // Get document id
                const id = item.payload.doc.id;
                weapon.id = id;

                // log
                console.log('   weapon ' + id);

                // Use spread operator to add the id to the document data
                return weapon;

              });
            })
        );
  }

  // Récupération des héros avec le plus de victoires
  getStrongestWeapons(): Observable<Hero[]> {
    return this.db.collection<Hero>(WeaponService.url, ref => ref.orderBy('victories', 'desc'))
      .snapshotChanges()
      .pipe(
        map(liste => {

          // Traitement de la liste
          return liste.map(item => {

            // Get document data
            const data = item.payload.doc.data();

            // New Hero
            const weapon = new Weapon().fromJSON(data);

            // Get document id
            const id = item.payload.doc.id;
            weapon.id = id;

            // Use spread operator to add the id to the document data
            return weapon;

          });
        })
      );
  }

  // Récupération d'une weapon en fonction de son id
  getWeapon(id: string): Observable<Weapon> {

    // Return weapon observable
    return this.getWeaponDocument(id).snapshotChanges()
        .pipe(
            map(item => {

              // Get document data
              const data = item.payload.data();

              // New Hero
              const weapon = new Weapon().fromJSON(data);
              weapon.id = id;

              // log
              console.log('getWeapon(' + id + ')');

              // Use spread operator to add the id to the document data
              return weapon;
            })
        );
  }

  // Ajout d'un héro
  addHero(weapon: Weapon): void {
    this.db.collection<Weapon>(WeaponService.url).add(Object.assign({}, weapon));
  }

  // Modification d'un héro
  updateWeapon(weapon: Weapon): void {

    // Update document
    this.getWeaponDocument(weapon.id.toString()).update(Object.assign({}, weapon));
  }

  // Suppression d'un héro
  deleteWeapon(id: string): void {

    // Delete the document
    this.getWeaponDocument(id).delete();
  }


  // Création du service Firebase en fonction de l'id du héro
  private getWeaponDocument(id: string): AngularFirestoreDocument<Weapon> {

    // return document
    return this.db.doc<Weapon>(WeaponService.url + `/` + id);
  }
}
