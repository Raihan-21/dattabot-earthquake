import Link from "next/link";
import React from "react";

export const Sidebar = () => {
  return (
    <div className="bg-red-500 w-[200px]">
      <div className="p-4">
        <p>Sidebar</p>
      </div>
      <div className="flex flex-col">
        <Link href={"/"} className="p-4">
          Home
        </Link>
        <Link href={"/alert"} className="p-4">
          Alert
        </Link>
        <Link href={"/occured"} className="p-4">
          Total occured
        </Link>
      </div>
    </div>
  );
};
