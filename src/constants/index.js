import path from "node:path";

export const SORT_ORDER = ["asc", "desc"];

export const SMTP = {
  HOST: process.env.SMTP_HOST,
  PORT: process.env.SMTP_PORT,
  USER: process.env.SMTP_USER,
  PASSWORD: process.env.SMTP_PASSWORD,
  FROM_EMAIL: process.env.SMTP_FROM,
};

export const TEMPLATES_DIR = path.join(process.cwd(), "src", "templates");

export const TEMP_UPLOAD_DIR = path.resolve("temp");

export const UPLOAD_DIR = path.resolve("uploads");
