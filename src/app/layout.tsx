import type { Metadata } from 'next';
import './globals.css';
import { AnalyticsTracker } from '../components/AnalyticsTracker';

export const metadata: Metadata = {
  title: 'vocaloid',
  description: 'Vocaloid Interactive Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <AnalyticsTracker />
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
