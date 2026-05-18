export const estimateReadingTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));

export const IMAGE_UPLOAD_MAX_BYTES = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export const validateImageFile = (file: File, label = "Imagem") => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return `${label} deve ser PNG, JPG ou WebP.`;
  }

  if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
    return `${label} deve ter no maximo 2MB.`;
  }

  return null;
};

export const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message ?? "Erro inesperado.";
  }

  return "Erro inesperado.";
};
