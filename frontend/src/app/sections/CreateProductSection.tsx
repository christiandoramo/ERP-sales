"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Modal } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateProductDto,
  createProductSchema,
} from "@/lib/schemas/create-product";
import { createProduct } from "@/lib/api/products";
import { useSectionStore } from "@/lib/store/section-store";
import { useLoading } from "@/lib/hooks/use-loading";
import { useRequestModals } from "@/lib/hooks/use-request-modals";
import { OverlayLoader } from "../components/shared/layout/OverlayLoader";

export function CreateProductSection() {
  const { setSection } = useSectionStore();
  const { loading, setLoading } = useLoading();

  const [currency, setCurrency] = useState<"brl" | "usd">("brl");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateProductDto>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      price: 0.01,
    },
  });

  const { showSuccess, showError, contextHolder } = useRequestModals();

  const onSubmit = async (data: CreateProductDto) => {
    setLoading(true);
    const delay = new Promise((r) => setTimeout(r, 1500)); // tempo mínimo

    try {
      await Promise.all([createProduct(data), delay]);
      reset();
      setIsFirstInput(true);

      showSuccess("Produto criado com sucesso!");
    } catch (err) {
      showError(err, "Erro ao criar produto.");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentValue: number
  ) => {
    e.preventDefault();
    const key = e.key;

    // Estado atual em centavos
    let digits = String(Math.round((currentValue || 0.01) * 100));

    // Se é dígito numérico
    if (/^[0-9]$/.test(key)) {
      if (isFirstInput) {
        if (key === "0") return; // não substitui por 0
        // Substitui o "1" do 0.01 pelo primeiro número
        setValue("price", parseInt(key, 10) / 100);
        setIsFirstInput(false);
        return;
      }

      if (digits.length >= 9) return;
      digits += key;
      const newValue = parseInt(digits, 10) / 100;
      setValue("price", Math.min(newValue, 1000000));
    }

    // Backspace
    if (key === "Backspace") {
      digits = digits.slice(0, -1);
      if (!digits) {
        setValue("price", 0.01);
        setIsFirstInput(true);
      } else {
        const newValue = parseInt(digits, 10) / 100;
        setValue("price", Math.max(newValue, 0.01));
      }
    }
  };

  const [isFirstInput, setIsFirstInput] = useState(true);

  const formatCurrency = (
    value: number | undefined,
    currency: "brl" | "usd"
  ) => {
    const formatter = new Intl.NumberFormat(
      currency === "brl" ? "pt-BR" : "en-US",
      {
        style: "currency",
        currency: currency === "brl" ? "BRL" : "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

    return formatter.format(Math.max(value ?? 0.01, 0.01));
  };

  return (
    <>
      <OverlayLoader loading={loading} />
      {contextHolder}

      <div className="flex items-center mb-6 ml-4">
        <ShoppingOutlined className="text-xl mr-2 text-black" />
        <h2 className="text-xl font-bold text-black">Cadastro de Produto</h2>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-md">
        <div className="border border-blue-500 rounded-md p-6">
          <h3 className="font-semibold text-black mb-1">Dados do produto</h3>
          <p className="text-gray-600 text-sm mb-6">
            Preencha os campos para criar um novo produto.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Nome */}
            <div className="flex flex-col">
              <label className="text-black font-medium">
                Nome do produto <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nome do produto"
                    maxLength={100}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-black font-medium">Descrição</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    placeholder="Descrição detalhada"
                    rows={4}
                    value={field.value ?? ""}
                    maxLength={300}
                    className="resize-none"
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Preço */}
            <div className="flex flex-col">
              <label className="text-black font-medium">
                Preço <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 items-center">
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={formatCurrency(field.value, currency)}
                      onChange={() => {}}
                      onKeyDown={(e) => handlePriceKey(e, field.value ?? 0.01)}
                    />
                  )}
                />
                <Button
                  onClick={() =>
                    setCurrency((c) => (c === "brl" ? "usd" : "brl"))
                  }
                >
                  {currency === "brl" ? "🇧🇷" : "🇺🇸"}
                </Button>
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            {/* Estoque */}
            <div className="flex flex-col">
              <label className="text-black font-medium">
                Estoque <span className="text-red-500">*</span>
              </label>
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      field.onChange(Number(val));
                    }}
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock.message}</p>
              )}
            </div>

            {/* Botões */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
              <Button
                type="default"
                onClick={() => setSection("products")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={loading}
                className="bg-black text-white hover:opacity-80"
              >
                Cadastrar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
