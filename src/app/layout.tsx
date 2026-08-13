import type { Metadata } from 'next';
import { IBM_Plex_Sans, Geist, Geist_Mono } from 'next/font/google';
import { themeScript } from '@/lib/theme';
import './globals.css';

const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex',
});

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'Academia IA · Comparativa de plataformas',
  description:
    'Módulos y capacidades de Copilot, Claude, Gemini y ChatGPT, para capacitaciones corporativas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${plex.variable} ${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
