"use client";

import { useEffect, useState } from "react";

import AdminShell from "@/components/admin/AdminShell";
import {
  adminService,
  type Category,
} from "@/lib/services/admin.service";

export default function CategoryManagement() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editing, setEditing] =
    useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [isActive, setIsActive] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function load() {
    try {
      setCategories(
        await adminService.categories()
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setName("");
    setDescription("");
    setIsActive(true);
    setShowForm(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setName(category.name);
    setDescription(
      category.description || ""
    );
    setIsActive(category.isActive);
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editing) {
        await adminService.updateCategory(
          editing._id,
          {
            name,
            description,
            isActive,
          }
        );
      } else {
        await adminService.createCategory({
          name,
          description,
          isActive,
        });
      }

      setShowForm(false);
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (
      !window.confirm(
        "Delete this category?"
      )
    ) {
      return;
    }

    try {
      await adminService.deleteCategory(id);
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete category."
      );
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div>
          <h2 className="text-3xl font-black text-[#6b4f3a]">
            Category Management
          </h2>

          <p className="mt-1 text-sm text-[#6d625a]">
            Add, edit, activate and delete
            menu categories.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={openCreate}
        >
          + Add Category
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-xl bg-[#f8e6e1] p-4 text-[#b33b21]">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={save}
          className="card-kitchen mt-5 p-5"
        >
          <h3 className="text-xl font-black">
            {editing
              ? "Edit Category"
              : "Add Category"}
          </h3>

          <div className="mt-4 grid gap-3">
            <input
              required
              className="input-kitchen"
              placeholder="Category name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <textarea
              className="input-kitchen min-h-24"
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(
                    e.target.checked
                  )
                }
              />

              Active
            </label>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              disabled={saving}
              className="btn-primary"
            >
              {saving
                ? "Saving..."
                : "Save Category"}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                setShowForm(false)
              }
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="mt-5 animate-pulse rounded-2xl bg-[#f3f1ec] p-10">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="card-kitchen mt-5 p-10 text-center">
          No categories found.
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category._id}
              className="card-kitchen p-5"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="font-black">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#6d625a]">
                    {category.description ||
                      "No description"}
                  </p>
                </div>

                <span
                  className={
                    category.isActive
                      ? "badge-open rounded-full px-3 py-1 text-xs font-bold"
                      : "badge-closed rounded-full px-3 py-1 text-xs font-bold"
                  }
                >
                  {category.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="btn-secondary py-2"
                  onClick={() =>
                    openEdit(category)
                  }
                >
                  Edit
                </button>

                <button
                  className="rounded-xl bg-[#b33b21] px-4 py-2 font-bold text-white"
                  onClick={() =>
                    remove(category._id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}