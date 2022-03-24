const options = {
  method: "GET",
  headers: {
    "x-rapidapi-host": "crypto-ranking-data.p.rapidapi.com",
    "x-rapidapi-key": "209c2fd62dmshe31c7cf56d8a671p198554jsnf88216643595",
  },
};

export const getCryptoList = async () =>
  await fetch(
    `https://crypto-ranking-data.p.rapidapi.com/market/list/1/100`,
    options
  ).then((response) => response.json().catch((err) => console.error(err)));
