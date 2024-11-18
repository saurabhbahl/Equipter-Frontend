import ErrorBoundary from "./components/utils/ErrorBoundary";
import Header from "./components/utils/Header";
import Router from "./components/utils/Router";


export default function App() {
  return (
    <>
      {/* <ErrorBoundary> */}
        <Header />
        <Router />
      {/* </ErrorBoundary> */}
    </>
  );
}
