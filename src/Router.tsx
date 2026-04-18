import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ArticlesIndex from "./pages/ArticlesIndex";
import ArticleMovingAverage from "./pages/ArticleMovingAverage";
import ArticlePnlBasics from "./pages/ArticlePnlBasics";
import ArticleCsvGuide from "./pages/ArticleCsvGuide";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/articles" element={<ArticlesIndex />} />
        <Route path="/articles/moving-average-vs-total-average" element={<ArticleMovingAverage />} />
        <Route path="/articles/crypto-pnl-basics" element={<ArticlePnlBasics />} />
        <Route path="/articles/csv-download-guide" element={<ArticleCsvGuide />} />
      </Routes>
    </BrowserRouter>
  );
}
