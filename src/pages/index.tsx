import Image from "next/image";
import { Inter } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "@/axios";

import Datepicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {
  APIProvider,
  Map,
  Marker,
  useApiIsLoaded,
} from "@vis.gl/react-google-maps";

const inter = Inter({ subsets: ["latin"] });

const pieLabels = ["green", "yellow", "orange", "red"];

export const getServerSideProps = async () => {
  try {
    const responses = await axiosInstance.get(
      `/query?format=geojson&starttime=2023-12-01`
    );

    const data = responses.data.features.map((data: any) => {
      return { mag: data.properties.mag, geometry: data.geometry };
    });
    console.log(data);
    // const data = res.data;
    return {
      props: {
        data: data,
      },
    };
  } catch (error: any) {
    console.log(error.response);
  }
};

export default function Home({ data }: { data: any }) {
  const apiIsLoaded = useApiIsLoaded();

  const [locationList, setLocationList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());

  const [markerData, setMarkerData] = useState([]);

  const fetchData = useCallback(async () => {
    if (!endDate) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        `/query?format=geojson&starttime=${startDate
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
  }, [startDate, endDate]);
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

  const renderCircle = useCallback((magnitude: number) => {
    return;
  }, []);
  useEffect(() => {
    setLocationList(data);
  }, [data]);

  return (
    <main className={` min-h-screen bg-white p-24 ${inter.className}`}>
      <p className="text-[30px] font-bold">Earthquake mapping visualization</p>
      <div className="mb-6">
        <p className="text-lg">
          Filter by date <span className="text-xs">(Max 30 days)</span>
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
          <APIProvider apiKey={process.env.NEXT_PUBLIC_API_KEY!}>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <Map center={{ lat: 41.850033, lng: -87.6500523 }} zoom={2}>
                {locationList.length &&
                  locationList.map((location: any) => (
                    <Marker
                      position={{
                        lat: location.geometry.coordinates[0],
                        lng: location.geometry.coordinates[1],
                      }}
                    />
                  ))}
              </Map>
            )}
          </APIProvider>
        </div>
      )}
    </main>
  );
}
