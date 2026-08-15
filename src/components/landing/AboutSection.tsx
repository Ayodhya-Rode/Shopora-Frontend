import { Link } from "react-router-dom";

const stats = [
  { value: "1M+", label: "happy shoppers" },
  { value: "50K+", label: "curated styles" },
  { value: "4.9/5", label: "customer rating" },
];

const highlights = [
  "Curated fashion essentials",
  "Verified sellers and trusted brands",
  "Style-first shopping experience",
];

function AboutSection() {
  
  return (
    <section
      id="about-section"
      className="relative overflow-hidden bg-section-tint py-12 sm:py-16 lg:py-20"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,138,90,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(17,17,17,0.06),transparent_30%)]" />

      {/* Main container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-primary transition hover:text-accent"
        >
          ← Back
        </Link>

        {/* Main Content */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left Content */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              About Shopora
            </p>

            <h2 className="max-w-xl font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl lg:text-5xl">
              We bring your everyday style to life.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-text-secondary sm:text-base">
              Shopora is built for modern shoppers who want premium looks, smart
              value, and a seamless buying experience—all in one place. From
              trend-led pieces to everyday essentials, we make it easy to
              discover products that feel personal.
            </p>

            {/* Stats */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-section-tint-border bg-surface-card/80 p-4 shadow-sm backdrop-blur-sm"
                >
                  <div className="text-2xl font-semibold text-text-primary">
                    {stat.value}
                  </div>

                  <div className="mt-1 text-xs uppercase tracking-wide text-text-secondary">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-btn-primary px-6 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85"
              >
                Explore Collections
              </Link>

              <Link
                to="/seller-login"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-text-primary px-6 py-3 text-sm font-medium text-text-primary transition hover:bg-btn-primary hover:text-btn-primary-text"
              >
                Become a Seller
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Main Image */}
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
                alt="Stylish shopper"
                className="h-72 w-full rounded-[28px] object-cover shadow-[0_20px_45px_rgba(17,17,17,0.10)] sm:h-80"
              />

              {/* Right Cards */}
              <div className="flex flex-col gap-4">
                {/* Why people choose us */}
                <div className="rounded-[28px] bg-btn-primary p-5 text-btn-primary-text shadow-[0_20px_45px_rgba(17,17,17,0.18)]">
                  <p className="text-xs uppercase tracking-[0.25em] text-accent">
                    Why people choose us
                  </p>

                  <ul className="mt-5 space-y-3 text-sm text-white">
                    {highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Second Image */}
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
                  alt="Fashion collection"
                  className="h-48 w-full rounded-[28px] object-cover shadow-[0_20px_45px_rgba(17,17,17,0.08)] sm:h-52"
                />
              </div>
            </div>

            {/* Daily Drop */}
            <div className="absolute -bottom-5 left-4 rounded-2xl border border-section-tint-border bg-surface-card px-4 py-3 shadow-lg sm:left-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                Daily Drop
              </p>

              <p className="mt-1 text-base font-semibold text-text-primary">
                New arrivals every day
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
