"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import { categoryService } from "@/lib/services/category.service";

import type {
  Category,
  CategoryPayload,
} from "@/types/category";

type FormState = {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: string;
};

const initialForm: FormState = {
  name: "",
  description: "",
  image: "",
  isActive: true,
  sortOrder: "0",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function sortCategories(
  categories: Category[]
): Category[] {
  return [...categories].sort(
    (a, b) =>
      a.sortOrder - b.sortOrder ||
      a.name.localeCompare(b.name)
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [updatingStatusId, setUpdatingStatusId] =
    useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const result =
        await categoryService.list();

      setCategories(sortCategories(result));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  function openCreateForm() {
    setEditingCategory(null);
    setForm(initialForm);
    setFormError("");
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setEditingCategory(category);

    setForm({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      isActive: category.isActive,
      sortOrder: String(category.sortOrder ?? 0),
    });

    setFormError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingCategory(null);
    setForm(initialForm);
    setFormError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      setFormError("Category name is required.");
      return;
    }

    const sortOrder = Number(form.sortOrder);

    if (
      !Number.isFinite(sortOrder) ||
      sortOrder < 0 ||
      !Number.isInteger(sortOrder)
    ) {
      setFormError(
        "Sort order must be a whole number greater than or equal to 0."
      );
      return;
    }

    const payload: CategoryPayload = {
      name,
      description: form.description.trim(),
      image: form.image.trim(),
      isActive: form.isActive,
      sortOrder,
    };

    try {
      setSaving(true);
      setFormError("");

      if (editingCategory) {
        const updated =
          await categoryService.update(
            editingCategory._id,
            payload
          );

        setCategories((current) =>
          sortCategories(
            current.map((category) =>
              category._id === updated._id
                ? updated
                : category
            )
          )
        );
      } else {
        const created =
          await categoryService.create(payload);

        setCategories((current) =>
          sortCategories([
            ...current,
            created,
          ])
        );
      }

      setShowForm(false);
      setEditingCategory(null);
      setForm(initialForm);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    category: Category
  ) {
    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category._id);
      setError("");

      await categoryService.remove(category._id);

      setCategories((current) =>
        current.filter(
          (item) => item._id !== category._id
        )
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId("");
    }
  }

  async function handleToggleActive(
    category: Category
  ) {
    try {
      setUpdatingStatusId(category._id);
      setError("");

      const updated =
        await categoryService.update(
          category._id,
          {
            isActive: !category.isActive,
          }
        );

      setCategories((current) =>
        current.map((item) =>
          item._id === updated._id
            ? updated
            : item
        )
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingStatusId("");
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#e4572e]">
            Menu organization
          </p>

          <h1 className="mt-1 text-3xl font-black text-[#6b4f3a] sm:text-4xl">
            Categories
          </h1>

          <p className="mt-2 text-sm text-[#6d625a]">
            Create and manage menu categories.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary inline-flex items-center justify-center gap-2"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add category
        </button>
      </div>

      {error && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#f1c9c0] bg-[#fdf1ee] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-[#b33b21]">
            {error}
          </p>

          <button
            type="button"
            className="btn-secondary inline-flex items-center gap-2 py-2"
            onClick={() => void loadCategories()}
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      )}

      <div className="card-kitchen mt-6 overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-[#f3f1ec]"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-xl font-black text-[#6b4f3a]">
              No categories yet
            </h2>

            <p className="mt-2 text-sm text-[#6d625a]">
              Create your first category to organize the menu.
            </p>

            <button
              type="button"
              className="btn-primary mt-5 inline-flex items-center gap-2"
              onClick={openCreateForm}
            >
              <Plus size={18} />
              Add category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#f3f1ec]">
                <tr>
                  <th className="p-4 font-black">
                    Category
                  </th>

                  <th className="p-4 font-black">
                    Description
                  </th>

                  <th className="p-4 font-black">
                    Sort order
                  </th>

                  <th className="p-4 font-black">
                    Status
                  </th>

                  <th className="p-4 font-black">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-t border-[#eee8df]"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3f1ec] font-black text-[#e4572e]">
                            {category.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-black text-[#6b4f3a]">
                            {category.name}
                          </p>

                          {category.image && (
                            <p className="mt-1 text-xs text-[#6d625a]">
                              Image configured
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="max-w-sm p-4 text-[#6d625a]">
                      {category.description || "—"}
                    </td>

                    <td className="p-4 font-semibold">
                      {category.sortOrder}
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        disabled={
                          updatingStatusId ===
                          category._id
                        }
                        className={`rounded-full px-3 py-1 text-xs font-black disabled:cursor-not-allowed disabled:opacity-60 ${
                          category.isActive
                            ? "bg-[#e9f5e9] text-[#357a38]"
                            : "bg-[#f3f1ec] text-[#6d625a]"
                        }`}
                        onClick={() =>
                          void handleToggleActive(
                            category
                          )
                        }
                      >
                        {updatingStatusId ===
                        category._id
                          ? "Updating..."
                          : category.isActive
                            ? "Active"
                            : "Inactive"}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${category.name}`}
                          className="btn-secondary p-2"
                          onClick={() =>
                            openEditForm(category)
                          }
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          aria-label={`Delete ${category.name}`}
                          className="btn-secondary p-2 text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={
                            deletingId ===
                            category._id
                          }
                          onClick={() =>
                            void handleDelete(category)
                          }
                        >
                          {deletingId === category._id
                            ? "..."
                            : (
                              <Trash2 size={17} />
                            )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card-kitchen max-h-[90vh] w-full max-w-xl overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#e4572e]">
                  Category
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#6b4f3a]">
                  {editingCategory
                    ? "Edit category"
                    : "Add category"}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close"
                className="rounded-lg p-2 text-[#6d625a] hover:bg-[#f3f1ec]"
                disabled={saving}
                onClick={closeForm}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mt-5 rounded-xl border border-[#f1c9c0] bg-[#fdf1ee] p-3 text-sm font-semibold text-[#b33b21]">
                {formError}
              </div>
            )}

            <form
              className="mt-6 space-y-5"
              onSubmit={(event) =>
                void handleSubmit(event)
              }
            >
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-2 block text-sm font-bold"
                >
                  Name *
                </label>

                <input
                  id="category-name"
                  className="input-kitchen w-full"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  disabled={saving}
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="mb-2 block text-sm font-bold"
                >
                  Description
                </label>

                <textarea
                  id="category-description"
                  className="input-kitchen min-h-24 w-full"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  disabled={saving}
                  maxLength={500}
                />
              </div>

              <div>
                <label
                  htmlFor="category-image"
                  className="mb-2 block text-sm font-bold"
                >
                  Image URL
                </label>

                <input
                  id="category-image"
                  type="url"
                  className="input-kitchen w-full"
                  value={form.image}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      image: event.target.value,
                    }))
                  }
                  disabled={saving}
                  placeholder="https://example.com/category.jpg"
                />
              </div>

              <div>
                <label
                  htmlFor="category-sort-order"
                  className="mb-2 block text-sm font-bold"
                >
                  Sort order
                </label>

                <input
                  id="category-sort-order"
                  type="number"
                  min="0"
                  step="1"
                  className="input-kitchen w-full"
                  value={form.sortOrder}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sortOrder: event.target.value,
                    }))
                  }
                  disabled={saving}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isActive:
                        event.target.checked,
                    }))
                  }
                  disabled={saving}
                />

                <span className="text-sm font-bold">
                  Category is active
                </span>
              </label>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={saving}
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Save changes"
                      : "Create category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}