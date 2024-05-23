import { getFilteredCustomers } from '@/app/lib/data';
import CustomersOnline from '@/app/ui/customers/online';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const { customers, total } = await getFilteredCustomers();

  return (
    <main>
      <CustomersOnline customers={customers} />
    </main>
  );
}