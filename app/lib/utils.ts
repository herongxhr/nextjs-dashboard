import { Revenue } from './definitions';
import { Socket } from 'socket.io';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const getClientIpAddress = (socket: Socket): string => {
  const forwardedHeader = socket.handshake.headers['forwarded'];
  const xForwardedForHeader = socket.handshake.headers['x-forwarded-for'];
  const cloudflareHeader = socket.handshake.headers['cf-connecting-ip'];
  const fastlyHeader = socket.handshake.headers['fastly-client-ip'];

  // Helper function to parse the Forwarded header
  const parseForwardedHeader = (header: string): string | null => {
    const directives = header.split(',');
    for (const directive of directives) {
      const parts = directive.split(';');
      for (const part of parts) {
        const [key, value] = part.trim().split('=');
        if (key === 'for' && value) {
          return value.trim();
        }
      }
    }
    return null;
  };

  // Check if Forwarded header is present
  if (forwardedHeader) {
    const ipAddress = parseForwardedHeader(forwardedHeader);
    if (ipAddress) {
      return ipAddress;
    }
  }

  // Check if X-Forwarded-For header is present
  if (xForwardedForHeader) {
    const ipAddress = (xForwardedForHeader as string).split(',')[0].trim();
    if (ipAddress) {
      return ipAddress;
    }
  }

  // Check if CloudFlare header is present
  if (cloudflareHeader) {
    return cloudflareHeader as string;
  }

  // Check if Fastly header is present
  if (fastlyHeader) {
    return fastlyHeader as string;
  }

  // Default: use the direct connection address
  return socket.handshake.address;
};
