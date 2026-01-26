import { useState } from "react";
import { motion } from "framer-motion";
import i17ProMax from "../../assets/phones/i17ProMax.png";

const products = [
  { title: "i17Pro Max", image: i17ProMax },
  { title: "i17Pro Max", image: i17ProMax },
  { title: "i17Pro Max", image: i17ProMax },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ShopSection() {
  const [current, setCurrent] = useState(0);

  return (
    <section
      className="w-full max-w-9xl mx-auto pl-20 pr-2 py-16 bg-[url('/src/assets/galaxy-bg.jpg')] h-[calc(100vh)]"
    >
      {/* ================= Main Flex Container ================= */}
      <div className="flex gap-20 items-start justify-center mt-20">
        {/* ================= Categories Section ================= */}
        <div className="w-1/2 py-8 bg-black/10 rounded-3xl backdrop-blur-lg border border-white/10 shadow-[0_0_40px_rgba(168,85,247,0.2)] px-10">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1 h-10 bg-yellow-400 rounded-full"></span>
            <h2 className="text-5xl font-bold text-white">Categories</h2>
          </div>

          <motion.div
            className="grid grid-cols-4 grid-rows-2 gap-x-6 gap-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Flower */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gray-100 rounded-[32px] p-6 h-[220px] cursor-pointer transition"
            >
              <p className="text-sm text-gray-500">Say it with Flowers !</p>
              <h3 className="text-2xl font-bold text-gray-800">Flower Shop</h3>
              <img src={i17ProMax} className="absolute bottom-1 right-4 w-28" />
            </motion.div>

            {/* Chocolates */}
            <motion.div
              variants={cardVariants}
              className="relative bg-pink-100 rounded-[32px] p-6 h-[220px] col-span-2 hover:shadow-xl transition"
            >
              <p className="text-sm text-orange-600">Pure Bliss in Every Bite !</p>
              <h3 className="text-3xl font-bold text-gray-800">Chocolates</h3>
              <motion.img
                src={i17ProMax}
                alt="Chocolates"
                className="absolute bottom-9 right-3 w-44"
                whileHover={{ y: -25 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </motion.div>

            {/* Cosmetics */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-green-100 rounded-[32px] p-6 h-[220px] cursor-pointer transition"
            >
              <p className="text-sm text-green-600">Beauty Begins Here !</p>
              <h3 className="text-2xl font-bold text-gray-800">Cosmetics</h3>
              <img src={i17ProMax} className="absolute bottom-2 right-10 w-28" />
            </motion.div>

            {/* Food */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-yellow-100 rounded-[32px] p-6 h-[220px] col-span-2 cursor-pointer transition"
            >
              <p className="text-sm text-yellow-700">Good Food, Great Mood !</p>
              <h3 className="text-3xl font-bold text-gray-800">Food / Restaurant</h3>
              <img src={i17ProMax} className="absolute bottom-2 right-10 w-40" />
            </motion.div>

            {/* Jewelry */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gray-200 rounded-[32px] p-6 h-[220px] cursor-pointer transition"
            >
              <p className="text-sm text-red-500">Sparkle with Every Step !</p>
              <h3 className="text-2xl font-bold text-gray-800 uppercase">Jewelry</h3>
              <img src={i17ProMax} className="absolute bottom-4 right-4 w-28" />
            </motion.div>

            {/* Cakes */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-sky-100 rounded-[32px] p-6 h-[220px] cursor-pointer transition"
            >
              <p className="text-sm text-blue-600">For the Love of Cake !</p>
              <h3 className="text-2xl font-bold text-gray-800">Cakes</h3>
              <img src={i17ProMax} className="absolute bottom-4 right-4 w-28" />
            </motion.div>
          </motion.div>
        </div>

        {/* ================= Popular Products Section ================= */}
        <motion.div
          className="w-1/2 py-8 text-purple-300 bg-black/10 rounded-3xl backdrop-blur-lg border border-white/10 shadow-[0_0_40px_rgba(168,85,247,0.2)] pl-10 pr-10"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* TITLE */}
          <h2 className="text-4xl font-semibold text-center mb-14 text-white">
            Popular Products
          </h2>

          {/* CARDS */}
          <div className="relative flex justify-center items-start gap-10 max-w-6xl mx-auto my-2">
            <ProductCard title={products[0].title} image={products[0].image} />
            <ProductCard title={products[1].title} image={products[1].image} className="mt-16" />
            <ProductCard title={products[2].title} image={products[2].image} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= PRODUCT CARD ================= */
function ProductCard({
  title,
  image,
  className,
}: {
  title: string;
  image: string;
  className?: string;
}) {
  return (
    <div
      className={`group w-[280px] h-[380px] relative rounded-2xl overflow-hidden
                  bg-black border border-white/10
                  shadow-[0_0_35px_rgba(168,85,247,0.2)]
                  transition-all duration-500 ease-out
                  hover:-translate-y-3 hover:scale-[1.03]
                  hover:shadow-[0_0_60px_rgba(168,85,247,0.45)]
                  ${className}`}
    >
      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* GLASS INFO */}
      <div
        className="absolute bottom-0 left-0 right-0
                   bg-black/60 backdrop-blur-xl
                   p-6
                   transition-all duration-500
                   group-hover:bg-black/70"
      >
        <h3 className="text-lg font-medium mb-3">{title}</h3>
        <button
          className="text-sm flex items-center gap-2 text-white/70 transition-all duration-300 group-hover:text-white"
        >
          Learn More <span className="transition-transform group-hover:translate-x-1">↗</span>
        </button>
      </div>
    </div>
  );
}
