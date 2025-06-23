// src/app/components/overlay-overlay-loader.tsx
'use client';
import { Spin } from 'antd';

export function OverlayLoader({ loading }: { loading: boolean }) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <Spin size="large" />
    </div>
  );
}
