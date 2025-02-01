export const configDatas = {
  client: {
    ip: "109.123.237.36/", //"192.168.1.10",
    port: "5174",
  },
  WhatsAuth: {
    apiUrl: "http://109.123.237.36:3000/send-message",
    bodyFormat: {
      user: "",
      message: "",
    },
  },
  MongoUri: {
    apiUrl:
      "mongodb+srv://admin:admin@cluster0.vi4qs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  },
  Jwt: {
    secret: "secretKeyHere",
  },
  TmdbApi: {
    key: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNGJlNWJjMzQ4ZGY2NmNhNGFmM2YxYjg5NTM4ODBjOSIsIm5iZiI6MTczMjE5NjI0NS41MTAwMDAyLCJzdWIiOiI2NzNmMzc5NTRkZWMxZjk4YjI5YmVjNDIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.J1ZzLkJMBN0-y_zIwnsnQuXCLS-PEHnT9uOyMbAQ3Gc",
    imageEndPoint: "https://image.tmdb.org/t/p/w500",
    apiEndPoint: {
      popular:
        "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      popularSeries:
        "https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1",
      nowPlaying:
        "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
      topRated:
        "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
      getMovieinfo: "https://api.themoviedb.org/3/movie/",
      getTvinfo: "https://api.themoviedb.org/3/tv/",
    },
  },
  openXapi: {
    isExistEndPoint: "http://156.67.105.219:4000/api/query/", //offset given filename/1
    getFileLink: "http://156.67.105.219:4000/api/uniqueHash/",
  },
  imageNotFound: {
    url: "https://ibb.co/7J9rhKDR",
  },
};
