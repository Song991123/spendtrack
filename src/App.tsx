import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { UploadPage } from "./pages/UploadPage";
import type { NavKey } from "./components/layout/AppShell";
import { TransactionsPage } from "./pages/TransactionsPage";
import { AnalysisPage } from "./pages/AnalysisPage";

function App() {
  const [activeNav, setActiveNav] = useState<NavKey>("home");

  if (activeNav === "upload") {
    return (
      <UploadPage activeNav={activeNav} onNavChange={setActiveNav} />
    );
  }
    if (activeNav === "transactions") {
    return (
      <TransactionsPage
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />
    );
  }
  if (activeNav === "analysis") {
    return (
      <AnalysisPage
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />
    );
  }

  return (
    <HomePage activeNav={activeNav} onNavChange={setActiveNav} />
  );
}

export default App;