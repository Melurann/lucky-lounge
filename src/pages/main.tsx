import { createRoot } from "react-dom/client";
import "../styles/global.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { BalanceProvider } from "../context/BalanceContext";
import { Layout } from "../layouts/Layout";
import { LandingPage } from "./LandingPage";
import { BlackjackPage } from "./BlackjackPage";
import { SlotsPage } from "./SlotsPage";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <BalanceProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/slots" element={<SlotsPage />} />
          <Route path="/blackjack" element={<BlackjackPage />} />
        </Route>
      </Routes>
    </BalanceProvider>
  </BrowserRouter>
);
