import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/categoryApi";
import { createProduct } from "../../api/productApi";
import toast from "react-hot-toast";

interface AddProductFormData {
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

function AddProduct() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductFormData>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        console.log("Categories fetched:", data);
      } catch (err) {
        console.log("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  const mainCategories = categories.filter(
    (cat) => cat.parentCategory === null,
  );
  const subCategories = categories.filter(
    (cat) => cat.parentCategory === selectedMainCategory,
  );

  const onSubmit = async (data: AddProductFormData) => {
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

      // convert comma separated text into JSON array string (backend expects JSON.parse-able)
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

      if (images) {
        Array.from(images).forEach((file) => {
          formData.append("images", file);
        });
      }

      await createProduct(formData);

      toast.success("Product added successfully!");
      navigate("/seller/dashboard");
    } catch (err: any) {
      console.log("Error adding product", err);
      const message =
        err?.response?.data?.message || "Failed to add product. Try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">
        Add New Product
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

        {/* Subcategory dropdown - only shows once main category picked */}
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

        {/* Images */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Product Images (up to 5, hold Ctrl/Cmd to select multiple)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
