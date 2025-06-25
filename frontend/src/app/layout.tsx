import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ThemeInitializer } from './theme-initializer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Providers } from './providers';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ERP: Product Coupon',
  description: 'Gestão de produtos e promoções',
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         <Providers>
          <ThemeInitializer />
          {children}
        </Providers>
      </body>
    </html>
  );
}


