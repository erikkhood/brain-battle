import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './gameSlice'
import trickyTechReducer from './trickyTechSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    trickyTech: trickyTechReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 