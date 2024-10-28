import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import Router from "./components/Router";

export default function App() {
  return (
    <>
      <ErrorBoundary>
        <Header />
        <Router />
      </ErrorBoundary>
    </>
  );
}
