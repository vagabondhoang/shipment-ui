import { Toaster } from "react-hot-toast";
import { ShipmentsPage } from "@/pages/ShipmentsPage";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <ShipmentsPage />
    </>
  );
}

export default App;
