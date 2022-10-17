import fs from "fs";
import __dirname from "../utils.js";
import ProductContainer from "./ProductsContainer.js";

const cartURL = __dirname + "/files/cart.txt";
const productContainer = new ProductContainer();
class CartContainer {
  async save(product) {
    let idAsignado = 0;
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      let carts = JSON.parse(data);

      let cart = {
        id: carts[carts.length - 1].id + 1,
        timestamp: Date.now(),
        products: [],
      };
      carts.push(cart);
      try {
        await fs.promises.writeFile(cartURL, JSON.stringify(carts, null, 2));
        idAsignado = cart.id;
        return {
          status: "success",
          message: "Carrito añadido exitosamente. ID: " + idAsignado,
        };
      } catch (error) {
        return {
          status: "error",
          message: "Error al intentar crear el carrito: " + error,
        };
      }
    } catch {
      let cart = [
        {
          id: 1,
          timestamp: Date.now(),
          products: [],
        },
      ];
      try {
        await fs.promises.writeFile(cartURL, JSON.stringify(cart, null, 2));
        return {
          status: "success",
          message: "Carrito añadido exitosamente. ID: 1",
        };
      } catch (error) {
        console.log(error);
        return {
          status: "error",
          message: "Error al intentar crear el carrito:" + error,
        };
      }
    }
  }
  async addProducts(cartId, productsID) {
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      let carts = JSON.parse(data);
      console.log("productsID", productsID);
      let productsForId = await productContainer
        .getByIds(productsID)
        .then((result) => {
          return result.products;
        });
      console.log("products provide", productsForId);
      if (!carts.some((cart) => cart.id === cartId))
        return {
          status: "error",
          message: "Ningún carrito con el id especificado",
        };
      let result = carts.map((c) => {
        if (c.id === cartId) {
          let cartWithProducts = Object.assign({
            id: c.id,
            timestamp: c.timestamp,
            products: productsForId,
          });
          return cartWithProducts;
        } else {
          return c;
        }
      });
      try {
        await fs.promises.writeFile(cartURL, JSON.stringify(result, null, 2));
        return {
          status: "success",
          message: "Productos agregados",
          productsForId,
        };
      } catch {
        return { status: "error", message: "Error al agregar productos" };
      }
    } catch (error) {
      return {
        status: "error",
        message: "Fallo al actualizar el producto: " + error,
      };
    }
  }
  async getProductsInCartById(cartId) {
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      let carts = JSON.parse(data);
      let cart = carts.find((cart) => cart.id === cartId);
      return cart
        ? { status: "success", products: cart.products }
        : { status: "error", product: null };
    } catch (error) {
      return {
        status: "error",
        message: "Error al buscar el producto: " + error,
      };
    }
  }
  async deleteById(id) {
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      let carts = JSON.parse(data);
      let cartsAux = carts.filter((crt) => crt.id !== id);
      try {
        await fs.promises.writeFile(cartURL, JSON.stringify(cartsAux, null, 2));
        return {
          status: "success",
          message: "Carrito eliminado exitosamente",
        };
      } catch (error) {
        return {
          status: "error",
          message: "Error al intentar eliminar el carrito: " + error,
        };
      }
    } catch (error) {
      return {
        status: "error",
        message: "Error: " + error,
      };
    }
  }
  async deleteProductById(cartId, productId) {
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      let carts = JSON.parse(data);

      if (productId === undefined) {
        return { error: "empty_id", description: "No se envió ningún id" };
      }

      let cart = carts.find((element) => element.id == cartId);
      cart.products = cart.products.filter(
        (product) => product.id != productId
      );
      try {
        await fs.promises.writeFile(cartURL, JSON.stringify(carts, null, 2));
        return {
          status: "success",
          message: "Producto eliminado exitosamente",
        };
      } catch (error) {
        return {
          status: "error",
          message: "Error al intentar eliminar el producto: " + error,
        };
      }
    } catch (error) {
      return {
        status: "error",
        message: "Error: " + error,
      };
    }
  }
  async deleteAll() {
    await fs.promises.writeFile(cartURL, JSON.stringify([]));
  }
}

export default CartContainer;