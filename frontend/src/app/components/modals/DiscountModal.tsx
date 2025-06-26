"use client";

import { Modal, Tabs, Input, Button } from "antd";
import { useProductStore } from "@/lib/store/product-store";
import {
  useApplyCoupon,
  useApplyPercent,
} from "@/lib/hooks/use-apply-discount";
import { useCoupons } from "@/lib/hooks/use-index-coupons";
import { OverlayLoader } from "../shared/layout/OverlayLoader";
import { useRequestModals } from "@/lib/hooks/use-request-modals";
import { useState } from "react";

export const DiscountModal = () => {
  const { modalProductId, setModalProductId } = useProductStore();
  const [couponInput, setCouponInput] = useState("");
  const [percentInput, setPercentInput] = useState("");
  const requestModal = useRequestModals();

  const { data: coupons, isLoading: isCouponsLoading } = useCoupons();
  const couponMutation = useApplyCoupon(modalProductId!);
  const percentMutation = useApplyPercent(modalProductId!);

  const isLoading =
    couponMutation.isPending || percentMutation.isPending || isCouponsLoading;

  const handleClose = () => {
    setModalProductId(null);
    setCouponInput("");
    setPercentInput("");
  };

  const applyCoupon = async () => {
    try {
      await couponMutation.mutateAsync(couponInput);
      requestModal.showSuccess("Cupom aplicado com sucesso!");
      handleClose();
    } catch (err) {
      requestModal.showError(err);
    }
  };

  const applyPercent = async () => {
    const percent = parseFloat(percentInput);
    if (isNaN(percent) || percent < 1 || percent > 80) {
      return requestModal.showError("Informe um número entre 1 e 80");
    }

    try {
      await percentMutation.mutateAsync(percent);
      requestModal.showSuccess("Desconto aplicado com sucesso!");
      handleClose();
    } catch (err) {
      requestModal.showError(err);
    }
  };

  return (
    <Modal
      open={!!modalProductId}
      onCancel={handleClose}
      footer={null}
      title="Aplicar Desconto"
    >
      <OverlayLoader loading={isLoading} />

      <Tabs
        defaultActiveKey="coupon"
        items={[
          {
            key: "coupon",
            label: "Aplicar Cupom",
            children: (
              <div className="flex flex-col gap-4">
                <p>Escreva o código do cupom de desconto (maior do que 0)</p>
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto">
                  {coupons?.data.map((c) => (
                    <Button
                      key={c.id}
                      onClick={() => setCouponInput(c.code)}
                      className="border rounded px-2"
                    >
                      {c.code}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={handleClose}>Cancelar</Button>
                  <Button type="primary" onClick={applyCoupon}>
                    Confirmar
                  </Button>
                </div>
              </div>
            ),
          },
          {
            key: "percent",
            label: "Aplicar Percentual Direto",
            children: (
              <div className="flex flex-col gap-4">
                <p>Escreva o valor do percentual direto de desconto (1-80)</p>
                <Input
                  value={percentInput}
                  onChange={(e) => setPercentInput(e.target.value)}
                  type="number"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={handleClose}>Cancelar</Button>
                  <Button type="primary" onClick={applyPercent}>
                    Confirmar
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};
