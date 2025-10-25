import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'PEGCC Prisma Mockup',
  description: 'Quick Case + Feed powered by Prisma (SQLite).',
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
