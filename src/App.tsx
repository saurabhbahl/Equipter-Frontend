import { HelmetProvider } from "react-helmet-async";
// import ErrorBoundary from "./components/utils/ErrorBoundary";
import Header from "./components/utils/Header";
import Router from "./components/utils/Router";

export default function App() {
  return (
    <div className="max-w-[2500px] mx-auto ">
      <HelmetProvider>
        {/* <ErrorBoundary> */}
        <Header />
        <Router />
        {/* </ErrorBoundary> */}
      </HelmetProvider>
    </div>
  );
}
