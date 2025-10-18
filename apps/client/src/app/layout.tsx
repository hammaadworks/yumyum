import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GlobalCart } from '@/components/shared/global-cart';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'YumYum',
  description: 'Your personal digital menu',
};

/**
 * Root layout component that provides the top-level HTML structure, applies the global Inter font and body classes, and renders the global cart alongside page content.
 *
 * @param children - The page or application content to render inside the body.
 * @returns The HTML element tree containing <html> and <body> with the global cart and provided children.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <GlobalCart />
        {children}
      </body>
    </html>
  );
}