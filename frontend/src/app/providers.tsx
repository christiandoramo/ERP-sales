"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConfigProvider from "antd/es/config-provider";
import { ReactNode, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 2, // 2 minutos sem refetch
          },
        },
      })
  );

  return (
    <ConfigProvider getPopupContainer={() => document.body}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConfigProvider>
  );
}
