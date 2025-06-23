// src/app/components/product/ProductTable.tsx
'use client';

import { Table, Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useProductQuery } from '@/lib/hooks/use-products-query';
import { useProductStore } from '@/lib/store/product-store';
import { useLoading } from '@/lib/hooks/use-loading';
import ProductTableColumns from './ProductTableColumns';
import ProductTableHeader from './ProductTableHeader';
import { OverlayLoader } from '../../components/OverlayLoader';


export default function ProductTable() {
  const { filters, setFilters, products, meta } = useProductStore();
  const { isFetching } = useProductQuery();
  const { loading, setLoading } = useLoading();

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [tableTotal, setTableTotal] = useState(0);

  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching]);

  useEffect(() => {
    if (meta?.totalItems) setTableTotal(meta.totalItems);
  }, [meta]);

  const handleChange = (pagination, _filters, sorter) => {
    if (!('order' in sorter)) return;

    setFilters({
      page: pagination.current ?? 1,
      limit: pagination.pageSize ?? 10,
      sortBy: sorter.field as any,
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
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
      sortBy: 'name',
      sortOrder: 'asc',
      includeDeleted: undefined,
      onlyOutOfStock: undefined,
      withCouponApplied: undefined,
    });
  };

  const pagination = useMemo(() => ({
    current: filters.page,
    pageSize: filters.limit,
    total: meta?.totalItems ?? 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '40', '50'],
  }), [filters.page, filters.limit, meta?.totalItems]);

  return (
    <div>
      <OverlayLoader loading={loading} />
      <ProductTableHeader total={tableTotal} onClear={handleClearFilters} />
      <Table
        rowKey="id"
        dataSource={products}
        columns={ProductTableColumns({ searchText, setSearchText, searchedColumn, setSearchedColumn })}
        pagination={pagination}
        loading={loading}
        onChange={handleChange}
        scroll={{ x: 400 }}
      />
    </div>
  );
}