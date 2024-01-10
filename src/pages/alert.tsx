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
import { Pie, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);
import "react-datepicker/dist/react-datepicker.css";
import FilterCard from "@/components/organisms/FilterCard";

const inter = Inter({ subsets: ["latin"] });

const pieLabels = ["green", "yellow", "orange", "red"];

export const getServerSideProps = async () => {
  const responses = await Promise.all(
    pieLabels.map((label) =>
      axiosInstance.get(
        `/query?format=geojson&alertlevel=${label}&starttime=${new Date(
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .slice(0, 10)}`
      )
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
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());

  // Fetch data function
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

  // Update date function
  const selectDate = useCallback(
    (dates: any) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    },
    [maxDate]
  );

  // Calculate max date range
  const calculateMaxDate = useCallback(() => {
    setMaxDate(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  }, [startDate]);

  useEffect(() => {
    calculateMaxDate();
  }, [startDate]);

  return (
    <main className={`min-h-screen bg-white p-24 ${inter.className}`}>
      <p className="text-[30px] font-bold mb-4">
        Earthquake occured by alert level
      </p>
      <FilterCard>
        <>
          <div className="mb-4">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div>
                <p className="text-lg font-bold">
                  Filter by date{" "}
                  <span className="text-xs font-normal">(Max 7 days)</span>
                </p>
                <Datepicker
                  selected={startDate}
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={maxDate}
                  onChange={selectDate}
                  selectsRange
                  // inline
                  shouldCloseOnSelect
                  wrapperClassName="date-picker"
                />
              </div>
            </div>
          </div>
          <div className="flex">
            <button
              onClick={fetchData}
              className="bg-green-700 py-2 px-4 rounded-md text-white"
            >
              Filter
            </button>
          </div>
        </>
      </FilterCard>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="max-w-[500px] w-full mx-auto flex justify-center">
          <Doughnut data={pieData} title="Alert level" />
        </div>
      )}
    </main>
  );
}
