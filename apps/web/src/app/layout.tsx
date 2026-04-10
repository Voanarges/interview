import ThemeProvider from '@/shared/ui/ThemeProvider';
import { AuthProvider } from '@/features/auth';
import { Header } from '@/widgets/header';
import './global.css';

export const metadata = {
  title: 'EventHub - Event Management',
  description: 'Manage and register for events',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
