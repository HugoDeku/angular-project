import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Hero} from '../data/hero';
import {map} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Guild} from '../data/guild';
import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class GuildService {

  private static url = 'guild';
  constructor(private messageService: MessageService,
              private db: AngularFirestore) { }

  getGuilds(): Observable<Guild[]> {

    //
    return this.db.collection<Guild>(GuildService.url)
      .snapshotChanges()
      .pipe(
        map(liste => {

          // log
          console.log('getGuilds()');

          // Traitement de la liste
          return liste.map(item => {

            // Get document data
            const data = item.payload.doc.data();

            // New Guild
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
