const values = [
  { id: "shipping", title: "Free Shipping", description: "On all orders above ₹999" },
  { id: "returns", title: "Easy Returns", description: "7-day hassle-free returns" },
  { id: "payment", title: "Secure Payment", description: "100% secure checkout" },
  { id: "support", title: "24/7 Support", description: "Dedicated customer care" },
];

function ValueProps() {
  return (
    <section className="border-y border-border-default bg-surface py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4 lg:px-8">
        {values.map((value) => (
          <div key={value.id}>
            <h3 className="mb-1 text-sm font-semibold text-text-primary">
              {value.title}
            </h3>
            <p className="text-xs text-text-secondary">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ValueProps;