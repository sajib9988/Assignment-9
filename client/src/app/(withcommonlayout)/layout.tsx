

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import React from "react";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return(
  <div className="bg-[#0b0b0b] m-2 rounded-xl">
  <Navbar  />
  <main className="min-h-screen ">{children}</main>
<Footer />
</div>
  )
};

export default CommonLayout;

