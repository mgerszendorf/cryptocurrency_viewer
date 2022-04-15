import { useEffect, useState, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ICryptoListResponse, ICoin } from "../interfaces/ICryptoListResponse";
import { ICoinResponse } from "../interfaces/ICoinResponse";
import { ICoinDetailsWithTimeResponse } from "../interfaces/ICoinDetailsWithTimeResponse";
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
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import { RiMedalFill } from "react-icons/ri";
import { FiMaximize2 } from "react-icons/fi";
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

export const Statistics: React.FC = () => {
  const [cryptoList, setCryptoList] = useState<ICryptoListResponse>();
  const [coinDetails, setCoinDetails] = useState<ICoinResponse>();
  const [coinDetailsWithTime, setCoinDetailsWithTime] =
    useState<ICoinDetailsWithTimeResponse>();
  const [lowestPrice, setLowestPrice] = useState<number>();
  const [highestPrice, setHighestPrice] = useState<number>();
  const [timePeriod, setTimePeriod] = useState<string>("24h");
  const price: string[] = [];
  const { handleSelectCryptocurrency, activeUuid } = useContext(
    SelectCryptocurrencyContext
  );

  //Fetching data
  useEffect(() => {
    async function fetchData() {
      await axios
        .get("http://localhost:8000/api/get_crypto_list")
        .then((res: any) => setCryptoList(res.data));

      await axios
        .post("http://localhost:8000/api/get_coin", {
          activeUuid,
        })
        .then((res: any) => setCoinDetails(res.data));

      await axios
        .post("http://localhost:8000/api/get_coin_time", {
          activeUuid,
          timePeriod,
        })
        .then((res: any) => setCoinDetailsWithTime(res.data));
    }
    fetchData();
  }, [setCryptoList, activeUuid, timePeriod]);

  // Time period option
  let time_period_option = ["24h", "7d", "30d"];

  // Adding elements from API to array
  if (coinDetails?.data?.coin?.sparkline?.length !== undefined)
    for (let i = 0; i < coinDetails?.data?.coin?.sparkline?.length; i++) {
      price.unshift(coinDetails?.data?.coin?.sparkline[i]);
    }

  // Determining the highest and lowest price
  const determiningHighestPrice = useCallback(() => {
    price.sort((a: any, b: any) => b - a);
    setHighestPrice(parseFloat(price[0]));
  }, [price]);

  const determiningLowestPrice = useCallback(() => {
    price.sort((a: any, b: any) => a - b);
    setLowestPrice(parseFloat(price[0]));
  }, [price]);

  useEffect(() => {
    determiningHighestPrice();
    determiningLowestPrice();
  }, [determiningHighestPrice, determiningLowestPrice]);

  // Chart.js
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: "#60687c",
        },
      },
    },

    scales: {
      y: {
        display: false,
        ticks: {
          color: "#60687c",
        },
      },

      x: {
        display: false,
        ticks: {
          color: "#60687c",
        },
      },
    },
  };

  const data = {
    labels: [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
    ],
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
  if (!cryptoList) return <Loader />;
  if (!coinDetails) return <Loader />;
  if (!coinDetailsWithTime) return <Loader />;

  return (
    <section className="statistics">
      <div className="statistics-header-wrapper">
        <div className="statistics-header">
          <h2>Statistics</h2>
        </div>
        <select
          className="select-cryptocurrency"
          onChange={(e) => [handleSelectCryptocurrency(e.target.value)]}
        >
          {cryptoList?.data?.coins?.map((coin: ICoin) =>
            coin?.uuid === activeUuid ? (
              <option
                key={coin?.rank}
                value={coin?.name + "//" + coin?.uuid}
                selected
              >
                {coin?.name}
              </option>
            ) : (
              <option key={coin?.rank} value={coin?.name + "//" + coin?.uuid}>
                {coin?.name}
              </option>
            )
          )}
        </select>
      </div>

      <main className="statistics-main-container">
        <div className="price">
          <div>
            <img src={coinDetails?.data?.coin?.iconUrl} alt="Coin logo" />
            <p>
              {coinDetails?.data?.coin?.name} {coinDetails?.data?.coin?.symbol}
            </p>
          </div>
          <p className="price-txt">
            {coinDetails?.data !== undefined &&
            parseFloat(coinDetails?.data?.coin?.price) < 1
              ? `$${
                  Math.round(
                    parseFloat(coinDetails?.data?.coin?.price) * 1000000
                  ) / 1000000
                }`
              : `$${
                  Math.round(
                    parseFloat(coinDetails?.data?.coin?.price as string) * 100
                  ) / 100
                }`}
          </p>
        </div>
        <div className="height24h">
          <div className="height24h-header">
            <MdArrowDropUp />
            <p>Height 24h</p>
          </div>

          <p className="height24h-value">
            {highestPrice !== undefined &&
              `$${Math.round(highestPrice * 1000000) / 1000000}`}
          </p>
        </div>
        <div className="low24h">
          <div className="low24h-header">
            <MdArrowDropDown />
            <p>Low 24h</p>
          </div>
          <p className="low24h-value">
            {lowestPrice !== undefined &&
              `$${Math.round(lowestPrice * 1000000) / 1000000}`}
          </p>
        </div>
        <div className="rank">
          <div className="rank-header">
            <RiMedalFill />
            <p>Rank</p>
          </div>
          <p className="rank-value">{coinDetails?.data?.coin?.rank}</p>
        </div>
        <div className="bottom-area-container">
          <div className="live-chart-statistics-container">
            <div className="live-chart-statistics-header">
              <p>Live chart last 24h</p>
              <Link to="/live_chart">
                <FiMaximize2 />
              </Link>
            </div>
            <div className="live-chart-statistics">
              <Line data={data} options={options} style={{ width: 700 }} />
            </div>
          </div>
          <div className="volume-and-percent-change">
            <div className="volume">
              <div>
                <p className="volume-header">Volume</p>
              </div>
              <p className="volume-value">{`${
                Math.round(
                  parseFloat(coinDetailsWithTime?.data?.coin["24hVolume"]) * 10
                ) / 10
              }`}</p>
            </div>
            <div className="percent-change">
              <div>
                <p className="percent-change-header">Percent change</p>
                <select
                  className="select-percent-change"
                  onChange={(e) => setTimePeriod(e.target.value)}
                >
                  {time_period_option.map((option: string, i: number) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <p className="percent-chanege-value">
                {coinDetailsWithTime !== undefined &&
                  `${
                    Math.round(
                      parseFloat(coinDetailsWithTime?.data?.coin?.change) * 100
                    ) / 100
                  }%`}
              </p>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Statistics;
