"use client";

import "./globals.css"; // Your global styles
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session?: any;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children} {/* This will render either (main) layout or auth pages directly */}
        </SessionProvider>
      </body>
    </html>
  );
}
