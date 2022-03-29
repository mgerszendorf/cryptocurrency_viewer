import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiArrowDropDownLine, RiStarLine } from "react-icons/ri";

import { getCryptoList } from "../api/cryptocurrencyApi";

import { ICryptoListResponse } from "../interfaces/ICryptoListResponse";

import Loader from "./Loader";

interface RankingProps {
  setActiveUuid?: Dispatch<SetStateAction<string>>;
}

export const Ranking: React.FC<RankingProps> = ({ setActiveUuid }) => {
  // button state to sort
  const [rankingToggle, setRankingToggle] = useState<boolean>(true);
  const [cryptoList, setCryptoList] = useState<ICryptoListResponse>();
  const [favoriteCryptocurrenciesArr, setFavoriteCryptocurrenciesArr] =
    useState<string[]>([]);

  //Fetching data
  useEffect(() => {
    async function fetchData() {
      await getCryptoList().then((currency) => {
        setCryptoList(currency);
      });
    }
    fetchData();
  }, [setCryptoList]);

  function sorting() {
    setRankingToggle(!rankingToggle);
    let array = cryptoList;
    array?.data?.coins?.reverse();
    setCryptoList(array);
  }

  function setActiveCryptocurrency(uuid: string) {
    if (setActiveUuid !== undefined) setActiveUuid(uuid);
  }

  function updateFavoriteCryptocurrencies(uuid: string) {
    setFavoriteCryptocurrenciesArr((favoriteCryptocurrenciesArr) => [
      ...favoriteCryptocurrenciesArr,
      uuid,
    ]);
  }

  console.log(favoriteCryptocurrenciesArr);

  if (!cryptoList) return <Loader />;

  return (
    <section className="ranking">
      <div className="ranking-header">
        <h2>Ranking</h2>
      </div>
      <div className="ranking-table">
        <div className="ranking-table-header">
          <div></div>
          <div className="ranking-sort" onClick={() => sorting()}>
            <p>#</p>
            <RiArrowDropDownLine
              className={
                rankingToggle ? "RiArrowDropUpLine" : "RiArrowDropDownLine"
              }
            />
          </div>
          <div>
            <p>Name</p>
          </div>
          <div>
            <p>Price</p>
          </div>
        </div>
        <div className="ranking-list-wrapper">
          {cryptoList?.data?.coins?.map((currency: any) => (
            <Link to="/statistics" key={currency?.rank}>
              <div
                className="ranking-list-element"
                onClick={() => setActiveCryptocurrency(currency?.uuid)}
              >
                <div
                  className="star-icon"
                  onClick={() => updateFavoriteCryptocurrencies(currency?.uuid)}
                >
                  <RiStarLine />
                </div>
                <div className="item-number">
                  <p>{currency?.rank}</p>
                </div>
                <div className="item-name">
                  <img src={currency?.iconUrl} alt="" />
                  <p>{currency?.name}</p>
                  <p>{currency?.symbol}</p>
                </div>
                <div className="item-price">
                  <p>
                    {currency?.price < 1
                      ? `${Math.round(currency?.price * 1000000) / 1000000}$`
                      : `${Math.round(currency?.price * 10) / 10}$`}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ranking;
