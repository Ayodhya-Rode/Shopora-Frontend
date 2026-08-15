import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "Once logged in, go to My Orders from your profile to see the status of all your orders, from placed to delivered.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD) and online payments via Razorpay (cards, UPI, netbanking, wallets).",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Yes, orders can be cancelled from My Orders as long as they're still in Placed or Confirmed status. Once shipped, cancellation isn't available.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery timelines vary by seller and location, but most orders arrive within 5-7 business days.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 7-day hassle-free return window from the date of delivery. See our Returns page for full details.",
  },
  {
    question: "How do I become a seller on Shopora?",
    answer:
      "Click 'Become a Seller' in the navigation bar, register your shop, and start listing products once approved.",
  },
];

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Everything you need to know about shopping with us.
        </p>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-border-default bg-surface-card"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-text-primary">
                    {faq.question}
                  </span>
                  <FiChevronDown
                    size={18}
                    className={`shrink-0 text-text-secondary transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <p className="px-5 pb-4 text-sm leading-6 text-text-secondary">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FAQPage;