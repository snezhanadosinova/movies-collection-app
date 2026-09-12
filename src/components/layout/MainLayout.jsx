import { getScrollKey } from "@/utils/scrollReturn";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";


function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <ScrollRestoration getKey={getScrollKey} />

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
