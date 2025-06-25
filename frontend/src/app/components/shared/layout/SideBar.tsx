// src/app/components/shared/layout/Sidebar.tsx
"use client";

import { Menu } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSectionStore } from "@/lib/store/section-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoA from "@/assets/a.png";
import logoGrupo from "@/assets/grupo.png";

export function Sidebar() {
  const { current, setSection } = useSectionStore();
  const router = useRouter();

  const items = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "products", icon: <ShoppingOutlined />, label: "Produtos" },
    { key: "reports", icon: <BarChartOutlined />, label: "Relatórios" },
    { key: "admin", icon: <SettingOutlined />, label: "Administração" },
  ];

  return (
    <aside className="fixed top-0 left-0 w-[200px] h-screen bg-white border-r border-gray-200 shadow z-50 flex flex-col justify-between">
      <div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setSection("products")}
          className="flex items-center gap-2 px-4 py-6"
        >
          <Image
            src={logoGrupo}
            alt="LogoGrupoName"
            style={{ marginTop: 10 }}
            width={96}
            height={32}
          />
          <Image src={logoA} alt="LogoGrupoImage" width={32} height={32} />
        </div>

        <Menu
          mode="vertical"
          selectedKeys={[current]}
          onClick={({ key }) => setSection(key as any)}
          items={items}
          className="border-none"
        />
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-red-500 hover:text-red-600"
        >
          <LogoutOutlined />
          Sair
        </button>
      </div>
    </aside>
  );
}
