import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from 'sonner';
import ReactQueryProvider from '@/providers/react-query-provider';
import ReduxProvider from '@/providers/redux-provider';
import { raleway } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'OmniSocial - Automate Your Social Media Engagement',
  description: 'Intelligent responses to comments, powered by AI. Connect with your audience automatically while maintaining authentic conversations.',
  icons: {
    icon: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7c2e5d31-2f16-49c1-99cc-34dedd0af769-removebg%20(1)-Zr0OtI6dyUvUdzzjBAHM4wKmRAlyWv.svg',
        type: 'image/svg+xml',
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${raleway.variable} font-sans antialiased`}>
        <body
          suppressHydrationWarning
          className={`${raleway.className} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange
          >
            <ReduxProvider>
              <ReactQueryProvider>
                {children}
              </ReactQueryProvider>
            </ReduxProvider>

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}