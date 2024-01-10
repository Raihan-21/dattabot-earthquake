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
  try {
    const responses = await axiosInstance.get(
      `/query?format=geojson&starttime=${new Date(
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10)}&orderby=time-asc`
    );

    const dataList = responses.data.features.map((data: any) => {
      return new Date(data.properties.time);
    });

    // Group data by day
    let groupedArray: any = [[]];
    let groupedIndex = 0;
    dataList.forEach((data: any, i: number) => {
      groupedArray[groupedIndex].push(data);
      if (
        data.toISOString().slice(0, 10) !==
        groupedArray[groupedIndex][0].toISOString().slice(0, 10)
      ) {
        groupedIndex++;
        groupedArray[groupedIndex] = [];
      }
    });

    // Convert data into time and total occuring per day only
    groupedArray = groupedArray.map((array: any) => ({
      time: array[0].toString(),
      count: array.length,
    }));

    return {
      props: {
        serverData: groupedArray,
      },
    };
  } catch (error: any) {
    console.log(error.response);
  }
};

export default function Magnitude({ serverData }: { serverData: any }) {
  const [barData, setbarData] = useState<any>({
    labels: serverData.map((data: any) =>
      new Date(data.time).toISOString().slice(0, 10)
    ),
    datasets: [
      {
        label: "Total occured",
        data: serverData.map((data: any) => data.count),
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderColor: "red",
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());

  // Fetch function on every date change
  const fetchData = useCallback(async () => {
    if (!endDate) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        `/query?format=geojson&starttime=${startDate
          .toISOString()
          .slice(0, 10)}&endtime=${endDate
          .toISOString()
          .slice(0, 10)}&orderby=time-asc`
      );
      const dateList = res.data.features.map((data: any) => {
        return new Date(data.properties.time);
      });
      let groupedArray: any = [[]];
      let groupedIndex = 0;
      dateList.forEach((data: any, i: number) => {
        groupedArray[groupedIndex].push(data);
        if (
          data.toISOString().slice(0, 10) !==
          groupedArray[groupedIndex][0].toISOString().slice(0, 10)
        ) {
          groupedIndex++;
          groupedArray[groupedIndex] = [];
        }
      });
      groupedArray = groupedArray.map((array: any) => ({
        time: array[0].toString(),
        count: array.length,
      }));
      setbarData((prevState: any) => ({
        ...prevState,
        labels: groupedArray.map((data: any) =>
          new Date(data.time).toISOString().slice(0, 10)
        ),
        datasets: [
          {
            ...prevState.datasets[0],
            data: groupedArray.map((data: any) => data.count),
          },
        ],
      }));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  // Update date function
  const selectDate = useCallback(
    (dates: any) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    },
    [maxDate]
  );

  const calculateMaxDate = useCallback(() => {
    setMaxDate(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  }, [startDate]);

  useEffect(() => {
    calculateMaxDate();
  }, [startDate]);
  useEffect(() => {
    fetchData();
  }, [endDate]);
  return (
    <main className={` min-h-screen bg-white p-24 ${inter.className}`}>
      <p className="text-[30px] font-bold mb-4">
        Total occuring earthquake (by day)
      </p>
      <div className="mb-6">
        <p className="text-lg">
          Filter by date <span className="text-xs">(Max 7 days)</span>
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
        />
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full  h-[200px]">
          <div className="w-full">
            <Bar data={barData} />
          </div>
        </div>
      )}
    </main>
  );
}
