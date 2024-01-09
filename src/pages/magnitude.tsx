import Image from "next/image";
import { Inter } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "@/axios";

import Datepicker from "react-datepicker";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);
import "react-datepicker/dist/react-datepicker.css";

const inter = Inter({ subsets: ["latin"] });

const pieLabels = ["green", "yellow", "orange", "red"];

export const getServerSideProps = async () => {
  const responses = await Promise.all(
    pieLabels.map((label) =>
      axiosInstance.get(`/query?format=geojson&starttime=2023-02-01`)
    )
  );
  const pieData = responses.map((res) => {
    return res.data.metadata.count;
  });

  // const data = res.data;
  return {
    props: { data: pieData },
  };
};

export default function Home({ data }: { data: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const [pieData, setPieData] = useState<any>({
    labels: pieLabels,
    datasets: [
      {
        label: "Total occured",
        data,
        backgroundColor: pieLabels,
      },
    ],
  });

  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    if (!endDate) return;
    setIsLoading(true);
    try {
      const responses = await Promise.all(
        pieLabels.map((label) =>
          axiosInstance.get(
            `/query?format=geojson&alertlevel=${label}&starttime=${startDate
              .toISOString()
              .slice(0, 10)}&endtime=${endDate.toISOString().slice(0, 10)}`
          )
        )
      );
      setPieData((prevState: any) => ({
        ...prevState,
        datasets: [
          {
            ...prevState.datasets[0],
            data: responses.map((res) => {
              return res.data.metadata.count;
            }),
          },
        ],
      }));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, pieData]);
  const selectDate = useCallback(
    (dates: any) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    },
    [maxDate]
  );

  const calculateMaxDate = useCallback(() => {
    setMaxDate(new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000));
  }, [startDate]);

  useEffect(() => {
    calculateMaxDate();
  }, [startDate]);
  useEffect(() => {
    fetchData();
  }, [endDate]);

  useEffect(() => {
    console.log(pieData);
  }, [pieData]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <p className="text-xl font-bold">Earthquake occured by alert level</p>
      <Datepicker
        selected={startDate}
        startDate={startDate}
        endDate={endDate}
        maxDate={maxDate}
        onChange={selectDate}
        selectsRange
        // inline
        shouldCloseOnSelect
      />
      {isLoading ? <p>Loading...</p> : <Bar data={pieData} />}
    </main>
  );
}
