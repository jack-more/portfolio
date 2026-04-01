import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import './globals.css';

const lora = Lora({ subsets: ['latin'], variable: '--font-serif', weight: ['400', '600', '700'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Jack Morello',
  description: 'Paid media strategist and performance marketer based in Los Angeles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
