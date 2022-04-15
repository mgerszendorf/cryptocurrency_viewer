import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import noImage from "../../img/no_photo.png";
import {
  ICryptoListResponse,
  ICoin,
} from "../../interfaces/ICryptoListResponse";
import { INewsResponse, IValue } from "../../interfaces/INewsResponse";
import SelectCryptocurrencyContext from "../../context/SelectCryptocurrencyContext";
import Loader from "../Loader";

export const NewsDashboard: React.FC = () => {
  const [cryptoList, setCryptoList] = useState<ICryptoListResponse>();
  const [newsData, setNewsData] = useState<INewsResponse>();
  const { newsCategory, handleSelectCryptocurrency, activeUuid } = useContext(
    SelectCryptocurrencyContext
  );

  //Fetching data
  useEffect(() => {
    async function fetchData() {
      await axios
        .post("http://localhost:8000/api/get_news", {
          newsCategory,
          count: 10,
        })
        .then((res: any) => setNewsData(res.data));

      await axios
        .get("http://localhost:8000/api/get_crypto_list")
        .then((res: any) => setCryptoList(res.data));
    }

    fetchData();
  }, [setCryptoList, setNewsData, newsCategory]);

  //Check that the data is not null
  if (!cryptoList) return <Loader />;
  if (!newsData) return <Loader />;

  return (
    <div className="crypto-news-dashboard">
      <div className="crypto-news-header-and-select">
        <h2>Crypto News</h2>
        <select onChange={(e) => [handleSelectCryptocurrency(e.target.value)]}>
          {cryptoList?.data?.coins?.map((currency: ICoin, i: number) =>
            currency?.uuid === activeUuid ? (
              <option
                value={currency.name + "//" + currency.uuid}
                key={i}
                selected
              >
                {currency.name}
              </option>
            ) : (
              <option value={currency.name + "//" + currency.uuid} key={i}>
                {currency.name}
              </option>
            )
          )}
        </select>
      </div>

      <div className="news-dashboard-element-wrapper">
        {newsData?.value?.map((news: IValue, i: number) => (
          <div className="news-dashboard-element" key={i}>
            <a href={news.url} target="_blank" rel="noreferrer">
              <img
                className="news-dashboard-element-img"
                src={news?.image?.thumbnail?.contentUrl || noImage}
                alt="photography of the article"
              />
              <div className="news-dashboard-element-information-wrapper">
                <p className="news-dashboard-element-header">
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
        {newsData?.value?.length === 0 && (
          <p className="empty-crypto-news-info-dashboard">
            We currently do not have any news
          </p>
        )}
        <Link to="/news">
          <button className="news-dashboard-button">Show all</button>
        </Link>
      </div>
    </div>
  );
};

export default NewsDashboard;
