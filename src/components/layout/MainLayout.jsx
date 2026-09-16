import { useState } from "react";
import { BreadcrumbHostContext } from "./breadcrumbContext";
import { getScrollKey } from "@/utils/scrollReturn";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";


function RootLayout() {
  const location = useLocation();
  const hasBreadcrumbs = /^\/(movies|tv|people)\/[^/]+/.test(location.pathname);
  const [breadcrumbHost, setBreadcrumbHost] = useState(null);
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="sticky top-0 z-30">
        <Navbar />
        <div ref={setBreadcrumbHost} className={hasBreadcrumbs ? "min-h-12" : undefined} />
      </div>
      <ScrollRestoration getKey={getScrollKey} />

      <main className="flex-1">
        <BreadcrumbHostContext.Provider value={breadcrumbHost}><Outlet /></BreadcrumbHostContext.Provider>
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
