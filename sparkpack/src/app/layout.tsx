import "./globals.css"; // Your global styles
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import SessionProviderWrapper from "./SessionProviderWrapper";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper session={session}>
          {children} {/* This will render either (main) layout or auth pages directly */}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
