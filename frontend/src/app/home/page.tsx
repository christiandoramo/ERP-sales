'use client';
import { Sidebar } from '../components/shared/SideBar';
import { ProductTable } from '../components/products/ProductTable';
import { Button } from 'antd';
import { useThemeStore } from '@/lib/store/theme-store';
import { useProductStore } from '@/lib/store/product-store';
import { CreateProductForm } from '../components/products/CreateProductsForm';

export default function HomePage() {

  const { toggleTheme } = useThemeStore();
  const { section } = useProductStore();

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#111] text-black dark:text-white">
      <aside className="w-64 min-h-screen p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <Button onClick={toggleTheme} className="mt-4">
          Alternar Tema
        </Button>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
      {section === 'table' && <ProductTable />}
      {section === 'create' && <CreateProductForm />}

        </main>
    </div>
  );
}
