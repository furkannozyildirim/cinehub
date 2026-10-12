import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import movieReducer, { toggleFavorite } from '../features/movies/model/movieSlice';
import { saveFavorites } from '../features/movies/api/favoritesStorage';

const persistenceMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    movies: movieReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(persistenceMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

persistenceMiddleware.startListening({
  actionCreator: toggleFavorite,
  effect: (_action, listenerApi) => {
    const { favorites } = (listenerApi.getState() as RootState).movies;
    saveFavorites(favorites);
  },
});