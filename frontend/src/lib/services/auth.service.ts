export const authService = {
  async login(email: string, password: string) {
    if (email === "admin@cloudkitchen.local" && password === "admin123") return { role: "admin", name: "Kitchen Admin" };
    if (email === "customer@example.com" && password === "customer123") return { role: "customer", name: "Akanksha Hajare" };
    throw new Error("Invalid email or password");
  },
  async logout() { return true; }
};
