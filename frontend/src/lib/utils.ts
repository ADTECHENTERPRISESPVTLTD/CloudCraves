export const money = (value: number) => `₹${value.toFixed(0)}`;
export const slugStatus = (value: string) => value.replaceAll("_", " ");
