import Header from "@/components/Header";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "SMS Dashboard",
  description: "Dashboard System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>  
                 <main>{children}</main>
      </body>
    </html>
  );
}