import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCategories } from "../api/categoryApi";
import { getAllProducts } from "../api/productApi";
import Footer from "../components/landing/Footer";
import Navbar from "../components/landing/Navbar";
import ProductCard from "../components/product/ProductCard";
import { FiChevronRight, FiFilter, FiSliders } from "react-icons/fi";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string | null;
  parentCategory?: string | { _id?: string; name?: string } | null;
}

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  brand?: string;
  images?: { url: string; fileId: string }[];
  category?: string | { _id?: string; name?: string; slug?: string } | null;
}

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "low-high", label: "Price: Low to High" },
  { value: "high-low", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "new", label: "New Arrivals" },
];

const categoryShowcase = [
  {
    name: "Women",
    image:
"https://images.pexels.com/photos/4872113/pexels-photo-4872113.jpeg"  },
  {
    name: "Men",
    image:
      "https://images.pexels.com/photos/13089781/pexels-photo-13089781.jpeg",
  },
  {
    name: "Kids",
    image:
"https://images.pexels.com/photos/1619730/pexels-photo-1619730.jpeg"  },
];

function ShopPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.trim() || "";

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedParent, setSelectedParent] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery) {
      setSelectedParent("All");
      setSelectedSubCategory("All");
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const [categoryData, productData] = await Promise.all([
          getCategories(),
          getAllProducts(searchQuery),
        ]);

        setCategories(categoryData || []);
        setProducts(productData || []);
      } catch (err) {
        console.error("Error fetching shop data", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [searchQuery]);

  const categoryTree = useMemo(() => {
    const parentCategories = categories.filter(
      (category) => !category.parentCategory,
    );

    return parentCategories.map((parent) => ({
      parent,
      children: categories.filter((category) => {
        const parentId =
          typeof category.parentCategory === "string"
            ? category.parentCategory
            : category.parentCategory?._id;

        return parentId === parent._id;
      }),
    }));
  }, [categories]);

  const categoryMap = useMemo(
    () =>
      categories.reduce<Record<string, string>>((acc, category) => {
        acc[category._id] = category.name;
        return acc;
      }, {}),
    [categories],
  );

  const selectedParentGroup = useMemo(
    () => categoryTree.find((group) => group.parent.name === selectedParent),
    [categoryTree, selectedParent],
  );

  const subCategories = selectedParentGroup?.children ?? [];

  const getCategoryName = useCallback(
    (category: ProductItem["category"]) => {
      if (!category) return "Uncategorized";

      if (typeof category === "string") {
        return categoryMap[category] || "Uncategorized";
      }

      return category.name || "Uncategorized";
    },
    [categoryMap],
  );

  const handleParentChange = (parentName: string) => {
    setSelectedParent(parentName);
    setSelectedSubCategory("All");
  };

  const filteredProducts = useMemo(() => {
    let visible = [...products];

    if (selectedParent !== "All") {
      const names =
        selectedSubCategory === "All"
          ? [
              selectedParent,
              ...(selectedParentGroup?.children.map((child) => child.name) ??
                []),
            ]
          : [selectedSubCategory];

      visible = visible.filter((product) =>
        names.includes(getCategoryName(product.category)),
      );
    } else if (selectedSubCategory !== "All") {
      visible = visible.filter(
        (product) => getCategoryName(product.category) === selectedSubCategory,
      );
    }

    switch (sortBy) {
      case "low-high":
        return visible.sort((a, b) => a.price - b.price);
      case "high-low":
        return visible.sort((a, b) => b.price - a.price);
      case "new":
        return visible.sort(
          (a, b) => Number(b._id.length) - Number(a._id.length),
        );
      default:
        return visible;
    }
  }, [
    products,
    selectedParent,
    selectedSubCategory,
    selectedParentGroup,
    sortBy,
    getCategoryName,
  ]);

  return (
    <div className="bg-surface text-text-primary">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <span className="text-base transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>

          <span>Back</span>
        </Link>

        {/* ==================== SECTION 1: HERO ==================== */}
        {!searchQuery && (
          <section className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#111111_0%,#2a2a2a_40%,#b88a5a_100%)] text-white shadow-[0_20px_45px_rgba(17,17,17,0.18)]">
            <div className="grid items-center gap-8 px-6 py-10 md:grid-cols-2 md:px-10 lg:px-12">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-accent">
                  Exclusive picks
                </p>

                <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                  Style for every moment.
                </h1>

                <p className="mt-4 max-w-lg text-sm leading-7 text-gray-200 md:text-base">
                  Discover curated fashion essentials, fresh arrivals, and
                  standout pieces handpicked for your everyday look.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/categories/women"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-surface-card px-5 py-3 text-sm font-medium text-text-primary transition hover:opacity-90"
                  >
                    Shop Women
                  </Link>

                  <Link
                    to="/categories/men"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-medium text-white transition hover:bg-surface-card/10"
                  >
                    Shop Men
                  </Link>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <img
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
                  alt="Fashion lifestyle"
                  className="h-70 w-full max-w-md rounded-3xl object-cover shadow-[0_20px_45px_rgba(0,0,0,0.25)] md:h-85"
                />
              </div>
            </div>
          </section>
        )}

        {/* ==================== SECTION 2: CATEGORY ==================== */}
        {!searchQuery && (
          <section className="mt-8 rounded-3xl border border-border-default bg-surface-card p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Browse
                </p>

                <h2 className="mt-1 font-display text-2xl font-semibold text-text-primary">
                  Shop by Category
                </h2>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-border-default bg-surface-muted px-3 py-2 text-sm text-text-primary">
                <FiFilter size={15} />
                <span>{filteredProducts.length} items</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {categoryShowcase.map((item) => {
                const isActive = selectedParent === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() =>
                      handleParentChange(isActive ? "All" : item.name)
                    }
                    className={`group relative overflow-hidden rounded-2xl border text-left transition ${
                      isActive
                        ? "border-text-primary shadow-md"
                        : "border-border-default hover:border-text-primary"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-48 w-full object-cover object-top transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-white">
                      <span className="text-lg font-semibold">{item.name}</span>

                      <FiChevronRight size={18} />
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedParent !== "All" && subCategories.length > 0 && (
              <div className="mt-5 border-t border-border-default pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-text-primary">
                    More picks in {selectedParent}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedSubCategory("All")}
                    className="text-xs font-medium text-accent"
                  >
                    Clear
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSubCategory("All")}
                    className={`min-h-10 rounded-full px-4 text-sm font-medium transition ${
                      selectedSubCategory === "All"
                        ? "bg-btn-primary text-btn-primary-text"
                        : "border border-border-default bg-surface-card text-text-primary hover:border-text-primary"
                    }`}
                  >
                    All
                  </button>

                  {subCategories.map((subCategory) => (
                    <button
                      key={subCategory._id}
                      type="button"
                      onClick={() => setSelectedSubCategory(subCategory.name)}
                      className={`min-h-10 rounded-full px-4 text-sm font-medium transition ${
                        selectedSubCategory === subCategory.name
                          ? "bg-btn-primary text-btn-primary-text"
                          : "border border-border-default bg-surface-card text-text-primary hover:border-text-primary"
                      }`}
                    >
                      {subCategory.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ==================== SECTION 3: FILTER / SORT ==================== */}
        {!searchQuery && (
          <section className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-border-default bg-surface-card p-4 shadow-sm">
            <div className="text-sm text-text-secondary">
              {selectedParent === "All" && selectedSubCategory === "All" ? (
                "Showing all collections"
              ) : (
                <span>
                  Browsing{" "}
                  <span className="font-semibold text-text-primary">
                    {selectedSubCategory === "All"
                      ? selectedParent
                      : selectedSubCategory}
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border-default bg-surface-muted px-3 py-2">
              <FiSliders size={15} className="text-text-primary" />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm text-text-primary outline-none"
                aria-label="Sort products"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </section>
        )}

        {/* ==================== SECTION 4: PRODUCTS ==================== */}
        <section className={searchQuery ? "mt-4" : "mt-8"}>
          {/* Search heading only appears during search */}
          {searchQuery && !loading && !error && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Search Results
              </p>

              <h2 className="mt-1 font-display text-2xl font-semibold text-text-primary sm:text-3xl">
                Results for "{searchQuery}"
              </h2>

              <p className="mt-2 text-sm text-text-secondary">
                {filteredProducts.length} products found
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-xl border border-border-default bg-surface-card p-3"
                >
                  <div className="h-56 rounded-lg bg-surface-muted" />

                  <div className="mt-4 h-4 w-20 rounded bg-surface-muted" />

                  <div className="mt-3 h-5 w-32 rounded bg-surface-muted" />

                  <div className="mt-3 h-4 w-24 rounded bg-surface-muted" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-status-error bg-status-error-bg p-6 text-sm text-status-error">
              {error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-border-default bg-surface-card p-10 text-center">
              <p className="text-lg font-medium text-text-primary">
                No products found
              </p>

              <p className="mt-2 text-sm text-text-secondary">
                Try another collection or check back later for fresh arrivals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* ==================== SECTION 5: BENEFITS ==================== */}
        {!searchQuery && (
          <section className="mt-12 rounded-2xl border border-border-default bg-section-tint p-6 sm:p-8">
            <div className="grid gap-5 md:grid-cols-4">
              {[
                {
                  title: "Free Shipping",
                  text: "On all orders above ₹999",
                },
                {
                  title: "Easy Returns",
                  text: "7-day hassle-free returns",
                },
                {
                  title: "Secure Payment",
                  text: "100% safe and protected",
                },
                {
                  title: "24/7 Support",
                  text: "Always here to help",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-section-tint-border bg-surface-card p-4 text-center"
                >
                  <h3 className="text-sm font-semibold text-text-primary">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-text-secondary">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ShopPage;