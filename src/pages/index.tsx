import Image from "next/image";
import { Inter } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "@/axios";

import Datepicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { category } from "@/types/data";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const inter = Inter({ subsets: ["latin"] });

const pieLabels = ["green", "yellow", "orange", "red"];

export const getServerSideProps = async () => {
  try {
    const responses = await axiosInstance.get(
      `/query?format=geojson&starttime=${new Date(
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10)}`
    );

    const dataList = responses.data.features.map((data: any) => {
      return { mag: data.properties.mag, geometry: data.geometry };
    });
    const total = responses.data.count;
    let categories = [
      {
        desc: "0 - 2M",
        count: 0,
      },
      {
        desc: "3M - 5M",
        count: 0,
      },
      {
        desc: "6M - 8M",
        count: 0,
      },
      {
        desc: "> 9M",
        count: 0,
      },
    ];

    let groupedArray = [[], [], [], []];
    groupedArray[0] = dataList.filter((data: any) => data.mag <= 2);
    groupedArray[1] = dataList.filter(
      (data: any) => data.mag >= 3 && data.mag <= 5
    );
    groupedArray[2] = dataList.filter(
      (data: any) => data.mag >= 6 && data.mag <= 8
    );
    groupedArray[3] = dataList.filter((data: any) => data.mag > 9);

    categories[0].count = groupedArray[0].length;
    categories[1].count = groupedArray[1].length;
    categories[2].count = groupedArray[2].length;
    categories[3].count = groupedArray[3].length;
    // const dataList = res.dataList;
    return {
      props: {
        data: dataList,
        categories,
      },
    };
  } catch (error: any) {
    console.log(error.response);
  }
};

const labels = ["0 - 2M", "3M - 5M", "6M - 8M", "> 9M"];

export default function Home({
  data,
  categories,
}: {
  data: any;
  categories: category[];
}) {
  const [locationList, setLocationList] = useState([]);
  const [categoriesData, setCategoriesData] = useState<category[]>([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [maxRadius, setMaxRadius] = useState(2001.6);

  const [pieData, setPieData] = useState({
    labels,
    datasets: [
      {
        label: "Total Occured",
        data: categories.map((category: category) => category.count),
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(255, 100, 50)",
        ],
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    if (!endDate) return;
    // if(latitude)
    if (latitude || longitude || maxRadius) {
      if (!latitude || !longitude || !maxRadius) return;
    }
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        `/query?format=geojson&latitude=${latitude}&longitude=${longitude}&maxradiuskm=${maxRadius}&starttime=${startDate
          .toISOString()
          .slice(0, 10)}&endtime=${endDate.toISOString().slice(0, 10)}`
      );
      setLocationList(
        res.data.features.map((data: any) => {
          return { mag: data.properties.mag, geometry: data.geometry };
        })
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, latitude, longitude, maxRadius]);
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
  // useEffect(() => {
  //   fetchData();
  // }, [endDate]);

  const renderCircle = useCallback((magnitude: number) => {
    return;
  }, []);
  useEffect(() => {
    setLocationList(data);
    setCategoriesData(categories);
  }, [data]);

  useEffect(() => {
    console.log(locationList);
  }, [locationList]);

  return (
    <main className={` min-h-screen bg-white p-24 ${inter.className}`}>
      <p className="text-[30px] font-bold mb-4">
        Earthquake mapping visualization
      </p>
      <div className="mb-6 p-4 rounded-md filter__container">
        <div className="flex gap-x-6 mb-4">
          <div>
            <p className="text-lg font-bold">
              Filter by date <span className="text-xs">(Max 30 days)</span>
            </p>{" "}
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
          <div>
            <p className="text-lg font-bold">Search in certain area</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p>Latitude</p>
                <input
                  type="number"
                  className="border-2 border-black"
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </div>
              <div>
                <p>Longitude</p>
                <input
                  type="number"
                  className="border-2 border-black"
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>{" "}
              <div>
                <p>Max radius</p>
                <input
                  type="number"
                  className="border-2 border-black"
                  onChange={(e) => setMaxRadius(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="flex">
          <button
            onClick={fetchData}
            className="bg-green-700 py-2 px-4 rounded-md text-white"
          >
            Filter
          </button>
        </div>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full ">
          <div className="w-full  h-[200px] mb-6">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_API_KEY!}>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <Map center={{ lat: 41.850033, lng: -87.6500523 }} zoom={2}>
                  {locationList.length &&
                    locationList.map((location: any) => (
                      <Marker
                        position={{
                          lat: location.geometry.coordinates[1],
                          lng: location.geometry.coordinates[0],
                        }}
                      />
                    ))}
                </Map>
              )}
            </APIProvider>
          </div>
          <p className="text-[30px] font-bold mb-4">
            Earthquake chart based on magnitude power
          </p>
          <Pie data={pieData} />
        </div>
      )}
    </main>
  );
}
