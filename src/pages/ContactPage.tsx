import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import toast from "react-hot-toast";
import { sendContactMessage } from "../api/contactApi";

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!name.trim() || !email.trim() || !message.trim()) {
    toast.error("Please fill in all fields");
    return;
  }

  setSending(true);
  try {
    await sendContactMessage({ name, email, message });
    toast.success("Message sent! We'll get back to you soon.");
    setName("");
    setEmail("");
    setMessage("");
  } catch {
    toast.error("Something went wrong. Please try again.");
  } finally {
    setSending(false);
  }
};

  return (
    <div className="bg-surface">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <FiArrowLeft size={18} />
          Back
        </Link>

        <h1 className="font-display text-3xl font-semibold text-text-primary">
          Contact Us
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Have a question or need help with an order? We'd love to hear from you.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-xl border border-border-default bg-surface-card p-4">
              <FiMail size={18} className="mt-0.5 text-accent" />
              <div>
                <p className="text-sm font-medium text-text-primary">Email</p>
                <p className="text-sm text-text-secondary">support@shopora.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border-default bg-surface-card p-4">
              <FiPhone size={18} className="mt-0.5 text-accent" />
              <div>
                <p className="text-sm font-medium text-text-primary">Phone</p>
                <p className="text-sm text-text-secondary">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border-default bg-surface-card p-4">
              <FiMapPin size={18} className="mt-0.5 text-accent" />
              <div>
                <p className="text-sm font-medium text-text-primary">Address</p>
                <p className="text-sm text-text-secondary">
                  Shopora HQ, Pune, Maharashtra, India
                </p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-border-default bg-surface-card p-6"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm text-text-primary outline-none focus:border-text-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm text-text-primary outline-none focus:border-text-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border-default bg-surface-card px-4 py-3 text-sm text-text-primary outline-none focus:border-text-primary"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ContactPage;