import { Guild } from './guild';
import {Serializable} from './serializable';

export class Hero extends Serializable{
  id: number;
  name: string;
  description: string;
  health: number;
  image: string;
  attack: number;
  dodge: number;
  damage: number;
  guild: Guild;
  victories: number;
}
