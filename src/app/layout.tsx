import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'


export const metadata: Metadata = {
  title: 'Intquo - Offline IQ Test',
  description: 'A production-grade offline IQ test mobile application with scientifically defensible scoring, age-based calibration, and anti-cheat mechanisms.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen")}>
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
