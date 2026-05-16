import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { bodyParser } from "../utility/bodyParser";
import { sendResponse } from "../utility/sendResponse";

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
    try {
      return sendResponse(
        res,
        200,
        true,
        "Product retrived successfully",
        products,
      );
    } catch (error) {
      console.log(error);
      return sendResponse(res, 400, false, "Something went wrong!");
    }
  }
  // get single product
  else if (method === "GET" && id) {
    const products = readProduct();
    const product = products.find((p: IProduct) => p?.id === id) ?? [];

    try {
      return sendResponse(
        res,
        200,
        true,
        "Product retrived successfully",
        product,
      );
    } catch (error) {
      console.log(error);
      return sendResponse(res, 400, false, "Something went wrong!");
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
    try {
      if (products) {
        return sendResponse(
          res,
          200,
          true,
          "Product added succcessfully",
          newProduct,
        );
      } else {
        return sendResponse(res, 400, false, "Product add failed!");
      }
    } catch (error) {
      console.log(error);
      return sendResponse(res, 400, false, "Something went wrong!");
    }
  }
  // update product
  else if (method === "PUT" && id) {
    const body = await bodyParser(req);
    const products = readProduct();
    const getIndexbyId = products.findIndex(
      (product: IProduct) => product.id === id,
    );

    try {
      if (getIndexbyId < 0) {
        return sendResponse(res, 404, false, "No product found with this id!");
      } else {
        products[getIndexbyId] = { ...products[getIndexbyId], ...body };
        insertProduct(products);
        return sendResponse(
          res,
          200,
          true,
          "Product update successfully",
          products[getIndexbyId],
        );
      }
    } catch (error) {
      console.log(error);
      return sendResponse(res, 400, false, "Something went wrong!");
    }
  }
  // Delete product
  else if (method === "DELETE" && id) {
    const products = readProduct();
    const isExist = products.find((p: IProduct) => p.id === id);
    try {
      if (isExist) {
        const updatedProducts = products.filter(
          (product: IProduct) => product.id !== id,
        );
        insertProduct(updatedProducts);
        return sendResponse(res, 200, true, "Product delete successfully");
      } else {
        return sendResponse(res, 404, false, "Product not found!");
      }
    } catch (error) {
      console.log(error);
      return sendResponse(res, 400, false, "Something went wrong!");
    }
  }
};
