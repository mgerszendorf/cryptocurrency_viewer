import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { RiArrowDropDownLine, RiStarLine } from "react-icons/ri";
import { ICryptoListResponse, ICoin } from "../interfaces/ICryptoListResponse";

import Loader from "./Loader";
import AuthContext from "../context/AuthContext";
import SelectCryptocurrencyContext from "../context/SelectCryptocurrencyContext";

export const Ranking: React.FC = () => {
  // button state to sort
  const [rankingToggle, setRankingToggle] = useState<boolean>(true);
  const [cryptoList, setCryptoList] = useState<ICryptoListResponse>();
  const [favoriteCryptocurrencies, setFavoriteCryptocurrencies] =
    useState<any>();
  const [updateFavouriteCryptocurrencies, setUpdateFavouriteCryptocurrencies] =
    useState<boolean>(false);
  const { user, accessToken, updateToken, handleErrorMessage } =
    useContext(AuthContext);
  const { handleSelectCryptocurrency } = useContext(
    SelectCryptocurrencyContext
  );

  // Fetching data
  useEffect(() => {
    async function fetchData() {
      await axios
        .get("http://localhost:8000/api/get_crypto_list")
        .then((res: any) => setCryptoList(res.data));
    }
    fetchData();
  }, [setCryptoList]);

  function sorting() {
    setRankingToggle(!rankingToggle);
    let array = cryptoList;
    array?.data?.coins?.reverse();
    setCryptoList(array);
  }

  async function updateFavoriteCryptocurrencies(
    uuid: string,
    change: string,
    iconUrl: string,
    name: string,
    price: string,
    rank: number,
    symbol: string
  ) {
    let coinData = {
      uuid,
      change,
      iconUrl,
      name,
      price,
      rank,
      symbol,
    };

    try {
      let response = await fetch(
        "http://localhost:8000/api/update_favorite_cryptocurrencies",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify({
            email: user?.email,
            uuid: uuid,
            coinData,
          }),
        }
      );
      setUpdateFavouriteCryptocurrencies(!updateFavouriteCryptocurrencies);

      if (response.status === 401) {
        updateToken();
      }
      if (response.status === 403) {
        updateToken();
      }
    } catch {
      handleErrorMessage("You must log in to access this feature");
    }
  }

  useEffect(() => {
    fetch("http://localhost:8000/api/get_favorite_cryptocurrencies", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        email: user?.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setFavoriteCryptocurrencies(data.favoriteCryptocurrencies);
        }
      });
  }, [user?.email, accessToken, updateFavouriteCryptocurrencies]);

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
          {cryptoList?.data?.coins?.map((currency: ICoin, i: number) => (
            <div
              className="ranking-list-element"
              onClick={() =>
                handleSelectCryptocurrency(
                  currency?.name + "//" + currency?.uuid
                )
              }
              key={i}
            >
              <div
                className="star-icon"
                onClick={() =>
                  updateFavoriteCryptocurrencies(
                    currency?.uuid,
                    currency?.change,
                    currency?.iconUrl,
                    currency?.name,
                    currency?.price,
                    currency?.rank,
                    currency?.symbol
                  )
                }
              >
                <RiStarLine
                  className={favoriteCryptocurrencies?.map((data: any) =>
                    currency?.uuid === data?.uuid ? "active" : null
                  )}
                />
              </div>
              <Link
                to="/statistics"
                className="ranking-list-element-link"
                key={currency?.rank}
              >
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
                    {parseFloat(currency?.price) < 1
                      ? `${
                          Math.round(parseFloat(currency?.price) * 1000000) /
                          1000000
                        }$`
                      : `${
                          Math.round(parseFloat(currency?.price) * 100) / 100
                        }$`}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ranking;
