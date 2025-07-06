import type { Metadata } from "next";
import "../globals.css"; 
import TopNavbar from "@/components/layout/TopNavbar";


export const metadata: Metadata = {
  title: "Furrest Pet Insurance", 
  description: "Developed by SparkPack",
};

export default function MainLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopNavbar />
      {children}
    </>
  );
}