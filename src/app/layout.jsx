import "./globals.css";

export const metadata = {
  title: "SMS Dashboard",
  description: "Dashboard System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
