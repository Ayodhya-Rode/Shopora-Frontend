import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface WishlistContextType {
  wishlistIds: Set<string>;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const { accessToken } = useAuth();

  const refreshWishlist = async () => {
    if (!accessToken) {
      setWishlistIds(new Set());
      return;
    }

    try {
      const products = await getWishlist();
      setWishlistIds(new Set(products.map((p: any) => p._id)));
    } catch (err) {
      console.log("Error fetching wishlist", err);
    }
  };

  useEffect(() => {
    refreshWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const isWishlisted = (productId: string) => wishlistIds.has(productId);

  const toggleWishlist = async (productId: string) => {
    if (!accessToken) {
      toast.error("Please login to use wishlist");
      return;
    }

    const alreadyWishlisted = wishlistIds.has(productId);

    // Optimistic UI update
    setWishlistIds((prev) => {
      const updated = new Set(prev);
      if (alreadyWishlisted) {
        updated.delete(productId);
      } else {
        updated.add(productId);
      }
      return updated;
    });

    try {
      if (alreadyWishlisted) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.log("Error toggling wishlist", err);
      toast.error("Failed to update wishlist");
      // Revert on failure
      refreshWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, isWishlisted, toggleWishlist, refreshWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}