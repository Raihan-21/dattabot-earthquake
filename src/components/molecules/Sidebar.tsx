import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="bg-primary w-[200px] text-white">
      <div className="p-4">
        <p className="pl-4 text-xl font-bold">Earthquake Monitoring</p>
      </div>
      <div className="flex flex-col">
        <Link
          href={"/"}
          className={`p-4 ${
            router.pathname === "/" ? "bg-secondary font-bold" : ""
          }`}
        >
          Home
        </Link>
        <Link
          href={"/alert"}
          className={`p-4 ${
            router.pathname === "/alert" ? "bg-secondary font-bold" : ""
          }`}
        >
          Alert Level
        </Link>
        <Link
          href={"/occured"}
          className={`p-4 ${
            router.pathname === "/occured" ? "bg-secondary font-bold" : ""
          }`}
        >
          Total occured
        </Link>
      </div>
    </div>
  );
};
