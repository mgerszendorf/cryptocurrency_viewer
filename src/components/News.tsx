import { useEffect, useState, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { INewsResponse, IValue } from "../interfaces/INewsResponse";
import { ICryptoListResponse, ICoin } from "../interfaces/ICryptoListResponse";
import noImage from "../img/no_photo.png";
import SelectCryptocurrencyContext from "../context/SelectCryptocurrencyContext";

import Loader from "./Loader";

export const News: React.FC = () => {
  const [newsData, setNewsData] = useState<INewsResponse>();
  const [cryptoList, setCryptoList] = useState<ICryptoListResponse>();
  const { newsCategory, handleSelectCryptocurrency, activeUuid } = useContext(
    SelectCryptocurrencyContext
  );

  //Fetching data
  useEffect(() => {
    async function fetchData() {
      await axios
        .post("http://localhost:8000/api/get_news", {
          newsCategory,
          count: 100,
        })
        .then((res: any) => setNewsData(res.data));

      await axios
        .get("http://localhost:8000/api/get_crypto_list")
        .then((res: any) => setCryptoList(res.data));
    }
    fetchData();
  }, [setNewsData, setCryptoList, newsCategory]);

  //Check that the data is not null
  if (!newsData?.value) return <Loader />;
  if (!cryptoList) return <Loader />;

  return (
    <section className="news">
      <div className="search-and-header-wrapper">
        <div className="news-header">
          <h2>Cryptocurrency news</h2>
        </div>
        <select
          className="search-cryptocurrency"
          onChange={(e) => [handleSelectCryptocurrency(e.target.value)]}
        >
          {cryptoList?.data?.coins?.map((currency: ICoin) =>
            currency?.uuid === activeUuid ? (
              <option
                key={currency?.uuid}
                value={currency?.name + "//" + currency?.uuid}
                selected
              >
                {currency?.name}
              </option>
            ) : (
              <option
                key={currency?.uuid}
                value={currency?.name + "//" + currency?.uuid}
              >
                {currency?.name}
              </option>
            )
          )}
        </select>
      </div>
      <div className="news-element-wrapper">
        {newsData?.value.map((news: IValue, i: number) => (
          <div className="news-element" key={i}>
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
};

export default News;
