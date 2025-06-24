// src/app/components/products/ProductTable.tsx
"use client";

import { Table, Button, TableProps, InputRef } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProductQuery } from "@/lib/hooks/use-products-query";
import { useProductStore } from "@/lib/store/product-store";
import { useLoading } from "@/lib/hooks/use-loading";
import { getProductTableColumn } from "@/app/components/products/ProductTableColumn";
import { ProductTableHeader } from "./ProductTableHeader";
import { OverlayLoader } from "../shared/OverlayLoader";
import { ProductItem } from "@/lib/schemas/index-products";

export function ProductTable() {
  const { filters, setFilters, products, meta } = useProductStore();
  const { isFetching } = useProductQuery();
  const { loading, setLoading } = useLoading();

  const searchInput = useRef<InputRef>(null);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [tableTotal, setTableTotal] = useState(0);

  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching]);

  useEffect(() => {
    if (meta?.totalItems) setTableTotal(meta.totalItems);
  }, [meta]);

  const handleChange: TableProps<ProductItem>["onChange"] = (
    pagination,
    _filters,
    sorter,
    _extra
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

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: filters.limit,
      search: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      hasDiscount: undefined,
      sortBy: "name",
      sortOrder: "asc",
      includeDeleted: undefined,
      onlyOutOfStock: undefined,
      withCouponApplied: undefined,
    });
  };

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

  return (
    <div>
      <OverlayLoader loading={loading} />
      <Button
  className="bg-black text-white dark:bg-white dark:text-black border-none hover:opacity-90 transition-all"
  onClick={() => setSection('create')}
  icon={<span className="font-bold text-lg mr-2">+</span>}
>
  Criar produto
</Button>
      <ProductTableHeader total={tableTotal} onClear={handleClearFilters} />
      {loading && products.length === 0 ? (
  <div className="space-y-4">
    {Array.from({ length: 10 }).map((_, idx) => (
      <div
        key={idx}
        className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"
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

// 'use client';

// import {
//   Table,
//   Button,
//   Input,
//   Checkbox,
//   Select,
//   Slider,
//   Form,
// } from 'antd';
// import { useEffect, useMemo, useRef, useState } from 'react';
// import { useProductQuery } from '@/lib/hooks/use-products-query';
// import { useProductStore } from '@/lib/store/product-store';
// import { useLoading } from '@/lib/hooks/use-loading';
// import { getProductTableColumn } from './ProductTableColumn';
// import { OverlayLoader } from '../shared/OverlayLoader';
// import { ProductItem } from '@/lib/schemas/index-products';
// import { InputRef } from 'antd';

// const { Option } = Select;

// export function ProductTable() {
//   const { filters, setFilters, products, meta } = useProductStore();
//   const { isFetching } = useProductQuery();
//   const { loading, setLoading } = useLoading();

//   const [form] = Form.useForm();
//   const searchInput = useRef<InputRef>(null);
//   const [searchText, setSearchText] = useState('');
//   const [searchedColumn, setSearchedColumn] = useState('');



// const didMount = useRef(false); // para remontar o form

// useEffect(() => {
//   if (!didMount.current) {
//     form.setFieldsValue({
//       name: filters.search ?? '',
//       minPrice: filters.minPrice,
//       maxPrice: filters.maxPrice,
//       hasDiscount: filters.hasDiscount,
//       sortBy: filters.sortBy,
//       sortOrder: filters.sortOrder,
//       includeDeleted: filters.includeDeleted,
//       onlyOutOfStock: filters.onlyOutOfStock,
//       withCouponApplied: filters.withCouponApplied,
//     });
//     didMount.current = true;
//   }
// }, []);


//   useEffect(() => {
//     setLoading(isFetching);
//   }, [isFetching]);

//   const pagination = useMemo(
//     () => ({
//       current: filters.page,
//       pageSize: filters.limit,
//       total: meta?.totalItems ?? 0,
//       showSizeChanger: true,
//       pageSizeOptions: ['10', '20', '30', '40', '50'],
//     }),
//     [filters.page, filters.limit, meta?.totalItems]
//   );

//   const handlePageChange = (pagination: any) => {
//     // força sempre novo objeto (evita não atualizar se for o mesmo page)
//     setFilters({
//       ...filters,
//       page: pagination.current ?? 1,
//       limit: pagination.pageSize ?? 10,
//     });
//   };

// const onSearch = (values: any) => {
//   const {
//     name,
//     minPrice,
//     maxPrice,
//     hasDiscount,
//     sortBy,
//     sortOrder,
//     includeDeleted,
//     onlyOutOfStock,
//     withCouponApplied,
//   } = values;

//   const payload = {
//     page: 1,
//     limit: filters.limit,
//     search: name ?? '', // sempre dispara mesmo se vazio
//     ...(minPrice != null ? { minPrice } : {}),
//     ...(maxPrice != null ? { maxPrice } : {}),
//     ...(hasDiscount ? { hasDiscount: true } : {}),
//     ...(sortBy ? { sortBy } : {}),
//     ...(sortOrder ? { sortOrder } : {}),
//     ...(includeDeleted ? { includeDeleted: true } : {}),
//     ...(onlyOutOfStock ? { onlyOutOfStock: true } : {}),
//     ...(withCouponApplied ? { withCouponApplied: true } : {}),
//   };

//   // sempre força atualização (evita cache igual)
//   setFilters({ ...payload });
// };


//   return (
//     <div>
//       <OverlayLoader loading={loading} />

//       <Form
//         form={form}
//         layout="vertical"
//         className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"
//         onFinish={onSearch}
//       >
//         <Form.Item name="name" label="Nome">
//           <Input placeholder="Buscar por nome" />
//         </Form.Item>

//         <Form.Item name="minPrice" label="Preço mínimo">
//           <Slider min={0.01} max={1000000} step={0.01} tooltip={{ open: true }} />
//         </Form.Item>

//         <Form.Item name="maxPrice" label="Preço máximo">
//           <Slider min={0.01} max={1000000} step={0.01} tooltip={{ open: true }} />
//         </Form.Item>

//         <Form.Item name="hasDiscount" valuePropName="checked">
//           <Checkbox>Tem desconto</Checkbox>
//         </Form.Item>

//         <Form.Item name="sortBy" label="Ordenar por">
//           <Select allowClear>
//             <Option value="name">Nome</Option>
//             <Option value="price">Preço</Option>
//             <Option value="createdAt">Criado em</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item name="sortOrder" label="Ordem">
//           <Select allowClear>
//             <Option value="asc">Ascendente</Option>
//             <Option value="desc">Descendente</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item name="includeDeleted" valuePropName="checked">
//           <Checkbox>Incluir deletados</Checkbox>
//         </Form.Item>

//         <Form.Item name="onlyOutOfStock" valuePropName="checked">
//           <Checkbox>Somente sem estoque</Checkbox>
//         </Form.Item>

//         <Form.Item name="withCouponApplied" valuePropName="checked">
//           <Checkbox>Com cupom aplicado</Checkbox>
//         </Form.Item>

//         <Form.Item className="col-span-full text-right">
//           <Button type="primary" htmlType="submit">
//             Buscar
//           </Button>
//         </Form.Item>
//       </Form>

//       {loading && products.length === 0 ? (
//         <div className="space-y-4">
//           {Array.from({ length: 10 }).map((_, idx) => (
//             <div
//               key={idx}
//               className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"
//             />
//           ))}
//         </div>
//       ) : (
//         <Table
//           rowKey="id"
//           dataSource={products}
//           columns={getProductTableColumn({
//             searchText,
//             setSearchText,
//             searchedColumn,
//             setSearchedColumn,
//             showModal: (id: any) => console.log('Abrir modal para ID:', id),
//             searchInput,
//           })}
//           pagination={pagination}
//           loading={loading}
//           onChange={handlePageChange} // só paginação
//           scroll={{ x: 400 }}
//         />
//       )}
//     </div>
//   );
// }
