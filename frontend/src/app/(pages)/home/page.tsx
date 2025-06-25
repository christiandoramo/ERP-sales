// src/app/(pages)/home/page.tsx

"use client";

import { ProductsSection } from "@/app/sections/ProductsSection";
import { CreateProductSection } from "@/app/sections/CreateProductSection";
import { Sidebar } from "@/app/components/shared/layout/SideBar";
import { Navbar } from "@/app/components/shared/layout/NavBar";
import { useSectionStore } from "@/lib/store/section-store";

export default function HomePage() {
  const { current } = useSectionStore();

  return (
    <div className="bg-gray-50 min-h-screen text-black">
      <Sidebar />
      <Navbar />
      <main className="ml-[200px] pt-16 p-6">
        {current === "products" && <ProductsSection />}
        {current === "create-product" && <CreateProductSection />}
      </main>
    </div>
  );
}
