import {Guild} from './guild';
import {Serializable} from './serializable';

export class Weapon extends Serializable {
  id: number;
  name: string;
  image: string;
  attack: number;
  dodge: number;
  damage: number;
  health: number;
  guild: Guild;
  victories: number;
}
