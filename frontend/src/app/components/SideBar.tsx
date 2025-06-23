// src/app/components/side-bar.tsx
'use client';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

export default function Sidebar() {
  return (
    <Menu mode="vertical" defaultSelectedKeys={['products']}>
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        Dashboard
      </Menu.Item>
      <Menu.Item key="products" icon={<ShoppingOutlined />}>
        Produtos
      </Menu.Item>
      <Menu.Item key="reports" icon={<BarChartOutlined />}>
        Relatórios
      </Menu.Item>
      <Menu.Item key="admin" icon={<SettingOutlined />}>
        Administração
      </Menu.Item>
    </Menu>
  );
}
