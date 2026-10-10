import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoolVideo — Promo images & videos from any URL",
  description:
    "Paste a link and get scroll-stopping promo images and videos in motion graphics, Vox, 3D, cinematic and more styles.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#a78bfa",
          colorBackground: "#0f0f16",
          colorForeground: "#f4f4f7",
          colorInput: "#16161f",
          colorInputForeground: "#f4f4f7",
          colorMutedForeground: "#9b9bb0",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html lang="es">
        <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
