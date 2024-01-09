import Image from "next/image";
import { Inter } from "next/font/google";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useState } from "react";
import { axiosInstance } from "@/axios";

const inter = Inter({ subsets: ["latin"] });

const pieLabels = ["green", "yellow", "orange", "red"];

export const getServerSideProps = async () => {
  const res = await Promise.all(
    pieLabels.map(
      (label) =>
        `/query?format=geojson&alertlevel=${label}&starttime=2023-12-01`
    )
  );
  console.log(res);

  // const data = res.data;
  return {
    props: { data: "tes" },
  };
};

export default function Home({ data }: { data: any }) {
  const [pieData, setPieData] = useState<any>({
    labels: pieLabels,
    datasets: [
      {
        label: "",
        data: [],
      },
    ],
  });

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    ></main>
  );
}
