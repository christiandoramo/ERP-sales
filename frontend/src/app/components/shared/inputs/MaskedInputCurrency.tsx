// components/inputs/MaskedCurrencyInput.tsx
'use client';

import { Input } from 'antd';
import { useRef } from 'react';

interface MaskedCurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  className?: string;
  currency?: 'brl' | 'usd';
}

export function MaskedCurrencyInput({
  value,
  onChange,
  onBlur,
  className,
  currency = 'brl',
}: MaskedCurrencyInputProps) {
  const isFirstInput = useRef(true);

  const formatCurrency = (val: number) => {
    const formatter = new Intl.NumberFormat(
      currency === 'brl' ? 'pt-BR' : 'en-US',
      {
        style: 'currency',
        currency: currency === 'brl' ? 'BRL' : 'USD',
        minimumFractionDigits: 2,
      }
    );
    return formatter.format(Math.max(val || 0.01, 0.01));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const key = e.key;
    let digits = String(Math.round((value || 0.01) * 100));

    if (/^[0-9]$/.test(key)) {
      if (isFirstInput.current) {
        if (key === '0') return;
        onChange(parseInt(key, 10) / 100);
        isFirstInput.current = false;
        return;
      }
      if (digits.length >= 9) return;
      digits += key;
      const newValue = parseInt(digits, 10) / 100;
      onChange(Math.min(newValue, 1000000));
    }

    if (key === 'Backspace') {
      digits = digits.slice(0, -1);
      if (!digits) {
        onChange(0.01);
        isFirstInput.current = true;
      } else {
        const newValue = parseInt(digits, 10) / 100;
        onChange(Math.max(newValue, 0.01));
      }
    }
  };

  return (
    <Input
      value={formatCurrency(value)}
      onChange={() => {}}
      onKeyDown={handleKeyDown}
      onBlur={onBlur}
      className={className}
    />
  );
}
