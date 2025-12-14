import Header from "@/components/Header";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";

export const metadata = {
  title: "SMS Dashboard",
  description: "Dashboard System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>  

    <Toaster position="top-right" richColors closeButton />
        <main>{children}</main>
      </body>
    </html>
  );
}