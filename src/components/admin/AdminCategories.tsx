import { useEffect, useMemo, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryPayload,
} from "../../api/categoryApi";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string | null;
  isActive: boolean;
  parentCategory?: string | { _id?: string; name?: string } | null;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function AdminCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [image, setImage] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.log("Error fetching categories", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getParentId = (cat: CategoryItem) =>
    typeof cat.parentCategory === "string"
      ? cat.parentCategory
      : cat.parentCategory?._id || null;

  const categoryTree = useMemo(() => {
    const parents = categories.filter((c) => !getParentId(c));
    return parents.map((parent) => ({
      parent,
      children: categories.filter((c) => getParentId(c) === parent._id),
    }));
  }, [categories]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setParentCategory("");
    setImage("");
    setSlugManuallyEdited(false);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  };

  const handleEdit = (cat: CategoryItem) => {
    setEditingId(cat._id);
    setName(cat.name);
    setSlug(cat.slug);
    setParentCategory(getParentId(cat) || "");
    setImage(cat.image || "");
    setSlugManuallyEdited(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    const payload: CategoryPayload = {
      name: name.trim(),
      slug: slug.trim(),
      parentCategory: parentCategory || null,
      image: image.trim() || null,
    };

    try {
      setSubmitting(true);
      if (editingId) {
        await updateCategory(editingId, payload);
        toast.success("Category updated");
      } else {
        await createCategory(payload);
        toast.success("Category created");
      }
      resetForm();
      fetchCategories();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to save category";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (cat: CategoryItem) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          Delete "{cat.name}"? Products in this category will be orphaned.
        </p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                setDeletingId(cat._id);
                await deleteCategory(cat._id);
                toast.success("Category deleted");
                fetchCategories();
              } catch (err: any) {
                const message =
                  err?.response?.data?.message || "Failed to delete category";
                toast.error(message);
              } finally {
                setDeletingId(null);
              }
            }}
            className="rounded-md bg-status-error px-3 py-1.5 text-xs font-medium text-white hover:opacity-85"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-md border border-border-default px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <div className="lg:col-span-1">
        <form
          onSubmit={handleSubmit}
          className="sticky top-24 rounded-2xl border border-border-default bg-surface-card p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">
              {editingId ? "Edit Category" : "Add Category"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-text-secondary hover:text-text-primary"
                aria-label="Cancel edit"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-primary">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm outline-none focus:border-text-primary"
                placeholder="e.g. Women"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-primary">
                Slug
              </label>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm outline-none focus:border-text-primary"
                placeholder="e.g. women"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-primary">
                Parent Category
              </label>
              <select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm outline-none focus:border-text-primary"
              >
                <option value="">None (top-level)</option>
                {categories
                  .filter((c) => !getParentId(c) && c._id !== editingId)
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-primary">
                Image URL (optional)
              </label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm outline-none focus:border-text-primary"
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-btn-primary px-4 py-2.5 text-sm font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Category"
                : "Add Category"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="lg:col-span-2">
        {loading ? (
          <p className="text-sm text-text-secondary">Loading categories...</p>
        ) : categoryTree.length === 0 ? (
          <div className="rounded-2xl border border-border-default bg-surface-card p-10 text-center">
            <p className="text-sm text-text-secondary">No categories yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categoryTree.map(({ parent, children }) => (
              <div
                key={parent._id}
                className="rounded-2xl border border-border-default bg-surface-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {parent.name}
                    </p>
                    <p className="text-xs text-text-secondary">/{parent.slug}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(parent)}
                      className="rounded-lg border border-border-default p-2 text-text-primary hover:border-text-primary"
                      aria-label="Edit"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === parent._id}
                      onClick={() => handleDelete(parent)}
                      className="rounded-lg border border-border-default p-2 text-status-error hover:border-status-error disabled:opacity-50"
                      aria-label="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {children.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-border-default pt-3">
                    {children.map((child) => (
                      <div
                        key={child._id}
                        className="flex items-center justify-between pl-4"
                      >
                        <div>
                          <p className="text-sm text-text-primary">{child.name}</p>
                          <p className="text-xs text-text-secondary">/{child.slug}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(child)}
                            className="rounded-lg border border-border-default p-2 text-text-primary hover:border-text-primary"
                            aria-label="Edit"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === child._id}
                            onClick={() => handleDelete(child)}
                            className="rounded-lg border border-border-default p-2 text-status-error hover:border-status-error disabled:opacity-50"
                            aria-label="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;