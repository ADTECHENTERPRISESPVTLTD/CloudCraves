import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalBite — Cloud Kitchen Ordering",
  description: "Local food ordering platform for independent kitchens."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
