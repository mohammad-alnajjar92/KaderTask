export interface GenresInterface {
    id: number,
    name: string
}
 
 export class Genres {
  id: number
  name: string


  
    constructor(obj: Genres) {
      for (let key in obj) {
        this[key] = obj[key];
      }
    };
  
  };