import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ICryptoListResponse, ICoin } from "../interfaces/ICryptoListResponse";
import { ICryptoHistoryResponse } from "../interfaces/ICryptoHistoryResponse";
import { ICoinResponse } from "../interfaces/ICoinResponse";
import SelectCryptocurrencyContext from "../context/SelectCryptocurrencyContext";
import Loader from "./Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LiveChart: React.FC = () => {
  const timePeriodsArr = ["3h", "24h", "7d", "30d", "3m", "1y", "3y", "5y"];
  const [timePeriod, setTimePeriod] = useState<string>("3h");
  const [priceHistory, setPriceHistory] = useState<ICryptoHistoryResponse>();
  const [cryptoList, setCryptoList] = useState<ICryptoListResponse>();
  const [activeCoin, setActiveCoin] = useState<ICoinResponse>();
  const price = [];
  const timestamp = [];
  const { handleSelectCryptocurrency, activeUuid } = useContext(
    SelectCryptocurrencyContext
  );

  //Fetching data
  useEffect(() => {
    async function fetchData() {
      await axios
        .post(
          "https://cryptocurrencyviewer.herokuapp.com/api/get_crypto_history",
          {
            activeUuid,
            timePeriod,
          }
        )
        .then((res: any) => setPriceHistory(res.data));

      await axios
        .get("https://cryptocurrencyviewer.herokuapp.com/api/get_crypto_list")
        .then((res: any) => setCryptoList(res.data));

      await axios
        .post("https://cryptocurrencyviewer.herokuapp.com/api/get_coin", {
          activeUuid,
        })
        .then((res: any) => setActiveCoin(res.data));
    }

    fetchData();
  }, [setPriceHistory, activeUuid, timePeriod]);

  // Adding elements from API to price and timestamp array
  if (priceHistory?.data !== undefined) {
    for (let i = 0; i < priceHistory?.data?.history?.length; i++) {
      price.unshift(priceHistory?.data?.history[i].price);
    }

    for (let i = 0; i < priceHistory?.data?.history?.length; i++) {
      if (timePeriod === "3h" || timePeriod === "24h") {
        timestamp.unshift(
          new Date(
            priceHistory?.data?.history[i].timestamp * 1000
          ).toLocaleTimeString()
        );
      } else {
        timestamp.unshift(
          new Date(
            priceHistory?.data?.history[i].timestamp * 1000
          ).toLocaleDateString()
        );
      }
    }
  }

  // Chart.js data and options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#60687c",
        },
      },

      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },

    scales: {
      y: {
        ticks: {
          color: "#60687c",
        },
      },

      x: {
        ticks: {
          color: "#60687c",
        },
      },
    },
  };

  const data = {
    labels: timestamp,
    color: "#fff",
    datasets: [
      {
        label: "USD",
        data: price,
        fill: false,
        backgroundColor: "#FA47CE",
        borderColor: "#FA47CE",
      },
    ],
  };

  //Check that the data is not null
  if (!priceHistory) return <Loader />;
  if (!cryptoList) return <Loader />;

  return (
    <section className="live-chart">
      <div className="search-and-header-container-chart">
        <div className="live-chart-header">
          <h2>Live Chart</h2>
        </div>
        <select
          className="search-chart-cryptocurrency"
          onChange={(e) => [handleSelectCryptocurrency(e.target.value)]}
        >
          {cryptoList?.data?.coins?.map((crypto: ICoin) =>
            crypto?.uuid === activeUuid ? (
              <option
                key={crypto?.name}
                value={crypto?.name + "//" + crypto?.uuid}
                selected
              >
                {crypto?.name}
              </option>
            ) : (
              <option
                key={crypto?.name}
                value={crypto?.name + "//" + crypto?.uuid}
              >
                {crypto?.name}
              </option>
            )
          )}
        </select>
      </div>
      <div className="live-chart-element-wrapper">
        <div className="select-and-current-price-container">
          <select
            className="time-period-select"
            onChange={(e) => [setTimePeriod(e.target.value)]}
          >
            {timePeriodsArr?.map((data: string) => (
              <option key={data} value={data}>
                {data}
              </option>
            ))}
          </select>
          <p>
            {activeCoin?.data !== undefined &&
            parseFloat(activeCoin?.data?.coin?.price) < 1
              ? `Current price: $${
                  Math.round(
                    parseFloat(activeCoin?.data?.coin?.price) * 1000000
                  ) / 1000000
                }`
              : `Current price: $${
                  Math.round(
                    parseFloat(activeCoin?.data?.coin?.price as string) * 10
                  ) / 10
                }`}
          </p>
        </div>
        <div className="live-chart-area">
          <Line
            data={data}
            options={options}
            style={{ width: "100%", maxHeight: "85%" }}
          />
        </div>
      </div>
    </section>
  );
};

export default LiveChart;
