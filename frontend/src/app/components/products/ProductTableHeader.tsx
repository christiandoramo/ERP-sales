// src/app/products/components/ProductTableHeader.tsx
'use client'

import { Button } from 'antd';

export function ProductTableHeader({
  total,
  onClear,
}: {
  total: number;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between mb-4">
      <span className="font-semibold text-black text-2xl">Lista de produtos</span>
      <div>
        <span className="mx-4 font-sans text-black text-lg">Total: {total}</span>
        <Button className="my-4 rounded-lg bg-white" onClick={onClear}>
          Limpar filtros
        </Button>
      </div>
    </div>
  );
}
