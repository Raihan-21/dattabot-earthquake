import { Sidebar } from "@/components/molecules/Sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
