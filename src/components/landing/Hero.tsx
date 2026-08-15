import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-12 sm:px-6 md:flex-row md:gap-12 md:py-20 lg:px-8">
      <div className="flex-1 text-center md:text-left">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-accent">
          Shopora
        </p>

        <h1 className="font-display text-4xl font-semibold leading-tight text-text-primary md:text-5xl lg:text-6xl">
          Timeless Style,
          <br />
          Modern Edge
        </h1>

        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-text-secondary md:mx-0 md:text-base">
          Discover fashion, explore new collections and shop everything you
          love in one place.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
          <Link
            to="/shop"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-btn-primary px-6 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <div className="w-full flex-1">
        <img
          src="/hero_banner.jpg"
          alt="Fashion collection banner"
          className="aspect-4/3 w-full rounded-2xl bg-border-default object-cover"
        />
      </div>
    </section>
  );
}

export default Hero;