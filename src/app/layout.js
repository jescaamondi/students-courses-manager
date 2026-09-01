import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "Students & Courses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-gray-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
