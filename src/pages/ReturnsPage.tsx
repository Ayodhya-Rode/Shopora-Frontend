import { Link } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw, FiClock, FiXCircle } from "react-icons/fi";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

function ReturnsPage() {
  return (
    <div className="bg-surface">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <FiArrowLeft size={18} />
          Back
        </Link>

        <h1 className="font-display text-3xl font-semibold text-text-primary">
          Returns & Refunds
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          We want you to love what you ordered. Here's how returns work.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-4 rounded-xl border border-border-default bg-surface-card p-5">
            <FiRefreshCw size={20} className="mt-0.5 text-accent" />
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                7-Day Return Window
              </h2>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                You can request a return within 7 days of delivery. Items must
                be unused, unwashed, and in their original packaging with tags
                intact.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-border-default bg-surface-card p-5">
            <FiClock size={20} className="mt-0.5 text-accent" />
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Refund Timeline
              </h2>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Once your return is received and inspected, refunds are
                processed within 5-7 business days to your original payment
                method. COD orders are refunded via bank transfer.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-border-default bg-surface-card p-5">
            <FiXCircle size={20} className="mt-0.5 text-accent" />
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Non-Returnable Items
              </h2>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Innerwear, customized products, and items marked "final sale"
                cannot be returned for hygiene or customization reasons.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-section-tint-border bg-section-tint p-5">
          <p className="text-sm text-text-secondary">
            To start a return, go to{" "}
            <Link to="/orders" className="font-medium text-accent hover:underline">
              My Orders
            </Link>{" "}
            and select the item you'd like to return. Need help? Reach out via
            our{" "}
            <Link to="/contact" className="font-medium text-accent hover:underline">
              Contact page
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ReturnsPage;