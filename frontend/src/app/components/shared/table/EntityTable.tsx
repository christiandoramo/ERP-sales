// src/app/components/table/EntityTable.tsx
'use client';

import {
  Table,
  Button,
  Input,
  Space,
  TablePaginationConfig,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useRef, useState } from 'react';
import type {
  ColumnsType,
  SorterResult,
} from 'antd/es/table/interface';
import { TableProps } from 'antd/es/table';


type Entity = Record<string, any>;

interface EntityTableProps<T extends Entity> {
  title: string;
  data: T[];
  columns: ColumnsType<T>;
  loading: boolean;
  total: number;
  pagination: TablePaginationConfig;
  onChange: TableProps<T>['onChange'];
  onClearFilters: () => void;
}

export function EntityTable<T extends Entity>({
  title,
  data,
  columns,
  loading,
  total,
  pagination,
  onChange,
  onClearFilters,
}: EntityTableProps<T>) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-2xl">{title}</span>
        <div>
          <span className="text-lg mr-4">Total: {total}</span>
          <Button onClick={onClearFilters}>Limpar filtros</Button>
        </div>
      </div>
      <Table
        rowKey={(record) => record.id}
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onChange={onChange}
        scroll={{ x: 800 }}
      />
    </div>
  );
}
