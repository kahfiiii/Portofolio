import SmoothScroll from "../components/SmoothScroll";
import "./globals.css";

export const metadata = {
  title: "Mohamad Sohibul Kahfi | Backend Developer",
  description: "Portfolio of Mohamad Sohibul Kahfi, specializing in Backend Architecture, Scalable Systems, and Interactive 3D Web Experiences.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="overflow-x-hidden relative" suppressHydrationWarning>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
