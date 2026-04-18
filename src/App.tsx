import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { UploadPage } from "./pages/UploadPage";
import { ManualEntryPage } from "./pages/ManualEntryPage";
import { OcrUploadPage } from "./pages/OcrUploadPage";
import { OcrEditPage } from "./pages/OcrEditPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { AnalysisPage } from "./pages/AnalysisPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/ocr-upload" element={<OcrUploadPage />} />
        <Route path="/manual-entry" element={<ManualEntryPage />} />
        <Route path="/ocr-edit" element={<OcrEditPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
