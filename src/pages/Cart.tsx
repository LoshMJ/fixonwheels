import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import CartCornerAnimation from "../components/ui/CartCornerAnimation";

export default function Cart() {
  const { items, changeQty, removeFromCart, clearCart } = useCart();

  // ✅ selection for calculating totals
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
  setSelectedIds(new Set(items.map((x) => x.cartItemId)));
}, [items]);

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedItems = useMemo(
    () => items.filter((x) => selectedIds.has(x.cartItemId)),
    [items, selectedIds]
  );

  const selectedCount = useMemo(
    () => selectedItems.reduce((sum, x) => sum + x.qty, 0),
    [selectedItems]
  );

  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, x) => sum + x.price * x.qty, 0),
    [selectedItems]
  );

  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map((x) => x.cartItemId)));
  };

  return (
    <div className="pt-24"> {/* ✅ pushes content below fixed navbar */}
      {/* your existing cart content */}
     <div className="relative">
    {/*animation in right corner */}
    <CartCornerAnimation />

    <div className="max-w-6xl mx-auto px-6 py-10 text-black">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cart</h1>
          <p className="text-sm text-gray-600 mt-1">
            Selected Items: <b>{selectedCount}</b> • Selected Total:{" "}
            <b>RS. {selectedTotal.toLocaleString()}</b>
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={() => {
            clearCart();
            setSelectedIds(new Set());
        }}
        className="btn-clear"            >
            Clear Cart
            </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-8 p-6 rounded-xl border bg-white">
          Cart is empty.
        </div>
      ) : (
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              <span>Select all</span>
            </div>

            {items.map((x) => (
              <div
                key={x.cartItemId}
                className="bg-white border rounded-xl p-4 flex gap-4"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(x.cartItemId)}
                  onChange={() => toggle(x.cartItemId)}
                  className="mt-2"
                />

                <img
                  src={x.image}
                  alt={x.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{x.title}</h3>

                      <div className="text-xs text-gray-600 mt-1">
                        <span className="mr-3">
                          Color: <b>{x.options.color}</b>
                        </span>
                        {x.options.model && (
                          <span>
                            Model: <b>{x.options.model}</b>
                          </span>
                        )}
                      </div>

                      <p className="mt-2 font-semibold text-purple-700">
                        RS. {x.price.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(x.cartItemId)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-sm text-gray-600">Qty</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={x.qty}
                      onChange={(e) =>
                        changeQty(x.cartItemId, Number(e.target.value))
                      }
                      className="w-20 border rounded-lg px-2 py-1"
                    />

                    <div className="ml-auto text-sm text-gray-700">
                      Subtotal: <b>RS. {(x.price * x.qty).toLocaleString()}</b>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white border rounded-xl p-5 h-fit mt-8">
            <h2 className="font-bold text-lg">Summary</h2>
            <div className="mt-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Selected items</span>
                <b>{selectedCount}</b>
              </div>
              <div className="flex justify-between">
                <span>Selected total</span>
                <b>RS. {selectedTotal.toLocaleString()}</b>
              </div>
            </div>

            <button
              disabled={selectedIds.size === 0}
              className={`mt-5 w-full py-2 rounded-lg text-sm font-medium transition ${
                selectedIds.size === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:opacity-90"
              }`}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
}