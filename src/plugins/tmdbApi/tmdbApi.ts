import { format } from "date-fns";
import { configDatas } from "../../../config";
import { fetchTMDBapi } from "./fetchApi";
import { ApiCache } from "../../DataCache/ApiCache";
import { getRandomNumber } from "../otp";

export const TimeScheduler = async () => {
  await refreshApiDatas();
  const currentTime = new Date();
  const endOfDay = new Date(currentTime);
  endOfDay.setHours(23, 59, 59, 59); // Set to midnight of the next day

  const delay = endOfDay.getTime() - currentTime.getTime(); // Calculate milliseconds until EOD

  setTimeout(async () => {
    await refreshApiDatas();
    setTimeout(() => {
      TimeScheduler();
    }, 90000);
  }, delay);
};

const refreshApiDatas = async () => {
  const args = {
    topRated: {
      url: configDatas.TmdbApi.apiEndPoint.topRated,
      page: getRandomNumber(5),
    },
    nowPlaying: {
      url: configDatas.TmdbApi.apiEndPoint.nowPlaying,
      page: getRandomNumber(5),
    },
    popular: {
      url: configDatas.TmdbApi.apiEndPoint.popular,
      page: getRandomNumber(5),
    },
  };
  ApiCache.topRated = await fetchTMDBapi(args.topRated);

  setTimeout(async () => {
    try {
      ApiCache.nowPlaying = await fetchTMDBapi(args.nowPlaying);
    } catch (error) {
      ApiCache.nowPlaying = await fetchTMDBapi(args.nowPlaying);
    }

    setTimeout(async () => {
      try {
        ApiCache.popular = await fetchTMDBapi(args.popular);
      } catch (error) {
        ApiCache.popular = await fetchTMDBapi(args.popular);
      }
    }, 2000);
  }, 1500);

  // ApiCache.trending = await fetchTMDBapi(
  //   configDatas.TmdbApi.apiEndPoint.trendingMovies
  // );
};
