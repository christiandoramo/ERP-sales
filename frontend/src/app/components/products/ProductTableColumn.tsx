// frontend/src/app/components/products/ProductTableColumn.tsx
"use client";

import type { ColumnsType } from "antd/es/table";
import { ProductItem } from "@/lib/schemas/index-products";
import { Button, InputRef } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { getColumnSearchProps } from "./ColumnSearchProps";
import { formatToBRL } from "@/lib/utils/formatters";
import { useProductStore } from "@/lib/store/product-store";
import { Section, useSectionStore } from "@/lib/store/section-store";

interface Params {
  searchText: string;
  setSearchText: (val: string) => void;
  searchedColumn: string;
  setSearchedColumn: (val: string) => void;
  searchInput: React.RefObject<InputRef | null>;
  setSection: (section: Section) => void;
  setSelectedProduct: (product: ProductItem) => void;
  setModalProductId: (produtId: number) => void;
}

export const getProductTableColumn = ({
  searchText,
  setSearchText,
  searchedColumn,
  setSearchedColumn,
  searchInput,
  setSection,
  setModalProductId,
  setSelectedProduct,
}: Params): ColumnsType<ProductItem> => [
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    sorter: (a, b) => a.name.localeCompare(b.name),
    ...getColumnSearchProps<ProductItem>(
      "name",
      searchInput,
      searchText,
      setSearchText,
      searchedColumn,
      setSearchedColumn
    ),
  },
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
    ...getColumnSearchProps<ProductItem>(
      "description",
      searchInput,
      searchText,
      setSearchText,
      searchedColumn,
      setSearchedColumn
    ),
  },
  {
    title: "Preço",
    dataIndex: "price",
    key: "price",
    align: "center" as const,
    sorter: (a: { price: number }, b: { price: number }) => a.price - b.price,
    render: (
      _: any,
      record: {
        discount: {
          type: "fixed" | "percent";
          value: number;
          appliedAt: string;
        } | null;
        price: number | undefined;
        finalPrice: number | null;
      }
    ) => {
      const hasDiscount = !!record.discount;
      const isPercent = record.discount?.type === "percent";
      const discountValue = record.discount?.value ?? 0;

      const discountDisplay = isPercent
        ? `-${discountValue}%`
        : `-${formatToBRL(discountValue.toString())}`;

      return (
        <div className="flex flex-col items-center text-center">
          {hasDiscount ? (
            <div className="flex flex-row gap-1 align-middle justify-center">
              <div className="flex flex-col">
                <span className="flex line-through text-gray-500 text-sm">
                  {formatToBRL(record?.price?.toString() || "")}
                </span>
                <span className="flex font-semibold text-base">
                  {formatToBRL(record?.finalPrice?.toString() || "")}
                </span>
              </div>
              <div className="flex">
                <span className="text-xs font-bold text-red-500 border border-red-500 rounded-full px-1">
                  {discountDisplay}
                </span>
              </div>
            </div>
          ) : (
            <span className="font-medium">
              {formatToBRL(record?.price?.toString() || "")}
            </span>
          )}
        </div>
      );
    },
  },
  {
    title: "Estoque",
    dataIndex: "stock",
    key: "stock",
    sorter: (a, b) => a.stock - b.stock,
  },
  {
    title: "Criado em",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: true,
    render: (value) => {
      const date = new Date(value);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    title: "Ações",
    key: "actions",
    align: "center" as const,
    render: (_: any, record: ProductItem) => (
      <div className="flex items-center justify-center gap-2">
        <Button
          className="text-green-500 hover:text-green-700 bg-transparent border-0 shadow-none"
          onClick={() => {
            setSelectedProduct(record);
            setSection("update-product");
          }}
        >
          <EditOutlined />
        </Button>
        <Button
          className="text-blue-500"
          onClick={() => {
            setModalProductId(record.id);
            console.log("Aplicar desconto", record.id);
          }}
        >
          <ShoppingOutlined />
        </Button>
        <Button
          className="text-red-500 hover:text-red-700 bg-transparent border-0 shadow-none"
          onClick={() => console.log("Desativar", record.id)}
        >
          <DeleteOutlined />
        </Button>
      </div>
    ),
  },
];
