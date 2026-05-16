import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { bodyParser } from "../utility/bodyParser";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;
  const id = url?.startsWith("/products") ? Number(url.split("/")[2]) : null;

  //get all product
  if (method === "GET" && !id) {
    const products = readProduct();
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "products retrived succcessfully",
        data: products,
      }),
    );
  }
  // get single product
  else if (method === "GET" && id) {
    const products = readProduct();
    const product = products.find((p: IProduct) => p?.id === id) ?? [];
    if (!!product) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "product not found",
          data: [],
        }),
      );
    } else {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "product retrived succcessfully",
          data: product,
        }),
      );
    }
  }
  // add product
  else if (method === "POST") {
    const body = await bodyParser(req);
    const newProduct: IProduct = {
      id: Date.now(),
      ...body,
    };
    const products = readProduct();
    products.push(newProduct);
    insertProduct(products);
    if (products) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "products added succcessfully",
          data: products,
        }),
      );
    } else {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "products add failed",
          data: [],
        }),
      );
    }
  }
  // update product
  else if (method === "PUT" && id) {
    const body = await bodyParser(req);
    const products = readProduct();
    const getIndexbyId = products.findIndex(
      (product: IProduct) => product.id === id,
    );

    if (getIndexbyId < 0) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "no product found with this id",
          data: [],
        }),
      );
    } else {
      products[getIndexbyId] = { ...products[getIndexbyId], ...body };
      insertProduct(products);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "products updated",
          data: products,
        }),
      );
    }
  }
  // Delete product
  else if (method === "DELETE" && id) {
    const products = readProduct();
    const isExist = products.find((p: IProduct) => p.id === id);
    if (isExist) {
      const updatedProducts = products.filter(
        (product: IProduct) => product.id !== id,
      );
      insertProduct(updatedProducts);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "product deleted successfully",
          data: updatedProducts,
        }),
      );
    } else {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "product not found",
          data: [],
        }),
      );
    }
  }
};
