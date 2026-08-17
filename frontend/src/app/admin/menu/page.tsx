"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminService } from "@/lib/services/admin.service";
import { categoryService } from "@/lib/services/category.service";
import type { Category } from "@/types/category";
import { Plus, Trash2, Edit3, X, RefreshCw } from "lucide-react";

type FoodItem = {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  isSpecial: boolean;
  categoryId: string | { _id: string; name: string };
};

export default function AdminMenu() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterCategory, setFilterCategory] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    categoryId: "",
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    isSpecial: false,
  });

  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [foodList, catList] = await Promise.all([
        adminService.foods(),
        categoryService.list(),
      ]);

      setFoods(foodList as FoodItem[]);
      setCategories(catList);

      if (catList.length > 0) {
        setForm((f) => ({ ...f, categoryId: catList[0]._id }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load menu data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function handleOpenCreate() {
    setEditingItem(null);
    setForm({
      name: "",
      price: "",
      description: "",
      image: "",
      categoryId: categories[0]?._id || "",
      isVeg: true,
      isAvailable: true,
      isPopular: false,
      isSpecial: false,
    });
    setFormError("");
    setShowModal(true);
  }

  function handleOpenEdit(item: FoodItem) {
    setEditingItem(item);
    const catId = typeof item.categoryId === "string" ? item.categoryId : item.categoryId?._id || "";
    setForm({
      name: item.name,
      price: String(item.price),
      description: item.description || "",
      image: item.image || "",
      categoryId: catId,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      isPopular: item.isPopular ?? false,
      isSpecial: item.isSpecial ?? false,
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleToggleAvailable(item: FoodItem) {
    try {
      const updated = await adminService.updateFood(item._id, {
        isAvailable: !item.isAvailable,
      });

      setFoods((current) =>
        current.map((x) => (x._id === item._id ? (updated as FoodItem) : x))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update availability.");
    }
  }

  async function handleDelete(item: FoodItem) {
    const confirmed = window.confirm(`Delete "${item.name}"?`);
    if (!confirmed) return;

    try {
      await adminService.deleteFood(item._id);
      setFoods((current) => current.filter((x) => x._id !== item._id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete item.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("Please enter a valid price greater than 0.");
      return;
    }

    if (!form.categoryId) {
      setFormError("Please select a category.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        price: priceNum,
        description: form.description.trim(),
        image: form.image.trim(),
        categoryId: form.categoryId,
        isVeg: form.isVeg,
        isAvailable: form.isAvailable,
        isPopular: form.isPopular,
        isSpecial: form.isSpecial,
      };

      if (editingItem) {
        const updated = await adminService.updateFood(editingItem._id, payload);
        setFoods((current) =>
          current.map((x) => (x._id === editingItem._id ? (updated as FoodItem) : x))
        );
      } else {
        const created = await adminService.createFood(payload);
        setFoods((current) => [...current, created as FoodItem]);
      }

      setShowModal(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unable to save item.");
    } finally {
      setSaving(false);
    }
  }

  const filteredFoods = foods.filter((food) => {
    if (filterCategory === "all") return true;
    const catId = typeof food.categoryId === "string" ? food.categoryId : food.categoryId?._id;
    return catId === filterCategory;
  });

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div>
          <h2 className="text-3xl font-black text-[#6b4f3a]">Menu management</h2>
          <p className="mt-1 text-sm text-[#6d625a]">
            Manage categories, foods, prices and availability.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} />
          Add food item
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-[#f1c9c0] bg-[#fdf1ee] p-4 flex justify-between items-center">
          <p className="text-sm font-semibold text-[#b33b21]">{error}</p>
          <button onClick={loadData} className="btn-secondary py-2 inline-flex items-center gap-2">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Categories chips filter */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory("all")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold border ${
            filterCategory === "all" ? "bg-[#e4572e] text-white" : "bg-white text-[#6b4f3a]"
          }`}
        >
          All Items
        </button>

        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setFilterCategory(c._id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold border ${
              filterCategory === c._id ? "bg-[#e4572e] text-white" : "bg-white text-[#6b4f3a]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-kitchen h-32 animate-pulse bg-[#f3f1ec]" />
          ))}
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="card-kitchen mt-6 p-10 text-center">
          <p className="text-sm text-[#6d625a]">No food items found in this category.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filteredFoods.map((i) => {
            const catName =
              typeof i.categoryId === "string"
                ? categories.find((c) => c._id === i.categoryId)?.name || "Category"
                : i.categoryId?.name || "Category";

            return (
              <div key={i._id} className="card-kitchen flex gap-4 p-4">
                {i.image ? (
                  <img src={i.image} alt={i.name} className="h-24 w-24 rounded-xl object-cover" />
                ) : (
                  <div className="h-24 w-24 rounded-xl bg-[#f3f1ec] flex items-center justify-center font-black text-[#e4572e]">
                    {i.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2 items-start">
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-base truncate text-[#6b4f3a]">{i.name}</h3>
                      <p className="text-xs font-bold text-[#e4572e]">{catName}</p>
                    </div>
                    <b className="text-base">₹{i.price}</b>
                  </div>

                  <p className="mt-1 text-xs text-[#6d625a] line-clamp-2">{i.description}</p>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => void handleToggleAvailable(i)}
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          i.isAvailable ? "bg-[#e9f5e9] text-[#357a38]" : "bg-[#fdf1ee] text-[#b33b21]"
                        }`}
                      >
                        {i.isAvailable ? "Available" : "Unavailable"}
                      </button>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          i.isVeg ? "bg-[#e9f5e9] text-[#357a38]" : "bg-[#f3f1ec] text-[#6d625a]"
                        }`}
                      >
                        {i.isVeg ? "Veg" : "Non-Veg"}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenEdit(i)}
                        className="btn-secondary p-2 py-1.5"
                        aria-label="Edit item"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => void handleDelete(i)}
                        className="btn-secondary p-2 py-1.5 text-red-600"
                        aria-label="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Food Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card-kitchen max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 bg-white shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-[#6b4f3a]">
                {editingItem ? "Edit food item" : "Add food item"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 hover:bg-[#f3f1ec] text-[#6d625a]"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl bg-[#f8e6e1] p-3 text-sm font-semibold text-[#b33b21]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">Item name *</label>
                <input
                  required
                  className="input-kitchen w-full"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="text-xs font-bold block mb-1">Price (₹) *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="input-kitchen w-full"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Category *</label>
                  <select
                    required
                    className="input-kitchen w-full"
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    disabled={saving}
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Description</label>
                <textarea
                  className="input-kitchen w-full min-h-20"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Image URL</label>
                <input
                  type="url"
                  className="input-kitchen w-full"
                  placeholder="https://example.com/food.jpg"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div className="grid gap-2 grid-cols-2 pt-2">
                <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVeg}
                    onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
                    disabled={saving}
                  />
                  Veg item
                </label>

                <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    disabled={saving}
                  />
                  Available
                </label>

                <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    disabled={saving}
                  />
                  Mark Popular
                </label>

                <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isSpecial}
                    onChange={(e) => setForm({ ...form, isSpecial: e.target.checked })}
                    disabled={saving}
                  />
                  Mark Special
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? "Saving..." : "Save item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
