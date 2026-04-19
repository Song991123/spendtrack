/**
 * 역할: 애플리케이션의 전체 라우팅을 연결하는 최상위 컴포넌트입니다.
 * 위치: src\App.tsx
 */
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { UploadPage } from "./pages/UploadPage";
import { ManualEntryPage } from "./pages/ManualEntryPage";
import { OcrUploadPage } from "./pages/OcrUploadPage";
import { OcrEditPage } from "./pages/OcrEditPage";
import { CsvUploadPage } from "./pages/CsvUploadPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { AnalysisPage } from "./pages/AnalysisPage";
import { SettingsPage } from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      {/* v1에서 확정한 화면 경로를 이곳에서 한 번에 관리합니다. */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/ocr-upload" element={<OcrUploadPage />} />
        <Route path="/manual-entry" element={<ManualEntryPage />} />
        <Route path="/ocr-edit" element={<OcrEditPage />} />
        <Route path="/csv-upload" element={<CsvUploadPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* 정의되지 않은 경로는 홈으로 되돌려서 데모 흐름이 끊기지 않게 합니다. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

