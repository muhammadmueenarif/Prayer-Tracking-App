import './globals.css';
import Footer from '@/app/components/Footer';
import { AuthProvider } from '@/app/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}