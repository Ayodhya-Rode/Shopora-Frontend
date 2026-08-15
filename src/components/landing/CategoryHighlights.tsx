import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/categoryApi";

//categories
const FEATURED_CATEGORIES: Record<string, string> = {
  Women: "Women",
  Men: "Men",
  Kids: "Kids"
};

//img of categories
const CATEGORY_IMAGES: Record<string, string> = {
  Women: "/womens_fashion.jpg",
  Men: "/mens_fashion.jpg",
  Kids: "/kids_fashion.jpg",
};

const CATEGORY_ORDER = ["Women", "Men", "Kids"];

function CategoryHighlights() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const featured = data.filter((cat: any) =>
          Object.keys(FEATURED_CATEGORIES).includes(cat.name),
        );

        // sort categories to always follow Women -> Men -> Kids order
        const sorted = featured.sort(
          (a: any, b: any) =>
            CATEGORY_ORDER.indexOf(a.name) - CATEGORY_ORDER.indexOf(b.name),
        );

        setCategories(sorted);
      } catch (err) {
        console.log("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <h2 className="mb-8 text-center font-display text-2xl font-semibold text-text-primary md:text-3xl">
        Shop by Category
      </h2>

      <div className="grid grid-cols-3 gap-4 md:gap-8">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/categories/${category.slug}`}
            className="group overflow-hidden rounded-xl border border-border-default bg-surface-card transition hover:shadow-md"
          >
            <img
              src={CATEGORY_IMAGES[category.name]}
              alt={category.name}
              className="aspect-square w-full bg-border-default object-cover transition duration-300 group-hover:scale-105"
            />
            <span className="block py-3 text-center text-sm font-medium text-text-primary md:text-base">
              {FEATURED_CATEGORIES[category.name]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryHighlights;
