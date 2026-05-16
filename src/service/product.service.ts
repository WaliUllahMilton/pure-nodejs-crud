import fs from "fs";
import path from "path";
import type { IProduct } from "../types/product.type";

const filePath = path.join(process.cwd(), "./src/database/db.json");

export const readProduct = () => {
  const products = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(products);
};

export const insertProduct = (payload: IProduct[]) => {
  return fs.writeFileSync(filePath, JSON.stringify(payload));
};
