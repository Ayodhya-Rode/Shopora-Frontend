import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getRecommendedProducts } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { useAuth } from "../context/AuthContext";
import { FiArrowLeft, FiHeart, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getFinalPrice } from "../utils/pricing";
import {
  getProductReviews,
  deleteReview,
  updateReview,
} from "../api/reviewApi";
import { getUserProfile } from "../api/user.api";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { accessToken } = useAuth();
  const { refreshCartCount } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<any[]>([]);

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id as string);
        setProduct(data);
        setSelectedImage(data.images?.[0]?.url || "/placeholder.png");
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await getProductReviews(id as string);
        setReviews(data || []);
      } catch (err) {
        console.log("Error fetching reviews", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  // fetch current logged-in user id (to show edit/delete on own review)
  useEffect(() => {
    if (!accessToken) return;
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        setCurrentUserId(data._id);
      } catch (err) {
        console.log("Error fetching user profile", err);
      }
    };
    fetchUser();
  }, [accessToken]);

  // fetch recommended product
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const data = await getRecommendedProducts(id as string);
        setRecommended(data || []);
      } catch (err) {
        console.log("Error fetching recommendations", err);
      }
    };
    fetchRecommended();
  }, [id]);

  const handleAddToCart = async () => {
    if (!accessToken) {
      toast.error("Please login to add items to cart");
      navigate("/user-login");
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product._id, quantity, selectedSize, selectedColor);
      toast.success("Added to cart!");
      refreshCartCount();
      navigate(-1);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to add to cart. Try again.";
      toast.error(message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      setDeletingReviewId(reviewId);
      await deleteReview(reviewId);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to delete review";
      toast.error(message);
    } finally {
      setDeletingReviewId(null);
    }
  };

  const startEditingReview = (review: any) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  const cancelEditingReview = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditComment("");
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (editRating < 1) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSavingEdit(true);
      const updated = await updateReview(reviewId, editRating, editComment);
      toast.success("Review updated");
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, rating: updated.rating, comment: updated.comment }
            : r,
        ),
      );
      cancelEditingReview();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to update review";
      toast.error(message);
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) return <p className="p-8">Loading product...</p>;
  if (error || !product)
    return <p className="p-8">{error || "Product not found"}</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <FiArrowLeft size={18} />
        Back
      </button>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Image gallery */}
        <div>
          <div className="mb-4 overflow-hidden rounded-xl border border-border-default">
            <img
              src={selectedImage}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img: any) => (
                <button
                  key={img.fileId}
                  onClick={() => setSelectedImage(img.url)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                    selectedImage === img.url
                      ? "border-text-primary"
                      : "border-border-default"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {product.brand && (
            <p className="text-sm text-text-secondary">{product.brand}</p>
          )}

          <h1 className="mt-1 text-2xl font-semibold text-text-primary md:text-3xl">
            {product.name}
          </h1>

          {product.numReviews > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="flex items-center gap-1 rounded bg-status-success px-2 py-0.5 text-xs font-medium text-white">
                {product.avgRating.toFixed(1)}{" "}
                <FiStar size={12} className="fill-white" />
              </span>
              <span className="text-sm text-text-secondary">
                {product.numReviews} review{product.numReviews !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-semibold text-text-primary">
                  ₹{getFinalPrice(product)}
                </span>
                <span className="text-base text-text-secondary line-through">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-text-primary">
                ₹{product.price}
              </span>
            )}
          </div>

          <p className="mt-6 text-sm leading-6 text-text-secondary">
            {product.description}
          </p>

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-text-primary">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                      selectedSize === size
                        ? "border-text-primary bg-btn-primary text-btn-primary-text"
                        : "border-border-default text-text-primary hover:border-text-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-text-primary">Colors</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                      selectedColor === color
                        ? "border-text-primary bg-btn-primary text-btn-primary-text"
                        : "border-border-default text-text-primary hover:border-text-primary"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mt-6 text-sm text-text-secondary">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          {product.stock > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <p className="text-sm font-medium text-text-primary">Quantity</p>
              <div className="flex items-center rounded-lg border border-border-default">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm text-text-primary hover:bg-surface-muted"
                >
                  -
                </button>
                <span className="px-3 text-sm text-text-primary">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-3 py-1.5 text-sm text-text-primary hover:bg-surface-muted"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              disabled={product.stock === 0 || isAddingToCart}
              onClick={handleAddToCart}
              className="flex-1 rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product._id)}
              aria-label={
                isWishlisted(product._id)
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className="flex h-auto w-14 items-center justify-center rounded-lg border border-border-default transition hover:border-text-primary"
            >
              <FiHeart
                size={20}
                className={
                  isWishlisted(product._id)
                    ? "fill-status-error text-status-error"
                    : "text-text-primary"
                }
              />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          Customer Reviews
        </h2>

        {reviewsLoading ? (
          <p className="mt-4 text-sm text-text-secondary">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="mt-4 text-sm text-text-secondary">
            No reviews yet for this product.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="rounded-xl border border-border-default bg-surface-card p-4"
              >
                {editingReviewId === review._id ? (
                  <div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditRating(star)}
                          className={`text-lg ${
                            star <= editRating
                              ? "text-status-warning"
                              : "text-border-default"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      placeholder="Share your experience (optional)"
                      className="mt-2 w-full rounded-lg border border-border-default p-2 text-sm"
                      rows={2}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        disabled={savingEdit}
                        onClick={() => handleSaveEdit(review._id)}
                        className="rounded-lg bg-btn-primary px-3 py-1.5 text-xs font-medium text-btn-primary-text disabled:opacity-50"
                      >
                        {savingEdit ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditingReview}
                        className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-primary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 rounded bg-status-success px-1.5 py-0.5 text-xs font-medium text-white">
                          {review.rating}{" "}
                          <FiStar size={11} className="fill-white" />
                        </span>
                        <span className="text-sm font-medium text-text-primary">
                          {review.user?.userName || "Anonymous"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-secondary">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>

                        {currentUserId === review.user?._id && (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditingReview(review)}
                              className="text-xs font-medium text-text-primary hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={deletingReviewId === review._id}
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-xs font-medium text-status-error hover:underline disabled:opacity-50"
                            >
                              {deletingReviewId === review._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {review.comment && (
                      <p className="mt-2 text-sm text-text-secondary">
                        {review.comment}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>


         {/* recommend similar product */}
      {recommended.length > 0 && (
        <div className="mt-12 border-t border-border-default pt-8">
          <h2 className="text-lg font-semibold text-text-primary">
            You may also like
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recommended.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => navigate(`/product/${item._id}`)}
                className="rounded-xl border border-border-default bg-surface-card p-2 text-left transition hover:border-text-primary"
              >
                <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-surface-muted">
                  {item.images?.[0]?.url ? (
                    <img
                      src={item.images[0].url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <p className="truncate text-xs font-medium text-text-primary">
                  {item.name}
                </p>
                <p className="text-xs text-text-secondary">
                  ₹{item.discountPrice || item.price}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
