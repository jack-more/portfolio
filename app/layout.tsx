import type { Metadata } from 'next';
import { Lora, Inter, Instrument_Serif, Geist_Mono } from 'next/font/google';
import './globals.css';
import GameEffects from './components/GameEffects';

const lora = Lora({ subsets: ['latin'], variable: '--font-serif', weight: ['400', '600', '700'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const news = Instrument_Serif({ subsets: ['latin'], variable: '--font-news', weight: '400', style: ['normal', 'italic'] });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Jack Morello',
  description: 'Jack Morello runs Ballast Research: research, development and media distribution, Los Angeles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable} ${news.variable} ${mono.variable}`}>
      <body>
        {children}
        <GameEffects />
      </body>
    </html>
  );
}
