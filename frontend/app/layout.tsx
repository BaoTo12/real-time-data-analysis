import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/providers';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'StreamSearch — Real-Time Data Analysis',
  description:
    'Search and explore real-time tweet data indexed from Apache Kafka into Elasticsearch via a Spring Boot microservices pipeline.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
