import { format } from "date-fns";
import { configDatas } from "../../../config";
import { fetchTMDBapi } from "./fetchApi";
import { ApiCache } from "../../DataCache/ApiCache";

export const TimeScheduler = async () => {
  await refreshApiDatas();
  const currentTime = new Date();
  const endOfDay = new Date(currentTime);
  endOfDay.setHours(23, 59, 59, 59); // Set to midnight of the next day

  const delay = endOfDay.getTime() - currentTime.getTime(); // Calculate milliseconds until EOD

  console.log("Current Time:", format(currentTime, "HH:mm:ss"));
  console.log("Milliseconds until EOD:", delay);

  setTimeout(async () => {
    await refreshApiDatas();
    setTimeout(() => {
      TimeScheduler();
    }, 90000);
  }, delay);
};

const refreshApiDatas = async () => {
  ApiCache.topRated = await fetchTMDBapi(
    configDatas.TmdbApi.apiEndPoint.topRated
  );

  setTimeout(async () => {
    ApiCache.nowPlaying = await fetchTMDBapi(
      configDatas.TmdbApi.apiEndPoint.nowPlaying
    );

    setTimeout(async () => {
      ApiCache.popular = await fetchTMDBapi(
        configDatas.TmdbApi.apiEndPoint.popular
      );
      console.log(ApiCache);
    }, 2000);
  }, 1500);

  // ApiCache.trending = await fetchTMDBapi(
  //   configDatas.TmdbApi.apiEndPoint.trendingMovies
  // );
};
