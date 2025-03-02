import {
  getTitleDetailsByName,
  searchTitleByName,
  getTitleDetailsByIMDBId,
} from "movier";

const start = async () => {
  try {
    const imdb = await searchTitleByName("fgvshbDGVhdk");
    console.log(imdb, "///");
    // console.log(await getTitleDetailsByIMDBId("tt29550481"));

    if (imdb) {
    }
  } catch (error) {
    console.log(error);
  }
};

start();
