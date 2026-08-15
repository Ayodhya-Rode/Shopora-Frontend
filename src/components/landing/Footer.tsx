import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-panel-dark px-4 pt-12 pb-6 sm:px-6 md:pt-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 border-b border-white/10 pb-10 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <h3 className="mb-2 font-display text-lg font-semibold tracking-wide text-white">
            SHOPORA
          </h3>
          <p className="text-xs leading-6 text-gray-400">
            Your style, your store. Fashion marketplace for everyone.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-300">
            Quick Links
          </h4>
          <Link to="/" className="text-xs text-gray-400 transition hover:text-accent">
            Home
          </Link>
          <Link to="/shop" className="text-xs text-gray-400 transition hover:text-accent">
            Shop
          </Link>
          <Link to="/about" className="text-xs text-gray-400 transition hover:text-accent">
            About
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-300">
            Categories
          </h4>
          <Link to="/categories/women" className="text-xs text-gray-400 transition hover:text-accent">
            Women
          </Link>
          <Link to="/categories/men" className="text-xs text-gray-400 transition hover:text-accent">
            Men
          </Link>
          <Link to="/categories/kids" className="text-xs text-gray-400 transition hover:text-accent">
            Kids
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-300">
            Customer Service
          </h4>
          <Link to="/contact" className="text-xs text-gray-400 transition hover:text-accent">
            Contact Us
          </Link>
          <Link to="/faq" className="text-xs text-gray-400 transition hover:text-accent">
            FAQ
          </Link>
          <Link to="/returns" className="text-xs text-gray-400 transition hover:text-accent">
            Returns
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 pt-6 text-xs text-gray-500 sm:flex-row">
        <p>© 2026 Shopora. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/privacy" className="transition hover:text-accent">
            Privacy Policy
          </Link>
          <Link to="/terms" className="transition hover:text-accent">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;