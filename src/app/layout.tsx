import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppLayoutClient from '@/components/layout/app-layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Módulo Compras',
  description: 'App de Gestión de Proveedores',
  icons: {
    icon: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cpath%20d='M6%2010a4%204%200%200%201-4-4%204%204%200%200%201%204-4'%20/%3E%3Cpath%20d='M6%2022a4%204%200%200%200-4-4%204%204%200%200%200%204-4'%20/%3E%3Cpath%20d='M18%2010a4%204%200%200%200%204-4%204%204%200%200%200-4-4'%20/%3E%3Cpath%20d='M18%2022a4%204%200%200%201%204-4%204%204%200%200%201-4-4'%20/%3E%3Cpath%20d='M14%2018v-4'%20/%3E%3Cpath%20d='M10%2018v-4'%20/%3E%3Cpath%20d='M12%2014v-4'%20/%3E%3Cpath%20d='M12%206V2'%20/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <AppLayoutClient>{children}</AppLayoutClient>
        <Toaster />
      </body>
    </html>
  );
}
