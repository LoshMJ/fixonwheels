import { useEffect, useMemo, useState } from "react";
import { api, resolveImgUrl } from "../../services/api";

type CategoryId = "mobiles" | "chargers" | "headsets" | "displays" | "cases";

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "mobiles", label: "Mobiles" },
  { id: "chargers", label: "Chargers" },
  { id: "headsets", label: "Headsets / Earbuds" },
  { id: "displays", label: "Displays" },
  { id: "cases", label: "Cases & Covers" },
];

type ProductDoc = {
  _id: string;
  title: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  img: string;
  badge?: string;
  category?: CategoryId;
  models?: string[];
  colors?: string[];
  createdAt?: string;
};

const money = (n: number) => `Rs. ${Number(n || 0).toLocaleString("en-LK")}`;

const inputClass =
  "mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20";

function Stars({ value = 0 }: { value?: number }) {
  const v = Math.max(0, Math.min(5, value));
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const isFull = i < full;
        const isHalf = i === full && half;
        return (
          <span
            key={i}
            className={`text-sm ${isFull || isHalf ? "text-orange-400" : "text-white/20"}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function AdminShopCategories() {
  const [activeCat, setActiveCat] = useState<CategoryId>("mobiles");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [allProducts, setAllProducts] = useState<ProductDoc[]>([]);

  // form
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [oldPrice, setOldPrice] = useState<number>(0);
  const [badge, setBadge] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState<number>(0);
  const [modelsText, setModelsText] = useState("");
  const [colorsText, setColorsText] = useState("");

  // file upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // edit mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingImg, setExistingImg] = useState<string>("");

  const filtered = useMemo(() => {
    return allProducts.filter((p) => (p.category || "mobiles") === activeCat);
  }, [allProducts, activeCat]);

  const preview: ProductDoc = useMemo(
    () => ({
      _id: "preview",
      title: title || "Product title",
      img:
        imagePreview ||
        (existingImg ? resolveImgUrl(existingImg) : "") ||
        "https://via.placeholder.com/900x600?text=Image+preview",
      price: Number(price || 0),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      badge: badge || "",
      rating: rating ? Number(rating) : undefined,
      reviews: reviews ? Number(reviews) : undefined,
      category: activeCat,
      models: modelsText ? modelsText.split(",").map((x) => x.trim()).filter(Boolean) : [],
      colors: colorsText ? colorsText.split(",").map((x) => x.trim()).filter(Boolean) : [],
    }),
    [title, price, oldPrice, badge, rating, reviews, modelsText, colorsText, activeCat, imagePreview, existingImg]
  );

  const resetForm = () => {
    setTitle("");
    setPrice(0);
    setOldPrice(0);
    setBadge("");
    setRating(0);
    setReviews(0);
    setModelsText("");
    setColorsText("");
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setExistingImg("");
  };

  //  load from ADMIN endpoint (always up-to-date)
  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const data = await api<ProductDoc[]>("/admin/products");
      setAllProducts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setAllProducts([]);
      setMsg(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (p: ProductDoc) => {
    setEditingId(p._id);
    setTitle(p.title || "");
    setPrice(Number(p.price || 0));
    setOldPrice(Number(p.oldPrice || 0));
    setBadge(p.badge || "");
    setRating(Number(p.rating || 0));
    setReviews(Number(p.reviews || 0));
    setModelsText((p.models || []).join(", "));
    setColorsText((p.colors || []).join(", "));
    setExistingImg(p.img || "");
    setImageFile(null);
    setImagePreview("");
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPickImage = (file: File | null) => {
    setImageFile(file);
    if (!file) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const submit = async () => {
    if (!title.trim()) return setMsg("Title is required");
    if (!price || price <= 0) return setMsg("Price must be > 0");
    if (!editingId && !imageFile) return setMsg("Please select an image");

    setSaving(true);
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("price", String(Number(price)));
      fd.append("category", activeCat);

      if (oldPrice) fd.append("oldPrice", String(Number(oldPrice)));
      if (badge.trim()) fd.append("badge", badge.trim());
      if (rating) fd.append("rating", String(Number(rating)));
      if (reviews) fd.append("reviews", String(Number(reviews)));

      const models = modelsText ? modelsText.split(",").map((x) => x.trim()).filter(Boolean) : [];
      const colors = colorsText ? colorsText.split(",").map((x) => x.trim()).filter(Boolean) : [];
      fd.append("models", JSON.stringify(models));
      fd.append("colors", JSON.stringify(colors));

      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await api(`/admin/products/${editingId}`, { method: "PUT", body: fd });
        setMsg(" Product updated");
      } else {
        await api("/admin/products", { method: "POST", body: fd });
        setMsg(" Product added");
      }

      resetForm();
      await load();
    } catch (e: any) {
      setMsg(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setMsg("");
    try {
      await api(`/admin/products/${id}`, { method: "DELETE" });
      setMsg(" Deleted");
      await load();
    } catch (e: any) {
      setMsg(e?.message || "Delete failed");
    }
  };

  const activeLabel = CATEGORIES.find((x) => x.id === activeCat)?.label;

  return (
    <div className="min-h-screen bg-[#07070A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-extrabold">Shop Categories</h1>
              <p className="text-white/60 mt-1">Add products per category (used in “See more” pages)</p>
            </div>
          
          </div>

          {msg && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/80">
              {msg}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${
                  activeCat === c.id ? "bg-white text-black border-white" : "border-white/10 text-white/80 hover:bg-white/10"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Product" : "Add Product"} • <span className="text-white/70">{activeLabel}</span>
                </h2>
                <p className="text-white/60 text-sm mt-1">This will appear in your “See more” category pages</p>
              </div>

              {editingId && (
                <button onClick={resetForm} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
                  Cancel edit
                </button>
              )}
            </div>

            <div className="mt-5 grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Product title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Samsung Galaxy A14 (4GB/128GB)" />
              </div>

              <div>
                <label className="text-sm text-white/70">Product image (from device)</label>
                <input type="file" accept="image/*" className={inputClass} onChange={(e) => onPickImage(e.target.files?.[0] || null)} />
                <p className="mt-1 text-xs text-white/50">
                  {editingId ? "Select a new image only if you want to replace current one." : "Image is required for new product."}
                </p>
              </div>

              <div>
                <label className="text-sm text-white/70">Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className={inputClass} placeholder="52999" />
              </div>

              <div>
                <label className="text-sm text-white/70">Old price (optional)</label>
                <input type="number" value={oldPrice} onChange={(e) => setOldPrice(Number(e.target.value))} className={inputClass} placeholder="59999" />
              </div>

              <div>
                <label className="text-sm text-white/70">Badge (optional)</label>
                <input value={badge} onChange={(e) => setBadge(e.target.value)} className={inputClass} placeholder="Best Seller / Top Rated" />
              </div>

              <div>
                <label className="text-sm text-white/70">Rating (0 - 5)</label>
                <input type="number" step="0.1" value={rating} onChange={(e) => setRating(Number(e.target.value))} className={inputClass} placeholder="4.5" />
              </div>

              <div>
                <label className="text-sm text-white/70">Reviews (optional)</label>
                <input type="number" value={reviews} onChange={(e) => setReviews(Number(e.target.value))} className={inputClass} placeholder="3204" />
              </div>

              <div>
                <label className="text-sm text-white/70">Models (comma separated)</label>
                <input value={modelsText} onChange={(e) => setModelsText(e.target.value)} className={inputClass} placeholder="iPhone 13, A14, Redmi Note" />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-white/70">Colors (comma separated)</label>
                <input value={colorsText} onChange={(e) => setColorsText(e.target.value)} className={inputClass} placeholder="Black, Blue, Red" />
              </div>
            </div>

            <button
              onClick={submit}
              disabled={saving}
              className={`mt-5 w-full rounded-xl py-3 font-bold ${saving ? "bg-white/20 text-white/60" : "bg-white text-black hover:opacity-90"}`}
            >
              {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-bold">Live Preview</h3>
            <p className="text-white/60 text-sm mt-1">How it will look in the shop UI</p>

            <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-black/30">
              <div className="h-44 w-full bg-black/40 flex items-center justify-center">
                <img
                  src={preview.img}
                  alt="preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/900x600?text=No+Image";
                  }}
                />
              </div>

              <div className="p-4">
                {!!preview.badge && (
                  <div className="inline-block text-[11px] px-2 py-1 rounded-full bg-white text-black mb-2 font-semibold">
                    {preview.badge}
                  </div>
                )}

                <div className="font-semibold text-white line-clamp-2">{preview.title}</div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="text-lg font-extrabold text-white">{money(preview.price)}</div>
                  {!!preview.oldPrice && preview.oldPrice > 0 && (
                    <div className="text-sm text-white/40 line-through">{money(preview.oldPrice)}</div>
                  )}
                </div>

                {preview.rating || preview.reviews ? (
                  <div className="mt-2 flex items-center gap-2">
                    <Stars value={preview.rating || 0} />
                    <span className="text-xs text-white/60">
                      {(preview.rating || 0).toFixed(1)}
                      {preview.reviews ? ` (${Number(preview.reviews).toLocaleString()})` : ""}
                    </span>
                  </div>
                ) : null}

                <button className="mt-3 w-full rounded-xl bg-white text-black py-2 text-sm font-bold hover:opacity-90">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold">
                Products • <span className="text-white/70">{activeLabel}</span>
              </h2>
              <p className="text-white/60 text-sm mt-1">Edit or delete items in this category</p>
            </div>
            <div className="text-white/60 text-sm">{loading ? "Loading..." : `${filtered.length} item(s)`}</div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Badge</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!filtered.length ? (
                  <tr>
                    <td className="p-4 text-white/60" colSpan={5}>
                      No products in this category yet.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p._id} className="border-t border-white/10 hover:bg-white/[0.03]">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveImgUrl(p.img)}
                            className="h-10 w-10 rounded-lg object-cover border border-white/10"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/80?text=Img";
                            }}
                          />
                          <div>
                            <div className="font-semibold text-white">{p.title}</div>
                            <div className="text-xs text-white/50">{p._id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-white font-semibold">
                        {money(p.price)}
                        {p.oldPrice ? <span className="ml-2 text-white/40 line-through">{money(p.oldPrice)}</span> : null}
                      </td>

                      <td className="p-3 text-white/80">
                        {p.rating ? `${p.rating.toFixed(1)} ⭐` : "-"}
                        {p.reviews ? <span className="text-white/40"> ({p.reviews})</span> : null}
                      </td>

                      <td className="p-3 text-white/80">{p.badge || "-"}</td>

                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(p)} className="rounded-xl border border-white/10 px-3 py-2 text-white/80 hover:bg-white/10">
                            Edit
                          </button>
                          <button onClick={() => remove(p._id)} className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-200 hover:bg-red-500/20">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}