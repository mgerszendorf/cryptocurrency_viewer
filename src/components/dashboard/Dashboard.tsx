import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  ICryptoListResponse,
  ICoin,
} from "../../interfaces/ICryptoListResponse";
import { IFavoriteCryptocurrenciesResponse } from "../../interfaces/IFavoriteCryptocurrenciesResponse";
import AbbreviatedStatistics from "./AbbreviatedStatistics";
import "../../styles/dashboard/AbbreviatedStatistics.css";
import NewsDashboard from "./NewsDashboard";
import "../../styles/dashboard/NewsDashboard.css";
import AuthContext from "../../context/AuthContext";

export const Dashboard: React.FC = () => {
  const [cryptoList, setCryptoList] = useState<ICryptoListResponse>();
  const [favoriteCryptocurrencies, setFavoriteCryptocurrencies] =
    useState<IFavoriteCryptocurrenciesResponse[]>();
  const { user } = useContext(AuthContext);

  //Fetching data
  useEffect(() => {
    async function fetchData() {
      await axios
        .get("http://localhost:8000/api/get_crypto_list")
        .then((res: any) => setCryptoList(res.data));

      fetch("http://localhost:8000/api/get_favorite_cryptocurrencies", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
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
    }
    fetchData();
  }, [setCryptoList, user?.email]);

  return (
    <section className="dashboard">
      <div className="dashboard-left-area">
        <div className="dashboard-top-bar">
          <p>Welcome Lana</p>
          <h2>Dashboard</h2>
        </div>
        <div className="abbreviated-statistics-wrapper">
          {user?.email
            ? favoriteCryptocurrencies?.map(
                (data: IFavoriteCryptocurrenciesResponse) => (
                  <AbbreviatedStatistics
                    name={data?.name}
                    symbol={data?.symbol}
                    price={data?.price}
                    iconUrl={data?.iconUrl}
                    change={data?.change}
                    rank={data?.rank}
                    key={data?.uuid}
                  />
                )
              )
            : cryptoList?.data?.coins
                ?.slice(0, 9)
                .map((data: ICoin) => (
                  <AbbreviatedStatistics
                    name={data?.name}
                    symbol={data?.symbol}
                    price={data?.price}
                    iconUrl={data?.iconUrl}
                    change={data?.change}
                    rank={data?.rank}
                    key={data?.rank}
                  />
                ))}
        </div>
      </div>
      <div className="dashboard-right-area">
        <NewsDashboard />
      </div>
    </section>
  );
};

export default Dashboard;
