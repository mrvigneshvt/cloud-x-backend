import { StreamCache, TmdbApiCache } from "./ApiCache";

export const cacheStreamData = async (hash: string, url: string) => {
  StreamCache.MovieHash[hash] ? null : (StreamCache.MovieHash[hash] = url);
};

export const getCacheStream = async (
  hash: string
): Promise<boolean | string> => {
  if (StreamCache.MovieHash[hash]) {
    return StreamCache.MovieHash[hash];
  } else {
    return false;
  }
};

export const setMovieCache = async (id: number, data: {}) => {
  TmdbApiCache.Movie[id] ? null : (TmdbApiCache.Movie[id] = data);
};

export const getMovieCache = async (id: number): Promise<boolean | {}> => {
  if (TmdbApiCache.Movie[id]) {
    return TmdbApiCache.Movie[id];
  } else {
    return false;
  }
};
