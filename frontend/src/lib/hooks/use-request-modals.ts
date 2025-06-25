// lib/hooks/use-request-modals.ts
import { Modal } from "antd";
import { useSectionStore } from "@/lib/store/section-store";

export function useRequestModals() {
  const [modal, contextHolder] = Modal.useModal();
  const { setSection } = useSectionStore();

  const showSuccess = (message: string) => {
    modal.success({
      title: "Sucesso",
      content: message,
      okText: "OK",
      onOk: () => setSection("products"),
    });
  };

  const showError = (err: unknown, fallback = "Erro inesperado") => {
    const message =
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as any).response?.data?.message === "string"
        ? (err as any).response.data.message
        : fallback;

    modal.error({
      title: "Erro",
      content: message,
      okText: "Fechar",
    });
  };

  return { showSuccess, showError, contextHolder };
}
