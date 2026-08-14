import type { User } from "@/types/user";
const user: User = {
  id: "u1", name: "Akanksha Hajare", email: "customer@example.com", phone: "+91 90000 55555",
  addresses: [{ id: "a1", label: "Home", address: "Hinjewadi Phase 1, Pune", landmark: "Near the main bus stop", phone: "+91 90000 55555" }]
};
export const profileService = {
  async get() { return user; },
  async update(data: Partial<User>) { Object.assign(user, data); return user; }
};
