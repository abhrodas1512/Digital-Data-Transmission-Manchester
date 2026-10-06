import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Digital Data Transmission Using Manchester Encoding and Decoding", description: "Digital Communication mini project demonstrating Manchester encoding, transmission, decoding and message recovery" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
