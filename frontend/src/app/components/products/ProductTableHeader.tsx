// frontend/src/app/components/products/ProductTableHeader.tsx
"use client";

import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

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
      <span className="font-semibold text-black dark:text-white text-2xl">
        Lista de produtos
      </span>
      <div className="flex gap-4 items-center">
        <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-md shadow-sm">
          {/* Mínimo */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Preço mínimo
            </label>
            <Input
              type="text"
              value={minPrice.toFixed(2)}
              onChange={(e) => {
                const raw = parseFloat(e.target.value.replace(",", "."));
                setMinPrice(Math.max(0.01, Math.min(raw || 0.01, maxPrice)));
              }}
              onBlur={() => {
                if (minPrice > maxPrice) setMinPrice(maxPrice);
              }}
              className="w-32"
            />
          </div>

          {/* Máximo */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Preço máximo
            </label>
            <Input
              type="text"
              value={maxPrice.toFixed(2)}
              onChange={(e) => {
                const raw = parseFloat(e.target.value.replace(",", "."));
                setMaxPrice(
                  Math.min(1000000, Math.max(raw || 1000000, minPrice))
                );
              }}
              onBlur={() => {
                if (maxPrice < minPrice) setMaxPrice(minPrice);
              }}
              className="w-32"
            />
          </div>
        </div>

        {/* Campo de nome */}
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
