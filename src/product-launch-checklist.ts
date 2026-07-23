import type { ProductLaunchReadinessQuery } from "@/generated/graphql";

export type ProductLaunchChecklistItem = {
  label: string;
  completed: boolean;
};

type ProductLaunchProduct = NonNullable<ProductLaunchReadinessQuery["product"]>;

const editorContentKeys = [
  "text",
  "caption",
  "items",
  "code",
  "html",
  "content",
  "title",
  "message",
  "file",
  "url",
  "embed",
  "source",
] as const;

const hasMeaningfulContent = (value: unknown): boolean => {
  if (typeof value === "string") {
    return (
      value
        .replace(/[<>]/g, "")
        .replace(/&nbsp;/g, " ")
        .trim().length > 0
    );
  }

  if (Array.isArray(value)) {
    return value.some(hasMeaningfulContent);
  }

  if (value && typeof value === "object") {
    return Object.values(value).some(hasMeaningfulContent);
  }

  return false;
};

const hasEditorBlockContent = (block: unknown): boolean => {
  if (!block || typeof block !== "object" || !("data" in block)) {
    return false;
  }

  const data = (block as { data?: unknown }).data;

  if (!data || typeof data !== "object") {
    return false;
  }

  const content = data as Record<string, unknown>;

  return editorContentKeys.some((key) => hasMeaningfulContent(content[key]));
};

const hasProductDescription = (description: string | null | undefined): boolean => {
  if (!description?.trim()) {
    return false;
  }

  try {
    const parsed: unknown = JSON.parse(description);

    if (parsed && typeof parsed === "object" && "blocks" in parsed) {
      const blocks = (parsed as { blocks?: unknown }).blocks;

      return Array.isArray(blocks) && blocks.some((block) => hasEditorBlockContent(block));
    }

    return hasMeaningfulContent(parsed);
  } catch {
    return hasMeaningfulContent(description);
  }
};

export const createProductLaunchChecklist = (
  product: ProductLaunchProduct
): ProductLaunchChecklistItem[] => {
  const channelListings = product.channelListings ?? [];
  const isShippingRequired = product.productType.isShippingRequired;

  return [
    { label: "Product description", completed: hasProductDescription(product.description) },
    { label: "Product media", completed: Boolean(product.media?.length) },
    {
      label: "Channel pricing",
      completed:
        channelListings.length > 0 &&
        channelListings.every((listing) => Boolean(listing.discountedPrice)),
    },
    {
      label: isShippingRequired ? "Shipping weight" : "Shipping weight not required",
      completed: !isShippingRequired || Boolean(product.weight && product.weight.value > 0),
    },
  ];
};

export const getCompletedProductLaunchItemCount = (items: ProductLaunchChecklistItem[]) =>
  items.filter((item) => item.completed).length;
