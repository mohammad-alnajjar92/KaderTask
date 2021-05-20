export interface CrewInterface {
    adult: boolean,
    gender: number,
    id: number,
    known_for_department:string,
    name: string,
    original_name: string,
    popularity: number,
    profile_path: string,
    credit_id:string,
    department:string,
    job:string
}
 
 export class Crew {
  adult: boolean
  gender: number
  id: number
  known_for_department:string
  name: string
  original_name: string
  popularity: number
  profile_path: string
  credit_id:string
  department:string
  job:string
 
  
    constructor(obj: Crew) {
      for (let key in obj) {
        this[key] = obj[key];
      }
    };
  
  };