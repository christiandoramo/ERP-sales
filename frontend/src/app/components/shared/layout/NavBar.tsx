'use client';

import { Avatar, Dropdown, Menu, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export function Navbar() {

  const menu = <Menu>
      items
    </Menu>
  const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <Menu.Item key="1">Perfil</Menu.Item>
    ),
  },
  {
    key: '2',
    label: (
       <Menu.Item key="2">Sair</Menu.Item>
    )
  },
];


  return (
    <header className="fixed top-0 left-[200px] right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 z-40">
      <Dropdown menu={{items}} trigger={['hover']}>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar src="https://via.placeholder.com/32" />
          <span className="font-medium text-black">Arthur Morgan</span>
          <DownOutlined />
        </div>
      </Dropdown>
    </header>
  );
}
