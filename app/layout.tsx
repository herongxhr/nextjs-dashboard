import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import '@/app/ui/global.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Chat from '@/app/ui/support/chat';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AntdRegistry>{children}</AntdRegistry>
        <Chat />
      </body>
    </html>
  );
}
