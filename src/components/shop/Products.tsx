import { useNavigate } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
import { products } from "../../data/products";

export default function Products() {
  const navigate = useNavigate();

  return (
    <section className="px-6 py-10 text-black pl-20 pr-20">
      
      {/* Header + Button Row */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">New Additions</h2>

        <button
          onClick={() => navigate("/all-products")}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center">
        {products.map((item) => (
          <ProductCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}