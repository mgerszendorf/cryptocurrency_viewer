import { useEffect, useState } from "react";
import moment from "moment";
import noImage from "../img/no_photo.png";

import { getNews } from "../api/newsApi";
import { getCryptoList } from "../api/cryptocurrencyApi";

function News() {
  const [newsCategory, setNewsCategory] = useState<string>("Bitcoin");
  const [newsData, setNewsData] = useState<any>();
  const [cryptoList, setCryptoList] = useState<Object[]>();

  useEffect(() => {
    async function fetchData() {
      await getNews(newsCategory, 100).then((data) => {
        setNewsData(data);
      });

      await getCryptoList().then((data) => {
        setCryptoList(data);
      });
    }
    fetchData();
  }, [setNewsData, setCryptoList, newsCategory]);

  if (!cryptoList) return null;
  if (!newsData?.value) return null;

  return (
    <section className="news">
      <div className="search-and-header-wrapper">
        <div className="news-header">
          <h2>Cryptocurrency news</h2>
        </div>
        <select
          className="search-cryptocurrency"
          onChange={(e) => [setNewsCategory(e.target.value)]}
        >
          {cryptoList?.map((currency: any) => (
            <option key={currency.cmcRank} value={currency.name}>
              {currency.name}
            </option>
          ))}
        </select>
      </div>
      <div className="news-element-wrapper">
        {newsData?.value.map((news: any) => (
          <div className="news-element" key={news.url}>
            <a href={news.url} target="_blank" rel="noreferrer">
              <img
                className="news-element-img"
                src={news?.image?.thumbnail?.contentUrl || noImage}
                alt="photography of the article"
              />
              <div className="news-element-information-wrapper">
                <p className="news-element-header">
                  {news.description.length > 80
                    ? `${news.description.substring(0, 80)}...`
                    : news.description}
                </p>
                <p className="publication-time">
                  {moment(news.datePublished).startOf("seconds").fromNow()}
                </p>
              </div>
            </a>
          </div>
        ))}
        {!newsData?.value.length && (
          <p className="empty-crypto-news-info">
            We currently do not have any news
          </p>
        )}
      </div>
    </section>
  );
}

export default News;