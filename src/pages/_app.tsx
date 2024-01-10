import MobileSidebar from "@/components/molecules/MobileSidebar";
import { Sidebar } from "@/components/molecules/Sidebar";
import "@/styles/globals.scss";
import theme from "@/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 800) {
        setIsMobile(true);
        return;
      }
      setIsMobile(false);
    });
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <div className="flex">
        {isMobile ? <MobileSidebar /> : <Sidebar />}
        <div className="flex-grow container">
          <Component {...pageProps} />
        </div>
      </div>
    </ChakraProvider>
  );
}
