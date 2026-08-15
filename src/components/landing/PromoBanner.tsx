import { Link } from "react-router-dom";

function PromoBanner() {
  return (
    <section className="bg-panel-dark px-4 py-16 text-center sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-accent">
          Limited Time
        </p>
        <h2 className="mb-3 font-display text-3xl font-semibold text-white md:text-4xl">
          End of Season Sale
        </h2>
        <p className="mb-8 text-sm text-gray-400">
          Up to 40% off on select styles
        </p>
        <Link
          to="/shop"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Shop the Sale
        </Link>
      </div>
    </section>
  );
}

export default PromoBanner;