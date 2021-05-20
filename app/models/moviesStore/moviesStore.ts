import { types, getEnv, getRoot, flow } from "mobx-state-tree";
import { Environment } from "../environment";
import { RootStore } from "../root-store/root-store";

const arrayOfStatus = ["idle", "pending", "done", "error"];

/**
 * login step
 */
 const movieModel = types.model('movieModel').props({
    adult: types.optional(types.boolean,false),
    backdrop_path: types.optional(types.string,''),
    genre_ids: types.array(types.number),
    id: types.optional(types.number,0),
    original_language: types.optional(types.string,''),
    original_title: types.optional(types.string,''),
    overview:types.optional(types.string,''),
    popularity: types.optional(types.number,0),
    poster_path: types.optional(types.string,''),
    release_date: types.optional(types.string,''),
    title: types.optional(types.string,''),
    video: types.optional(types.boolean,false),
    vote_average:types.optional(types.number,0),
    vote_count: types.optional(types.number,0),
  });

const genreModel = types.model('genreModel').props({
    id: types.number,
    name: types.optional(types.string,'')
  });

 
export const MoviesStoreModel = types
    .model("MoviesStore")
    .props({
        status: types.optional(types.enumeration(arrayOfStatus), "idle"),
        movies: types.optional(types.array(movieModel),[]),
        genres: types.optional(types.array(genreModel),[]),
        cast:types.optional(types.array(types.frozen()),[]),
        crew:types.optional(types.array(types.frozen()),[]),
        movieDetail:types.optional(types.frozen(),{}),

    }).views(self => ({
        get isLoading() {
            return self.status === "pending"
        },
        get environment() {
            return getEnv(self) as Environment
        },
        get rootStore() {
            return getRoot(self) as RootStore
        },
        get isError() {
            return self.status === "error"
        },
        get isDone() {
            return self.status === "done"
        },
    }))
    .actions(self => ({
        setStatus(value?: "idle" | "pending" | "done" | "error") {
            self.status = value
        },
        updateMovies(movies){
            self.movies=movies;
        },
        updateGenres(genres){
            self.genres=genres;
        },
        updateMovieDetails(movieDetail){
            self.movieDetail=movieDetail;
        },
        updateCast(cast){
            self.cast=cast;
        }, 
        updateCrew(crew){
            self.crew=crew;
        },
    })).actions(self => ({

        getGenres: flow(function* () {
            try {
                const genre = yield self.environment.api.getGenres()
                self.updateGenres(genre.genres)
            }
            catch (error) {
                console.log(error)

            }

        }),

        syncMovies: flow(function* () {
            try {
                const res = yield self.environment.api.upcomingMovies()
                self.updateMovies(res.movies)
            }
            catch (error) {
                console.log(error)

            }

        }),

        popularMovies: flow(function* () {
            console.log("popularMovies")
            try {
                const res = yield self.environment.api.popularMovies()
                self.updateMovies(res.movies)

            }
            catch (error) {
                console.log(error)

            }

        }),

        topMovies: flow(function* () {
            try {
                const res = yield self.environment.api.topMovies()
                console.log('*****res', res)
                self.updateMovies(res.movies)

            }
            catch (error) {
                console.log(error)

            }

        }),

        movieDetails:flow(function* (id){
            try{
                const res = yield self.environment.api.movieDetails(id)
                const cridet = yield self.environment.api.movieCridets(id)
                console.log("*****cridet",cridet)
                self.updateMovieDetails(res.movieDetails)
                self.updateCast(cridet.cast)
                self.updateCrew(cridet.crew)

        
            }
            catch(error){
                console.log(error)
            }
        }),


    }))
    .actions(self => ({

    }))








type MoviesStoreType = typeof MoviesStoreModel.Type
export interface MoviesStore extends MoviesStoreType { }
type MoviesStoreSnapshotType = typeof MoviesStoreModel.SnapshotType
export interface AddressStoreSnapshot extends MoviesStoreSnapshotType { }