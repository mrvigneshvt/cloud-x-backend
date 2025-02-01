import { configDatas } from "../../.././config";
import { fetchWithRetry } from "../fetch";

export const fetchTMDBapi = async (url: string, series?: boolean) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: configDatas.TmdbApi.key,
    },
  };

  try {
    const respose = await fetch(url, options);

    if (respose.ok) {
      const data = await respose.json();

      const results = data.results;

      let dataTosend: any = [];

      let neededResults = (
        title: string,
        poster: string,
        releaseDate: string,
        id: number,
        story: string,
        category: string
      ) => {
        return {
          title,
          poster: configDatas.TmdbApi.imageEndPoint + poster,
          releaseDate,
          id,
          story,
          category,
        };
      };

      await results.map((d: any, i: number) => {
        if (series) {
          dataTosend.push(
            neededResults(
              d.name,
              d.backdrop_path,
              d.first_air_date,
              d.id,
              d.overview,
              "tv"
            )
          );
        } else {
          dataTosend.push(
            neededResults(
              d.title,
              d.backdrop_path,
              d.release_date,
              d.id,
              d.overview,
              "movie"
            )
          );
        }
      });

      return dataTosend;
    }
    console.log(respose.status);
  } catch (error) {
    fetchTMDBapi(url);
    console.log(error);
  }
};

fetchTMDBapi(configDatas.TmdbApi.apiEndPoint.topRated);
