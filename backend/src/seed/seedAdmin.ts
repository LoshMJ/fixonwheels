import bcrypt from "bcryptjs";
import { User } from "../models/User";

export async function seedAdmin() {
  const ADMIN_EMAIL = "admin@fixonwheels.com";
  const ADMIN_PASSWORD = "Admin@12345"; // change later

  const exists = await User.findOne({ email: ADMIN_EMAIL });
  if (exists) {
    console.log("✅ Admin already exists");
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await User.create({
    name: "Admin",
    email: ADMIN_EMAIL,
    password: hashed,
    role: "admin",
  });

  console.log("✅ Admin created:", ADMIN_EMAIL);
}