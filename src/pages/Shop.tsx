import PopularItems from "../components/shop/PopularItems";
import Shopsec2 from "../components/shop/Shopsec2";
import ShopHero from "../components/shop/ShopHero";
import Shopsec4 from "../components/shop/Shopsec4";
import Products from "../components/shop/Products";

export default function Shop() {
  return (
    <>
      <ShopHero />
      <Shopsec2 />
            <PopularItems />

      <Shopsec4 />
      <Products />
    </>
  );
}

