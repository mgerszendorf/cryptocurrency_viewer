import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiArrowDropDownLine, RiStarLine } from "react-icons/ri";

import { getCryptoList } from "../api/cryptocurrencyApi";

import Loader from "./Loader";

interface RankingProps {
  setActiveUuid?: Dispatch<SetStateAction<string>>;
}

export const Ranking: React.FC<RankingProps> = ({ setActiveUuid }) => {
  // button state to sort
  const [rankingToggle, setRankingToggle] = useState<boolean>(true);
  const [cryptoList, setCryptoList] = useState<any>();

  //Fetching data
  useEffect(() => {
    async function fetchData() {
      await getCryptoList().then((currency) => {
        setCryptoList(currency.data.coins);
      });
    }
    fetchData();
  }, [setCryptoList]);

  function sorting() {
    setRankingToggle(!rankingToggle);
    let array = cryptoList;
    array.reverse();
    setCryptoList(array);
  }

  function setActiveCryptocurrency(uuid: string) {
    if (setActiveUuid !== undefined) setActiveUuid(uuid);
  }

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
          {cryptoList?.map((currency: any) => (
            <Link to="/statistics" key={currency?.rank}>
              <div
                className="ranking-list-element"
                onClick={() => setActiveCryptocurrency(currency?.uuid)}
              >
                <div className="star-icon">
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
                  <p>{`${Math.round(currency?.price * 1000000) / 1000000}$`}</p>
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
