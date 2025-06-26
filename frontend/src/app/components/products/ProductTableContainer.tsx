// src/app/components/shared/table/ProductTableContainer.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { InputRef, Button, Input, Space } from "antd";
import { ProductItem } from "@/lib/schemas/index-products";
import { EntityTable } from "../shared/table/EntityTable";
import { useProductStore } from "@/lib/store/product-store";
import { useProductQuery } from "@/lib/hooks/use-products-query";
import { useLoading } from "@/lib/hooks/use-loading";
import type { ColumnsType, TableProps } from "antd/es/table";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FilterConfirmProps, SorterResult } from "antd/es/table/interface";
import { formatToBRL } from "@/lib/utils/formatters";

type DataIndex = keyof ProductItem;

export function ProductTableContainer() {


  const { filters, setFilters, meta, } = useProductStore();
  const { data } = useProductQuery();
  const { loading } = useLoading();

  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [, setFilteredInfo] = useState({});
  const [sortedInfo, ] = useState<SorterResult<ProductItem>>({});
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const handleChange: TableProps<ProductItem>["onChange"] = (
    pagination: { current?: number; pageSize?: number },
    _filters: any,
    sorter: any
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    if (!singleSorter?.order || !singleSorter?.field) return;

    setFilters({
      page: pagination.current ?? 1,
      limit: pagination.pageSize ?? 10,
      sortBy: singleSorter.field as "name" | "price" | "createdAt",
      sortOrder: singleSorter.order === "ascend" ? "asc" : "desc",
    });
  };

  const getColumnSearchProps = (dataIndex: DataIndex): any => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: any;
      selectedKeys: any;
      confirm: any;
      clearFilters: any;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Buscar...`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
          >
            Buscar
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
            }}
            size="small"
          >
            Resetar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    filterDropdownProps: {
      onOpenChange: (open: any) => {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns: ColumnsType<ProductItem> = useMemo(
    () => [
      {
        title: "Nome",
        dataIndex: "name",
        key: "name",
        ...getColumnSearchProps("name"),
        sorter: true,
        sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      },
      {
        title: "Preço",
        dataIndex: "price",
        key: "price",
        align: "center" as const,
        sorter: (a: { price: number }, b: { price: number }) =>
          a.price - b.price,
        render: (
          _: any,
          record: {
            discount: { type: string; value: number };
            price: number | undefined;
            finalPrice: number | undefined;
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
                <>
                  <span className="line-through text-gray-500 text-sm">
                    {formatToBRL(record?.price?.toString() || "")}
                  </span>
                  <span className="font-semibold text-base">
                    {formatToBRL(record?.finalPrice?.toString() || "")}
                  </span>
                  <span className="mt-1 text-xs font-bold text-red-500 border border-red-500 rounded-full px-2 py-0.5">
                    {discountDisplay}
                  </span>
                </>
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
        sorter: true,
        sortOrder: sortedInfo.columnKey === "stock" ? sortedInfo.order : null,
      },
      {
        title: "Ações",
        key: "actions",
        align: "center" as const,
        render: (_: any, record: { id: any }) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              className="text-green-500 hover:text-green-700 bg-transparent border-0 shadow-none"
              onClick={() => console.log("Editar", record.id)}
            >
              Editar
              <EditOutlined />
            </Button>
            <Button
              onClick={() => console.log("Aplicar desconto", record.id)}
              className="text-blue-500 hover:text-blue-700 bg-transparent border-0 shadow-none"
            >
              <EditOutlined />
            </Button>

            <Button
              className="text-red-500 hover:text-red-700 bg-transparent border-0 shadow-none"
              onClick={() => console.log("Excluir", record.id)}
            >
              <DeleteOutlined />
            </Button>
          </div>
        ),
      },
    ],
    [sortedInfo]
  );

  return (
    <EntityTable
      title="Produtos"
      data={data?.data || []}
      columns={columns}
      loading={loading}
      total={meta?.totalItems || 0}
      pagination={{
        current: filters.page,
        pageSize: filters.limit,
        total: meta?.totalItems || 0,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50"],
      }}
      onChange={handleChange}
      onClearFilters={() => setFilteredInfo({})}
    />
  );
}
