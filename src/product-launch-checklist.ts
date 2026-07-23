export type ProductLaunchChecklistItem = {
  label: string;
  completed: boolean;
};

export const productLaunchChecklist: ProductLaunchChecklistItem[] = [
  { label: "Product details", completed: true },
  { label: "Product media", completed: true },
  { label: "Channel pricing", completed: true },
  { label: "Shipping weight", completed: false },
];

export const getCompletedProductLaunchItemCount = (items: ProductLaunchChecklistItem[]) =>
  items.filter((item) => item.completed).length;
