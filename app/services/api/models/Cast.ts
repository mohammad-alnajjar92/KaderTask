export interface CastInterface {
    adult: boolean,
    gender: number,
    id: number,
    known_for_department:string,
    name: string,
    original_name: string,
    popularity: number,
    profile_path: string,
    cast_id: number,
    character: string,
    credit_id:string,
    order: number
}
 
 export class Cast {
    adult: boolean
    gender: number
    id: number
    known_for_department:string
    name: string
    original_name: string
    popularity: number
    profile_path: string
    cast_id: number
    character: string
    credit_id:string
    order: number
 
  
    constructor(obj: Cast) {
      for (let key in obj) {
        this[key] = obj[key];
      }
    };
  
  };