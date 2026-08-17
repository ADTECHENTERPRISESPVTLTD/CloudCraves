"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import AdminShell from "@/components/admin/AdminShell";
import { categoryService } from "@/lib/services/category.service";
import { adminFoodService } from "@/lib/services/admin-food.service";
import type { Category } from "@/types/category";

type FoodItem = {
  _id: string;
  name: string;
  description: string;
  image: string;
  categoryId:
    | string
    | {
        _id?: string;
        id?: string;
        name?: string;
      };
  price: number;
  ingredients?: string[];
  preparationTime?: string;
  spiceLevel?: string;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  isSpecial: boolean;
};

type FoodForm = {
  name: string;
  description: string;
  image: string;
  categoryId: string;
  price: string;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  isSpecial: boolean;
};

const emptyForm: FoodForm = {
  name: "",
  description: "",
  image: "",
  categoryId: "",
  price: "",
  isVeg: true,
  isAvailable: true,
  isPopular: false,
  isSpecial: false,
};

function getCategoryId(
  categoryId: FoodItem["categoryId"]
): string {
  if (typeof categoryId === "string") {
    return categoryId;
  }

  return categoryId?._id || categoryId?.id || "";
}

export default function AdminMenu() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<
    Array<Category & { id: string }>
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingFood, setEditingFood] =
    useState<FoodItem | null>(null);

  const [form, setForm] =
    useState<FoodForm>(emptyForm);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [foodsData, categoriesData] =
        await Promise.all([
          adminFoodService.list(),
          categoryService.listAdmin(),
        ]);

      setFoods(foodsData as FoodItem[]);

      const normalizedCategories = categoriesData.map(
        (category: Category) => ({
          ...category,
          id: category._id || "",
        })
      );

      setCategories(normalizedCategories);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load menu data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const categoryMap = useMemo(() => {
    return new Map(
      categories.map((category) => [
        category.id,
        category.name,
      ])
    );
  }, [categories]);

  function updateForm<K extends keyof FoodForm>(
    key: K,
    value: FoodForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function openCreateForm() {
    setEditingFood(null);

    setForm({
      ...emptyForm,
      categoryId:
        categories.length > 0
          ? categories[0].id
          : "",
    });

    setError("");
    setShowForm(true);
  }

  function openEditForm(food: FoodItem) {
    setEditingFood(food);

    setForm({
      name: food.name || "",
      description: food.description || "",
      image: food.image || "",
      categoryId: getCategoryId(food.categoryId),
      price: String(food.price || ""),
      isVeg: food.isVeg,
      isAvailable: food.isAvailable,
      isPopular: food.isPopular,
      isSpecial: food.isSpecial,
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingFood(null);
    setForm(emptyForm);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.categoryId ||
      !form.price
    ) {
      setError(
        "Name, category and price are required."
      );
      return;
    }

    const price = Number(form.price);

    if (Number.isNaN(price) || price < 0) {
      setError("Please enter a valid price.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        categoryId: form.categoryId,
        price,
        isVeg: form.isVeg,
        isAvailable: form.isAvailable,
        isPopular: form.isPopular,
        isSpecial: form.isSpecial,
      };

      if (editingFood) {
        await adminFoodService.update(
          editingFood._id,
          payload
        );
      } else {
        await adminFoodService.create(payload);
      }

      closeForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save food item."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(
    food: FoodItem
  ) {
    try {
      setError("");

      await adminFoodService.update(food._id, {
        isAvailable: !food.isAvailable,
      });

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update availability."
      );
    }
  }

  async function handleDelete(food: FoodItem) {
    const confirmed = window.confirm(
      `Delete "${food.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await adminFoodService.remove(food._id);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete food item."
      );
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-black text-[#6b4f3a]">
            Menu management
          </h1>

          <p className="mt-1 text-sm text-[#6d625a]">
            Manage food items, prices, categories and
            availability.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="btn-primary"
        >
          + Add item
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-xl bg-[#f8e6e1] p-4 text-sm font-semibold text-[#b33b21]">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="card-kitchen mt-6 p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black">
              {editingFood
                ? "Edit food item"
                : "Add food item"}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              className="text-sm font-bold text-[#6d625a]"
            >
              Cancel
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input
              className="input-kitchen"
              placeholder="Food name"
              value={form.name}
              onChange={(event) =>
                updateForm(
                  "name",
                  event.target.value
                )
              }
            />

            <input
              className="input-kitchen"
              type="number"
              min="0"
              placeholder="Price"
              value={form.price}
              onChange={(event) =>
                updateForm(
                  "price",
                  event.target.value
                )
              }
            />

            <select
              className="input-kitchen"
              value={form.categoryId}
              onChange={(event) =>
                updateForm(
                  "categoryId",
                  event.target.value
                )
              }
            >
              <option value="">
                Select category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            <input
              className="input-kitchen"
              placeholder="Image URL"
              value={form.image}
              onChange={(event) =>
                updateForm(
                  "image",
                  event.target.value
                )
              }
            />

            <textarea
              className="input-kitchen min-h-28 sm:col-span-2"
              placeholder="Description"
              value={form.description}
              onChange={(event) =>
                updateForm(
                  "description",
                  event.target.value
                )
              }
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.isVeg}
                onChange={(event) =>
                  updateForm(
                    "isVeg",
                    event.target.checked
                  )
                }
              />
              Vegetarian
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(event) =>
                  updateForm(
                    "isAvailable",
                    event.target.checked
                  )
                }
              />
              Available
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(event) =>
                  updateForm(
                    "isPopular",
                    event.target.checked
                  )
                }
              />
              Popular
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.isSpecial}
                onChange={(event) =>
                  updateForm(
                    "isSpecial",
                    event.target.checked
                  )
                }
              />
              Special
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary mt-6 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editingFood
                ? "Update item"
                : "Save item"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl bg-[#eee8df]"
            />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="card-kitchen mt-6 p-10 text-center">
          <h2 className="text-xl font-black">
            No food items found
          </h2>

          <p className="mt-2 text-sm text-[#6d625a]">
            Add your first menu item to get started.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {foods.map((food) => {
            const categoryId =
              getCategoryId(food.categoryId);

            const categoryName =
              categoryMap.get(categoryId) ||
              (typeof food.categoryId === "object"
                ? food.categoryId.name
                : "") ||
              "Uncategorized";

            return (
              <div
                key={food._id}
                className="card-kitchen flex gap-4 p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#eee8df]">
                  {food.image ? (
                    <Image
                      src={food.image}
                      alt={food.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#8a7d72]">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold">
                        {food.name}
                      </h3>

                      <p className="mt-1 text-xs font-bold text-[#e4572e]">
                        {categoryName}
                      </p>
                    </div>

                    <b className="whitespace-nowrap">
                      ₹{food.price}
                    </b>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-[#6d625a]">
                    {food.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        toggleAvailability(food)
                      }
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        food.isAvailable
                          ? "badge-open"
                          : "badge-closed"
                      }`}
                    >
                      {food.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </button>

                    {food.isVeg && (
                      <span className="rounded-full bg-[#e8f3e3] px-3 py-1 text-xs font-bold text-[#5c8d47]">
                        Veg
                      </span>
                    )}

                    {food.isPopular && (
                      <span className="rounded-full bg-[#fff1e8] px-3 py-1 text-xs font-bold text-[#e4572e]">
                        Popular
                      </span>
                    )}

                    {food.isSpecial && (
                      <span className="rounded-full bg-[#f4ecff] px-3 py-1 text-xs font-bold text-[#7c4d9f]">
                        Special
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(food)
                      }
                      className="text-sm font-bold text-[#e4572e]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(food)
                      }
                      className="text-sm font-bold text-[#b33b21]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}