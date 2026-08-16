export type Address = { id: string; label: string; address: string; landmark?: string; phone: string; };
export type User = { id: string; name: string; email: string; phone: string; addresses: Address[]; };
