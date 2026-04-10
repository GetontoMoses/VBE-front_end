import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "VBS Management System",
  description: "Vacation Bible School management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
