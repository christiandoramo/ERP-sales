// src/app/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/theme-store';
import { Button } from 'antd';

export default function LoginPage() {
  const router = useRouter();
  //const { toggleTheme } = useThemeStore();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex flex-col items-center space-y-4">
        <Button type="primary" onClick={() => router.push('/home')}>
          Login
        </Button>
        {/* <Button onClick={toggleTheme}>Alternar Tema</Button> */}
      </div>
    </div>
  );
}



