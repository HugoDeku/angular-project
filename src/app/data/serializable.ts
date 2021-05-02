export class Serializable {

  fromJSON(json: any): any {
    for (const propName in json) {
      if (json.hasOwnProperty(propName)) {
        // @ts-ignore
        this[propName] = json[propName];
      }
    }
    return this;
  }
}
