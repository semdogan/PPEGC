// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PEGCC',
  description: 'Platform for Exceptional Genomic Cancer Cases',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/quick-case">Quick Case</Link>
            <Link href="/feed">Feed</Link>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
