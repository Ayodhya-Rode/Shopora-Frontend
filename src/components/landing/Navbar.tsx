import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSellerAuth } from "../../context/SellerAuthContext";
import { useTheme } from "../../context/useTheme";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiHeart,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function Navbar() {
  const [searchParams] = useSearchParams();
  const { accessToken } = useAuth();
  const { sellerAccessToken } = useSellerAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const { cartCount } = useCart();
  const { wishlistIds } = useWishlist();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "About", path: "/about" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-surface-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-display text-xl font-semibold tracking-wide text-text-primary"
        >
          SHOPORA
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium text-text-primary transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {sellerAccessToken ? (
            <Link
              to="/seller/dashboard"
              className="hidden min-h-11 items-center justify-center rounded-lg border border-accent px-4 text-sm font-medium text-accent transition hover:bg-accent hover:text-white sm:flex"
            >
              Seller Dashboard
            </Link>
          ) : (
            <Link
              to="/seller-login"
              className="hidden text-sm font-medium text-text-primary transition hover:text-accent sm:flex"
            >
              Become a Seller
            </Link>
          )}

          {isSearchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden items-center gap-2 rounded-lg border border-border-default px-3 py-2 sm:flex"
            >
              <FiSearch size={16} className="text-text-secondary" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setIsSearchOpen(false)}
                placeholder="Search products..."
                className="w-40 bg-transparent text-sm text-text-primary outline-none"
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden min-h-11 cursor-pointer min-w-11 items-center justify-center text-text-primary transition hover:text-accent sm:flex"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="hidden min-h-11 min-w-11 cursor-pointer items-center justify-center text-text-primary transition hover:text-accent sm:flex"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <Link
            to="/wishlist"
            className="relative hidden min-h-11 min-w-11 items-center justify-center text-text-primary transition hover:text-accent sm:flex"
            aria-label="Wishlist"
          >
            <FiHeart size={20} />
            {wishlistIds.size > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-error px-1 text-[10px] font-semibold text-white">
                {wishlistIds.size > 99 ? "99+" : wishlistIds.size}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative hidden min-h-11 min-w-11 items-center justify-center text-text-primary transition hover:text-accent sm:flex"
            aria-label="Cart"
          >
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-error px-1 text-[10px] font-semibold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {accessToken ? (
            <Link
              to="/user/profile"
              className="hidden min-h-11 min-w-11 items-center justify-center rounded-lg border border-text-primary text-text-primary transition hover:bg-text-primary hover:text-surface sm:flex"
              aria-label="Profile"
            >
              <FiUser size={20} />
            </Link>
          ) : (
            <Link
              to="/user-login"
              className="hidden min-h-11 min-w-11 items-center justify-center text-text-primary transition hover:text-accent sm:flex"
              aria-label="Login"
            >
              <FiUser size={20} />
            </Link>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-text-primary sm:hidden"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center text-text-primary md:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border-default bg-surface-card px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="min-h-11 py-2.5 text-sm font-medium text-text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-2 flex flex-col gap-2 border-t border-border-default pt-3">
            {sellerAccessToken ? (
              <Link
                to="/seller/dashboard"
                className="min-h-11 py-2.5 text-sm font-medium text-accent"
              >
                Seller Dashboard
              </Link>
            ) : (
              <Link
                to="/seller-login"
                className="min-h-11 py-2.5 text-sm font-medium text-text-primary"
              >
                Sell on Shopora
              </Link>
            )}

            {accessToken ? (
              <>
                <Link
                  to="/user/profile"
                  className="min-h-11 py-2.5 text-sm font-medium text-text-primary"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="min-h-11 py-2.5 text-sm font-medium text-text-primary"
                >
                  My Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="min-h-11 py-2.5 text-sm font-medium text-text-primary"
                >
                  Wishlist
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/user-login"
                  className="min-h-11 py-2.5 text-sm font-medium text-text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/user-register"
                  className="min-h-11 rounded-lg bg-text-primary px-4 py-2.5 text-center text-sm font-medium text-surface"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;