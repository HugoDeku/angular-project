import {Guild} from './guild';
import {Serializable} from './serializable';

export class Weapon extends Serializable {
  id: string;
  name: string;
  image: string;
  attack: number;
  dodge: number;
  damage: number;
  health: number;
  guild: Guild;
}
