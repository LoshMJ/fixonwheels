import ProductCard from "../ui/ProductCard";
import { products } from "../../data/products";

export default function Products() {
  return (
    <section className="px-6 py-10 text-black pl-20 pr-20">
      <h2 className="text-2xl font-bold mb-6">New Additions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center">
        {products.map((item) => (
          <ProductCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
