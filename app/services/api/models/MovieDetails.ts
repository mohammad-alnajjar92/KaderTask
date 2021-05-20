import{GenresInterface} from "./Genres"

interface ProductionCompanies {
    name:string
    id:number
    logo_path?:string
    origin_country:string
}

interface ProductionCountries {
    name:string
    iso_3166_1:string
}

interface SpokenLanguages {
    name:string
    iso_3166_1:string
}

export interface MovieDetailsInterface {
    adult: boolean,
    backdrop_path: string,
    belongs_to_collection: object,
    budget: number,
    genres:Array<GenresInterface>,
    homepage: string,
    id: number,
    imdb_id: string,
    original_language: string,
    original_title:string,
    overview: string,
    popularity: number,
    poster_path:string,
    production_companies: Array<ProductionCompanies>,
    production_countries: Array<ProductionCountries>,
    release_date: string,
    revenue:number,
    runtime: number,
    spoken_languages: Array<SpokenLanguages>,
    status: string,
    tagline: string,
    title: string,
    video:boolean,
    vote_average: number,
    vote_count: number,
}
 
 export class MovieDetails {
    adult: boolean
    backdrop_path: string
    belongs_to_collection: object
    budget: number
    genres:Array<GenresInterface>
    homepage: string
    id: number
    imdb_id: string
    original_language: string
    original_title:string
    overview: string
    popularity: number
    poster_path:string
    production_companies: Array<ProductionCompanies>
    production_countries: Array<ProductionCountries>
    release_date: string
    revenue:number
    runtime: number
    spoken_languages: Array<SpokenLanguages>
    status: string
    tagline: string
    title: string
    video:boolean
    vote_average: number
    vote_count: number
 
  
    constructor(obj:MovieDetails) {
      for (let key in obj) {
        this[key] = obj[key];
      }
    };
  
  };