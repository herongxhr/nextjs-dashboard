import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { getFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Layout({ children }: { children: React.ReactNode }) {

  const { customers, total } = await getFilteredCustomers();

  return (
    <main className='flex'>
      <aside className='mr-4'>{
        customers.map(customer => {
          return <div key={customer.id}>{customer.name}</div>
        })
      }</aside>
      <main>{children}</main>
    </main>
  );
}