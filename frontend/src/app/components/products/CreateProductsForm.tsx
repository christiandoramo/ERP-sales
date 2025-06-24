// src/app/components/products/CreateProductForm.tsx
'use client';

import { Button, Form, Input, InputNumber } from 'antd';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createProductSchema } from '@/lib/schemas/create-product';
import { z } from 'zod';
import { useProductStore } from '@/lib/store/product-store';

type FormData = z.infer<typeof createProductSchema>;

export function CreateProductForm() {
  const { setSection } = useProductStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createProductSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log('Criar produto:', data);
    // await api.post('/products', data); // substitua pela real
    reset(); // limpa os campos após envio
    setSection('table'); // volta à tabela
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-black dark:text-white mb-4">Criar Produto</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-black dark:text-white">Nome</label>
          <Input {...register('name')} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-black dark:text-white">Estoque</label>
          <InputNumber {...register('stock')} min={0} max={999999} className="w-full" />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
        </div>

        <div>
          <label className="text-black dark:text-white">Preço</label>
          <Input {...register('price')} />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-black dark:text-white">Descrição</label>
          <Input.TextArea {...register('description')} rows={4} />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="md:col-span-2 flex justify-between mt-4">
          <Button
            type="default"
            onClick={() => setSection('table')}
            className="bg-gray-100 dark:bg-zinc-700 text-black dark:text-white"
          >
            Voltar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="bg-black dark:bg-white text-white dark:text-black"
          >
            Criar
          </Button>
        </div>
      </form>
    </div>
  );
}
