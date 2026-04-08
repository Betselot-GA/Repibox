import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Search from "./search";
import RecipeDetail from "./RecipeDetail";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function LegacySearchRedirect() {
  const { q } = useParams();
  return (
    <Navigate
      to={{
        pathname: "/search",
        search: `?q=${encodeURIComponent(q || "")}`,
      }}
      replace
    />
  );
}

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route exact path="/" element={<App />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/:q" element={<LegacySearchRedirect />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
