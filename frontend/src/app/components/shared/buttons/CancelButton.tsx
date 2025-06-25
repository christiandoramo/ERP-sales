"use client";

import { useSectionStore } from "@/lib/store/section-store";
import Button from "antd/es/button";

export function CancelButton({  }: { loading: boolean }) {
  const { setSection } = useSectionStore();
  return (
    <Button
      className="bg-black text-white dark:bg-white dark:text-black border-none hover:opacity-90 transition-all mb-4"
      onClick={() => setSection("products")}
    >
      Cancelar
    </Button>
  );
}
