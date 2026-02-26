import bcrypt from "bcryptjs";
import { User } from "../models/User";

export async function seedAdmin() {
  try {
    const ADMIN_EMAIL = "admin@fixonwheels.com";
    const ADMIN_PASSWORD = "Admin@12345"; 

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      // ✅ Update existing admin password 
      existingAdmin.password = hashed;
      existingAdmin.role = "admin"; 
      await existingAdmin.save();

      console.log("✅ Admin password updated:", ADMIN_EMAIL);
      return;
    }

    // ✅ Create admin if not exists
    await User.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: hashed,
      role: "admin",
    });

    console.log("✅ Admin created:", ADMIN_EMAIL);
  } catch (err: any) {
    console.error("❌ seedAdmin error:", err?.message || err);
  }
}