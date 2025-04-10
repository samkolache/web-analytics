'use client';

import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Modal from "./components/Modal";
import { ModalProvider } from "../contexts/ModalContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { Montserrat, Roboto } from 'next/font/google';

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"]
});

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"]
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} ${roboto.className} bg-slate-100`}>
        <AnalyticsProvider>
          <ModalProvider>
            <div className="flex flex-col min-h-screen">
              {/* Navbar - Full width at the top */}
              <Navbar />
              
              {/* Main content area - sidebar and children */}
              <div className="flex flex-1">
                {/* Sidebar - fixed width on the left */}
                <div className="w-48 bg-white shadow-md">
                  <Sidebar />
                </div>
                
                {/* Content area - flexible width, to the right of sidebar */}
                <div className="flex-1 p-6 overflow-auto">
                  {children}
                </div>
              </div>
            </div>
            
            {/* Modal rendered at the root level */}
            <Modal />
          </ModalProvider>
        </AnalyticsProvider>
        
      </body>
    </html>
  );
}