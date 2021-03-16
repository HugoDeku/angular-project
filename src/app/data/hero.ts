import { Guild } from './guild';
import {Serializable} from './serializable';

export class Hero extends Serializable{
  id: string;
  name: string;
  description: string;
  health: number;
  image: string;
  attack: number;
  dodge: number;
  damage: number;
  guild: Guild;
}
