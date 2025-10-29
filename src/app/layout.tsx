import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GoogleAnalytics from '@/components/features/analytics/GoogleAnalytics';
import { GlobalCart } from '@/components/shared/GlobalCart';
import { ImageViewerModal } from '@/components/shared/ImageViewerModal';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'YumYum',
  description: 'Your personal digital menu',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <GlobalCart />
        <ImageViewerModal />
        {children}
      </body>
    </html>
  );
}