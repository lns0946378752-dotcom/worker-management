import bcrypt from "bcryptjs";

import { sequelize, User } from "../models/index.js";

const fullName = process.env.ADMIN_NAME;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const resetPassword = process.argv.includes("--reset-password");

if (!email || !password || password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
  throw new Error("Cần cấu hình ADMIN_EMAIL và mật khẩu Admin dài từ 12 ký tự, tối đa 72 byte.");
}

try {
  await sequelize.authenticate();
  if (resetPassword) {
    const user = await User.findOne({ where: { email } });
    if (!user || user.role !== "admin") {
      throw new Error("Không tìm thấy tài khoản Admin tương ứng; không có dữ liệu nào được thay đổi.");
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    await user.save({ fields: ["passwordHash"] });
    console.info("Đã đặt lại mật khẩu cho tài khoản Admin đã cấu hình.");
  } else {
    if (!fullName?.trim()) {
      throw new Error("Cần cấu hình ADMIN_NAME khi tạo mới tài khoản Admin.");
    }

    const [, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        fullName: fullName.trim(),
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: "admin",
      },
    });

    if (!created) {
      throw new Error("Tài khoản theo ADMIN_EMAIL đã tồn tại; không thay đổi vai trò hay mật khẩu.");
    }

    console.info("Đã tạo tài khoản Admin.");
  }
} catch (error) {
  console.error("Không thể cập nhật tài khoản Admin.", error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
