import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ShipmentsPage } from "@/pages/ShipmentsPage";
import { AssignmentsPage } from "@/pages/AssignmentsPage";
import { Navbar } from "@/components/common/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/shipments" replace />} />
          <Route path="/shipments" element={<ShipmentsPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
