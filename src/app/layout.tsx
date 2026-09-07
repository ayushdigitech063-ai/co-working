import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Preloader from "@/components/Preloader";
import AutoLeadPopup from "@/components/AutoLeadPopup";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexusHub — Premium Coworking Spaces in India",
  description:
    "Discover modern, fully serviced coworking spaces, private cabins, hot desks, and meeting rooms in Gurugram, Mumbai, Bengaluru, and Hyderabad.",
  keywords: "coworking, workspace, private cabin, hot desk, meeting room, Gurugram, Mumbai, Bengaluru",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased font-sans`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900 font-sans">
        <AuthProvider>
          <Preloader />
          <AutoLeadPopup />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
