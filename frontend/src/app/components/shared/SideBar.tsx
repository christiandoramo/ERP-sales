// src/app/components/shared/Sidebar.tsx
'use client';

import { Menu } from 'antd';
import { useSectionStore } from '@/lib/store/section-store';
import {
  DashboardOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

export function Sidebar() {
  const { current, setSection } = useSectionStore();

  const items = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'products', icon: <ShoppingOutlined />, label: 'Produtos' },
    { key: 'reports', icon: <BarChartOutlined />, label: 'Relatórios' },
    { key: 'admin', icon: <SettingOutlined />, label: 'Administração' },
  ];

  return (
    <Menu
      mode="vertical"
      selectedKeys={[current]}
      onClick={({ key }) => setSection(key as any)}
      items={items}
    />
  );
}
