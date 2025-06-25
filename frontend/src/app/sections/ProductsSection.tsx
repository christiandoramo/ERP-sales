// frontend/src/app/sections/ProductsSection.tsx
"use client";
import { useQueryClient } from "@tanstack/react-query";

import { Table, TableProps, InputRef, Input, Button } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProductQuery } from "@/lib/hooks/use-products-query";
import { useProductStore } from "@/lib/store/product-store";
import { useLoading } from "@/lib/hooks/use-loading";
import { getProductTableColumn } from "@/app/components/products/ProductTableColumn";
import { ProductTableHeader } from "./../components/products/ProductTableHeader";
import { OverlayLoader } from "./../components/shared/layout/OverlayLoader";
import { ProductItem } from "@/lib/schemas/index-products";
import { GoToCreateProductButton } from "./../components/shared/buttons/GoToCreateProductButton";
import { useSectionStore } from "@/lib/store/section-store";

export function ProductsSection() {
  const queryClient = useQueryClient();

  const { filters, setFilters, products, meta } = useProductStore();
  const { isFetching } = useProductQuery();
  const { loading, setLoading } = useLoading();

  const searchInput = useRef<InputRef>(null);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [tableTotal, setTableTotal] = useState(0);

  const { setSection } = useSectionStore();
  const { setSelectedProduct } = useProductStore();

  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching]);

  useEffect(() => {
    if (meta?.totalItems) setTableTotal(meta.totalItems);
  }, [meta]);

  const handleChange: TableProps<ProductItem>["onChange"] = (
    pagination,
    sorter
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    const newSortBy =
      singleSorter?.order && singleSorter?.field
        ? (singleSorter.field as "name" | "price" | "createdAt" | "stock")
        : undefined;

    const newSortOrder =
      singleSorter?.order === "ascend"
        ? "asc"
        : singleSorter?.order === "descend"
        ? "desc"
        : undefined;

    setFilters((prev) => {
      const newPage = singleSorter?.order ? 1 : pagination.current ?? prev.page;
      console.log("Página atual: ", newPage);
      console.log(
        `pagination.current : ${pagination.current} ?? prev.page : ${prev.page}`
      );

      const newLimit = pagination.pageSize ?? prev.limit;

      return {
        ...prev,
        page: newPage,
        limit: newLimit,
        sortBy: newSortBy,
        sortOrder: newSortOrder,
      };
    });
  };

  // const handleClearFilters = () => {
  //   setSearchText("");
  //   setFilters({
  //     page: 1,
  //     limit: 10,
  //     search: undefined,
  //     sortBy: undefined,
  //     sortOrder: undefined,
  //     minPrice: undefined,
  //     maxPrice: undefined,
  //     stock: undefined,
  //     hasDiscount: undefined,
  //     includeDeleted: undefined,
  //     onlyOutOfStock: undefined,
  //     withCouponApplied: undefined,
  //   });
  // };

  const pagination = useMemo(
    () => ({
      current: filters.page,
      pageSize: filters.limit,
      total: meta?.totalItems ?? 0,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "30", "40", "50"],
    }),
    [filters.page, filters.limit, meta?.totalItems]
  );

  const [minPrice, setMinPrice] = useState(0.01);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const handleMinMaxPrice = () => {
    if (minPrice > maxPrice) return;
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: searchText.trim() || undefined,
      minPrice,
      maxPrice,
    }));
  };


const handleSearch = () => {
  if (minPrice > maxPrice) return;
  setFilters((prev) => ({
    ...prev,
    page: 1,
    search: searchText.trim() || undefined,
    minPrice,
    maxPrice,
  }));
};

  return (
    <div>
      <OverlayLoader loading={loading} />

      <GoToCreateProductButton loading={loading} />
      <ProductTableHeader
      total={tableTotal}
      searchText={searchText}
      setSearchText={setSearchText}
      minPrice={minPrice}
      maxPrice={maxPrice}
      setMinPrice={setMinPrice}
      setMaxPrice={setMaxPrice}
      onSearch={handleSearch}
      />

      {loading && products.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="h-12 bg-gray-200 animate-pulse rounded-md"
            />
          ))}
        </div>
      ) : (
        <Table
          rowKey="id"
          dataSource={products}
          columns={getProductTableColumn({
            searchText,
            setSearchText,
            searchedColumn,
            setSearchedColumn,
            showModal: (id: any) => console.log("Abrir modal para ID:", id),
            searchInput,
            setSection,
            setSelectedProduct,
          })}
          pagination={pagination}
          loading={loading}
          onChange={handleChange}
          scroll={{ x: 400 }}
        />
      )}
    </div>
  );
}
