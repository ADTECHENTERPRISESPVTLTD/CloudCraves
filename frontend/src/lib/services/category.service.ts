import { apiFetch } from "@/lib/api/client";
import { mockCategories } from "@/data/mockMenus";
import type {
  Category,
  CategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category";

function normalizeCategory(category: Category): Category {
  return {
    _id: String(category._id),
    name: category.name ?? "",
    description: category.description ?? "",
    image: category.image ?? "",
    isActive: category.isActive ?? true,
    sortOrder: Number(category.sortOrder ?? 0),
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

let fallbackCategories: Category[] = mockCategories.map((c) => ({
  _id: c.id,
  name: c.name,
  description: "",
  image: "",
  isActive: true,
  sortOrder: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const categoryService = {
  async list(): Promise<Category[]> {
    try {
      const result = await apiFetch<Category[]>("/admin/categories");
      const list = (result || []).map(normalizeCategory);
      fallbackCategories = list;
      return list;
    } catch (err) {
      console.warn("Using offline fallback categories list:", err);
      return fallbackCategories;
    }
  },

  async publicList(): Promise<Category[]> {
    try {
      const result = await apiFetch<Category[]>("/restaurant/categories");
      return (result || []).map(normalizeCategory);
    } catch (err) {
      console.warn("Using offline fallback public categories list:", err);
      return fallbackCategories.filter((c) => c.isActive);
    }
  },

  async create(payload: CategoryPayload): Promise<Category> {
    try {
      const result = await apiFetch<Category>("/admin/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const created = normalizeCategory(result);
      fallbackCategories = [...fallbackCategories, created];
      return created;
    } catch (err) {
      console.warn("Creating offline fallback category:", err);
      const newCat: Category = {
        _id: "cat_" + Date.now(),
        name: payload.name,
        description: payload.description || "",
        image: payload.image || "",
        isActive: payload.isActive !== undefined ? payload.isActive : true,
        sortOrder: payload.sortOrder || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      fallbackCategories = [...fallbackCategories, newCat];
      return newCat;
    }
  },

  async update(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    try {
      const result = await apiFetch<Category>(`/admin/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const updated = normalizeCategory(result);
      fallbackCategories = fallbackCategories.map((c) =>
        c._id === id ? updated : c
      );
      return updated;
    } catch (err) {
      console.warn("Updating offline fallback category:", err);
      fallbackCategories = fallbackCategories.map((c) =>
        c._id === id
          ? {
              ...c,
              name: payload.name !== undefined ? payload.name : c.name,
              description: payload.description !== undefined ? payload.description : c.description,
              image: payload.image !== undefined ? payload.image : c.image,
              isActive: payload.isActive !== undefined ? payload.isActive : c.isActive,
              sortOrder: payload.sortOrder !== undefined ? payload.sortOrder : c.sortOrder,
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      const match = fallbackCategories.find((c) => c._id === id);
      if (match) return match;
      throw err;
    }
  },

  async remove(id: string): Promise<Category> {
    try {
      const result = await apiFetch<Category>(`/admin/categories/${id}`, {
        method: "DELETE",
      });
      const deleted = normalizeCategory(result);
      fallbackCategories = fallbackCategories.filter((c) => c._id !== id);
      return deleted;
    } catch (err) {
      console.warn("Deleting offline fallback category:", err);
      const match = fallbackCategories.find((c) => c._id === id);
      fallbackCategories = fallbackCategories.filter((c) => c._id !== id);
      if (match) return match;
      throw err;
    }
  },
};