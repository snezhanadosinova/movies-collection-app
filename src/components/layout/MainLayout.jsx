import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../common/ScrollToTop";

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <ScrollToTop />

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
