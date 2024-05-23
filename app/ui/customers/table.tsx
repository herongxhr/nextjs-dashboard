"use client"
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { Tabs } from 'antd';
import InputArea from '@/app/ui/inputArea';
import Info from '@/app/ui/customers/info';

export default function CustomersTable({
  customers,
}: {
  customers: FormattedCustomersTable[];
}) {

  const handleSend = () => { }
  return (
    <div className="w-full">
      <Search placeholder="Search customers..." />
      <Tabs
        tabPosition='left'
        items={customers?.map((customer) => {
          return {
            label: customer.name,
            key: customer.userId,
            children: <div>
              <Info />
              <InputArea onSend={handleSend} />
            </div>
          }
        })}
      />
    </div>
  );
}
