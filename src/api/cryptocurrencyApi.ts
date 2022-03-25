const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
    "X-RapidAPI-Key": "209c2fd62dmshe31c7cf56d8a671p198554jsnf88216643595",
  },
};

export const getCryptoList = async () =>
  await fetch(
    "https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0",
    options
  ).then((response) => response.json().catch((err) => console.error(err)));
