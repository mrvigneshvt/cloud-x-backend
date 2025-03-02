import { configDatas } from "../../.././config";
import { errorLogger } from "../../../ERROR-LOGGER/errorLogger";
import { fetchWithRetry } from "../fetch";

interface fetchTMDBtypes {
  url: string;
  series?: boolean;
  page?: number;
}

export const fetchTMDBapi = async (args: fetchTMDBtypes) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: configDatas.TmdbApi.key,
    },
  };

  args.page ? (args.url = args.url.slice(0, -1) + args.page) : null;

  try {
    const respose = await fetch(args.url, options);

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
        category: string,
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
        if (args.series) {
          dataTosend.push(
            neededResults(
              d.name,
              d.backdrop_path,
              d.first_air_date,
              d.id,
              d.overview,
              "tv",
            ),
          );
        } else {
          dataTosend.push(
            neededResults(
              d.title,
              d.backdrop_path,
              d.release_date,
              d.id,
              d.overview,
              "movie",
            ),
          );
        }
      });

      return dataTosend;
    }
  } catch (error) {
    errorLogger("error in fetchTMDBapi::", error);
    await fetchTMDBapi(args);
  }
};

const data = configDatas.TmdbApi.apiEndPoint.topRated;
