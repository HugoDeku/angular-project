import { Guild } from './guild';
import {Serializable} from './serializable';

export class Hero extends Serializable{
  id: string;
  name: string;
  description: string;
  health: number;
  image: string;
  strength: number;
  guild: Guild;
}
