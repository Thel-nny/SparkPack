import "./globals.css"; // Your global styles


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children} {/* This will render either (main) layout or auth pages directly */}
      </body>
    </html>
  );
}