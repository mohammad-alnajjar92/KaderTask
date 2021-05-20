import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { CastInterface, Cast } from "./models/Cast"
import { CrewInterface, Crew } from "./models/Crew"
/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })


  }
  async upcomingMovies(): Promise<any> {
    // make the api call
    try {
      let endPoint = "https://api.themoviedb.org/3/movie/upcoming?api_key=eb0c6b282ef3a0a21c8bfc85c5ec8323&language=en-US&page=1"
      const response: ApiResponse<any> = await this.apisauce.get(endPoint)

      // the typical ways to die when calling an api

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      // transform the data into the format we are expecting
      const rawMovies = response.data.results
      return { kind: "ok", movies: rawMovies }
    } catch (error) {
      console.log('error', error)
      return { kind: "bad-data" }
    }
  }

  async popularMovies(): Promise<any> {
    // make the api call
    let endPoint = "https://api.themoviedb.org/3/movie/popular?api_key=eb0c6b282ef3a0a21c8bfc85c5ec8323&language=en-US&page=1"
    const response: ApiResponse<any> = await this.apisauce.get(endPoint)
    // the typical ways to die when calling an api

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawMovies = response.data.results

      return { kind: "ok", movies: rawMovies }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async topMovies(): Promise<any> {
    // make the api call
    let endPoint = "https://api.themoviedb.org/3/movie/top_rated?api_key=eb0c6b282ef3a0a21c8bfc85c5ec8323&language=en-US&page=1"
    const response: ApiResponse<any> = await this.apisauce.get(endPoint)
    // the typical ways to die when calling an api

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawMovies = response.data.results
      return { kind: "ok", movies: rawMovies }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async getGenres(): Promise<any> {
    // make the api call
    let endPoint = "https://api.themoviedb.org/3/genre/movie/list?api_key=eb0c6b282ef3a0a21c8bfc85c5ec8323&language=en-US"
    const response: ApiResponse<any> = await this.apisauce.get(endPoint)
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawMovies = response.data.genres
      return { kind: "ok", genres: rawMovies }
    } catch {
      return { kind: "bad-data" }
    }
  }
  async movieDetails(id): Promise<any> {
    // make the api call
    try {

    let endPoint = "https://api.themoviedb.org/3/movie/" + id + "?api_key=eb0c6b282ef3a0a21c8bfc85c5ec8323&language=en-US"
    const response: ApiResponse<any> = await this.apisauce.get(endPoint)
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    
      const rawMovies = response.data
      return { kind: "ok", movieDetails: rawMovies }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async movieCridets(id): Promise<any> {
    // make the api call
    try {

    let movieCast: Array<CastInterface> = [];
    let movieCrew: Array<CrewInterface> = [];

    let endPoint = "https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=eb0c6b282ef3a0a21c8bfc85c5ec8323&language=en-US"
    const response: ApiResponse<any> = await this.apisauce.get(endPoint)
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }


    //high order fucntion to serilalize data
    const serializeCast = (casts: CastInterface) => {
      movieCast.push(new Cast(({
        adult: casts.adult,
        gender: casts.gender ? casts.gender : 0,
        id: casts.id,
        known_for_department: casts.known_for_department,
        name: casts.name,
        original_name: casts.original_name,
        popularity: casts.popularity,
        profile_path: casts.profile_path ? casts.profile_path : '',
        cast_id: casts.cast_id,
        character: casts.character,
        credit_id: casts.credit_id,
        order: casts.order
      }))
      )
    };

    const serializeCrew = (crew: CrewInterface) => {
      movieCrew.push(new Crew(({
        adult: crew.adult,
        gender: crew.gender ? crew.gender : 0,
        id: crew.id,
        known_for_department: crew.known_for_department,
        name: crew.name,
        original_name: crew.original_name,
        popularity: crew.popularity,
        profile_path: crew.profile_path ? crew.profile_path : '',
        credit_id: crew.credit_id,
        department: crew.department,
        job: crew.job
      }))
      )
    };

    // transform the data into the format we are expecting
      response.data.cast.map(serializeCast);
      response.data.crew.map(serializeCrew);

      return { kind: "ok", cast: movieCast, crew: movieCrew }
    } catch {
      return { kind: "bad-data" }
    }
  }

}


