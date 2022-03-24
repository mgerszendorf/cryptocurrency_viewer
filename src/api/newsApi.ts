const options = {
  method: "GET",
  headers: {
    "X-BingApis-SDK": "true",
    "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
    "X-RapidAPI-Key": "209c2fd62dmshe31c7cf56d8a671p198554jsnf88216643595",
  },
};
export const getNews = (newsCategory: string, count: number) =>
  fetch(
    `https://bing-news-search1.p.rapidapi.com/news/search?q=${newsCategory}&safeSearch=Off&textFormat=Raw&freshness=Day&count=${count}`,
    options
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));
