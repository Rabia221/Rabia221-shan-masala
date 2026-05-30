import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ToastProvider from "@/components/ui/ToastProvider";
import "./globals.css";

export const metadata = {
  title: {
    default: "Shan Masala — Premium Authentic Pakistani Spices & Masalas",
    template: "%s | Shan Masala",
  },
  description:
    "Buy authentic Shan Masala spices online. Premium quality Pakistani masalas including Biryani, Korma, Karahi, Tikka and more. Free shipping on orders over Rs. 2000. Trusted by 1 million+ families since 1981.",
  keywords: [
    "Shan Masala", "Pakistani spices", "biryani masala", "korma masala",
    "karahi masala", "tikka masala", "authentic spices", "buy spices online",
    "Pakistani food", "masala online Pakistan",
  ],
  authors: [{ name: "Shan Masala" }],
  creator: "Shan Masala",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shanmasala.com",
    siteName: "Shan Masala",
    title: "Shan Masala — Premium Authentic Pakistani Spices",
    description:
      "Discover the true essence of Pakistani cuisine with Shan Masala's premium quality spices. Trusted by millions worldwide since 1981.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Shan Masala" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shan Masala — Premium Authentic Pakistani Spices",
    description: "Buy authentic Pakistani masalas online. Free shipping on orders over Rs. 2000.",
    images: ["/images/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white">
        <AuthProvider>
          <CartProvider>
            <ToastProvider />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
