import { useParams } from "react-router-dom";
import { products } from "../data/products";
import { useState } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [active, setActive] = useState(0);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
      {/* Images */}
      <div>
        <img
          src={product.images[active]}
          className="w-full h-[420px] object-cover rounded-xl"
        />

        <div className="flex gap-3 mt-4">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActive(i)}
              className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                active === i ? "border-purple-600" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-xl text-purple-700 font-semibold mt-3">
          RS. {product.price.toLocaleString()}
        </p>

        <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
