import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import { Providers } from "@/providers/ChakraProvider";

export const metadata: Metadata = {
  title: "ไดอารี่ข้อมูลของทีม PI",
  description: "แหล่งรวมชุดข้อมูลสำหรับการทำงานวิจัยและโปรเจกต์ต่างๆ",
  icons: {
    icon: "/logo/web-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
