// frontend/src/app/components/products/ProductTableHeader.tsx
"use client";

import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { MaskedCurrencyInput } from "../shared/inputs/MaskedInputCurrency";

// Removido handleMinMaxPrice pois não é mais necessário separadamente

export function ProductTableHeader({
  total,
  searchText,
  setSearchText,
  onSearch,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}: {
  total: number;
  searchText: string;
  setSearchText: (value: string) => void;
  onSearch: () => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between mb-4">
      <span className="font-semibold text-black text-2xl">
        Produtos
      </span>
      <div className="flex gap-4 items-center">
        <div className="flex flex-row flex-wrap items-end gap-4 bg-white p-4 rounded-md shadow-sm">
          {/* Mínimo */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Preço mínimo
            </label>
            <MaskedCurrencyInput
              value={minPrice}
              onChange={(val) => {
                const next = Math.min(val, maxPrice);
                setMinPrice(Math.max(0.01, next));
              }}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Preço máximo
            </label>

            <MaskedCurrencyInput
              value={maxPrice}
              onChange={(val) => {
                const next = Math.max(val, minPrice);
                setMaxPrice(Math.min(1000000, next));
              }}
            />
          </div>
        </div>

        <Input
          placeholder="Busque pelo nome"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={onSearch} // ✅ enter dispara busca completa
          allowClear
          className="w-64"
        />

        <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
          Buscar
        </Button>

        <span className="text-black dark:text-white">Total: {total}</span>
      </div>
    </div>
  );
}
