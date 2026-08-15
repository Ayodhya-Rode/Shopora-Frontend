import { useState } from "react";
import toast from "react-hot-toast";
import { subscribeNewsletter } from "../../api/contactApi";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await subscribeNewsletter(email);
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="bg-surface px-4 py-16 text-center sm:px-6 lg:px-8">
      <h2 className="mb-2 font-display text-2xl font-semibold text-text-primary md:text-3xl">
        Stay in the Loop
      </h2>
      <p className="mx-auto mb-8 max-w-md text-sm text-text-secondary">
        Subscribe for early access to new arrivals and exclusive offers.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={sending}
          className="min-h-11 flex-1 rounded-lg border border-border-default px-4 py-3 text-sm text-text-primary outline-none focus:border-text-primary"
        />
        <button
          type="submit"
          className="min-h-11 shrink-0 rounded-lg bg-btn-primary px-6 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85"
        >
           {sending ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </section>
  );
}

export default Newsletter;
