import { Instance, SnapshotOut, types } from "mobx-state-tree"
import {MoviesStoreModel} from '../moviesStore/moviesStore'

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
    moviesStore:types.optional(MoviesStoreModel,{} as any)
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
