import "./globals.css"; // Your global styles
import { SessionProvider } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

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
