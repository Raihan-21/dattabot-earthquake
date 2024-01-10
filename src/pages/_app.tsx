import { Sidebar } from "@/components/molecules/Sidebar";
import "@/styles/globals.css";
import theme from "@/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <div className="flex">
        <Sidebar />
        <div className="flex-grow">
          <Component {...pageProps} />
        </div>
      </div>
    </ChakraProvider>
  );
}
