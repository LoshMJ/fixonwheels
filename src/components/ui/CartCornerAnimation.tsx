import phoneImg from "../../assets/anim/iphone2.png";
import repairmanImg from"../../assets/anim/astronaut.png";

export default function CartCornerAnimation() {
  return (
    <div className="cart-anim-wrap" aria-hidden="true">
      {/* Phone image */}
      <img className="phone-img" src={phoneImg} alt="" />

      {/* Crack flash (optional) */}
      <div className="crack-flash" />

       {/* Shards (CSS shapes) */}
      <div className="splash">
        <span className="shard s1" />
        <span className="shard s2" />
        <span className="shard s3" />
        <span className="shard s4" />
      </div>

       {/* Repairman image */}
      <img className="repairman-img" src={repairmanImg} alt="" />
    </div>
  );
}