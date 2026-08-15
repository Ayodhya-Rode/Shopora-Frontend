import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { getCategories } from "../../api/categoryApi";
import { getProductById, updateProduct } from "../../api/productApi";
import toast from "react-hot-toast";

interface EditProductFormData {
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sizes: string;
  colors: string;
}

interface ExistingImage {
  fileId: string;
  url: string;
}

function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [removeImageIds, setRemoveImageIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProductFormData>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.log("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);

        const categoryId =
          typeof product.category === "object"
            ? product.category._id
            : product.category;

        reset({
          name: product.name,
          description: product.description,
          brand: product.brand,
          category: categoryId,
          price: product.price,
          discountPrice: product.discountPrice,
          stock: product.stock,
          sizes: (product.sizes || []).join(", "),
          colors: (product.colors || []).join(", "),
        });

        setExistingImages(product.images || []);

        // set main category so subcategory dropdown shows the right list
        const subCat = categories.find((cat) => cat._id === categoryId);
        if (subCat?.parentCategory) {
          const parentId =
            typeof subCat.parentCategory === "object"
              ? subCat.parentCategory._id
              : subCat.parentCategory;
          setSelectedMainCategory(parentId);
        }
      } catch (err) {
        console.log("Error fetching product", err);
        toast.error("Failed to load product");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, categories.length]);

  const mainCategories = categories.filter(
    (cat) => cat.parentCategory === null,
  );
  const subCategories = categories.filter(
    (cat) => cat.parentCategory === selectedMainCategory,
  );

  const toggleRemoveImage = (fileId: string) => {
    setRemoveImageIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId],
    );
  };

  const onSubmit = async (data: EditProductFormData) => {
    if (!id) return;

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("brand", data.brand);
      formData.append("category", data.category);
      formData.append("price", String(data.price));
      if (data.discountPrice) {
        formData.append("discountPrice", String(data.discountPrice));
      }
      formData.append("stock", String(data.stock));

      const sizesArray = data.sizes
        ? data.sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const colorsArray = data.colors
        ? data.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];
      formData.append("sizes", JSON.stringify(sizesArray));
      formData.append("colors", JSON.stringify(colorsArray));

      if (removeImageIds.length > 0) {
        formData.append("removeImages", JSON.stringify(removeImageIds));
      }

      if (newImages) {
        Array.from(newImages).forEach((file) => {
          formData.append("images", file);
        });
      }

      await updateProduct(id, formData);

      toast.success("Product updated successfully!");
      navigate("/seller/dashboard");
    } catch (err: any) {
      console.log("Error updating product", err);
      const message =
        err?.response?.data?.message || "Failed to update product. Try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <p className="p-8">Loading product...</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <FiArrowLeft size={18} />
        Back
      </button>

      <h1 className="mb-6 text-2xl font-semibold text-text-primary">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Product Name
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm outline-none focus:border-text-primary"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-status-error">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows={4}
            className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm outline-none focus:border-text-primary"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-status-error">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Brand */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Brand
          </label>
          <input
            {...register("brand")}
            className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm outline-none focus:border-text-primary"
          />
        </div>

        {/* Main Category dropdown */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Main Category
          </label>
          <select
            value={selectedMainCategory}
            onChange={(e) => setSelectedMainCategory(e.target.value)}
            className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm outline-none focus:border-text-primary"
          >
            <option value="">Select main category</option>
            {mainCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory dropdown */}
        {selectedMainCategory && (
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Subcategory
            </label>
            <select
              {...register("category", { required: "Subcategory is required" })}
              className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm outline-none focus:border-text-primary"
            >
              <option value="">Select subcategory</option>
              {subCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-status-error">
                {errors.category.message}
              </p>
            )}
          </div>
        )}

        {/* Price + Discount price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Price (₹)
            </label>
            <input
              type="number"
              {...register("price", { required: "Price is required" })}
              className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm outline-none focus:border-text-primary"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-status-error">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Discount Amount (₹) — subtracted from Price
            </label>
            <input
              type="number"
              {...register("discountPrice")}
              className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm outline-none focus:border-text-primary"
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Stock
          </label>
          <input
            type="number"
            {...register("stock", { required: "Stock is required" })}
            className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm outline-none focus:border-text-primary"
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-status-error">
              {errors.stock.message}
            </p>
          )}
        </div>

        {/* Sizes */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Sizes (comma separated, e.g. S, M, L)
          </label>
          <input
            {...register("sizes")}
            placeholder="S, M, L, XL"
            className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm outline-none focus:border-text-primary"
          />
        </div>

        {/* Colors */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Colors (comma separated, e.g. Red, Blue)
          </label>
          <input
            {...register("colors")}
            placeholder="Red, Blue, Black"
            className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm outline-none focus:border-text-primary"
          />
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Current Images (check to remove)
            </label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img) => {
                const marked = removeImageIds.includes(img.fileId);
                return (
                  <label
                    key={img.fileId}
                    className={`relative cursor-pointer overflow-hidden rounded-lg border ${
                      marked ? "border-status-error" : "border-border-default"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt="Product"
                      className={`h-20 w-20 object-cover ${marked ? "opacity-40" : ""}`}
                    />
                    <input
                      type="checkbox"
                      checked={marked}
                      onChange={() => toggleRemoveImage(img.fileId)}
                      className="absolute right-1 top-1"
                    />
                    {marked && (
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-status-error">
                        Remove
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* New Images */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Add New Images (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewImages(e.target.files)}
            className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
