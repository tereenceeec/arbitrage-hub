import ReactDOM from "react-dom/client";
import App from "./components/App";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { ArbitrageProvider } from "./components/functions/arbitrageContext";

const theme = extendTheme({
  colors: {
    brand: {
      100: "#f7c8a3",
      200: "#f29b6a",
      300: "#e66e32",
      400: "#e55a1e",
      500: "#c54814", // Custom color example
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <ArbitrageProvider>
        <App />
      </ArbitrageProvider>
    </ChakraProvider>
  </BrowserRouter>
);
