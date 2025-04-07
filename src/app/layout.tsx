import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#E5E1DC]">
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
      </body>
    </html>
  );
}