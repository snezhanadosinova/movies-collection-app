import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ScrollToTop from "../common/ScrollToTop";

function RootLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <ScrollToTop />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
