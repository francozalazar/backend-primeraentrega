import express from "express";
import ProductsContainer from "../classes/ProductsContainer.js";
import upload from "../services/upload.js";
import { io } from "../app.js";
import { authMiddleware } from "../utils.js";
const router = express.Router();
const contenedor = new ProductsContainer();
//GETS
router.get("/", (req, res) => {
  contenedor.getAll().then((result) => {
    res.send(result);
  });
});

router.get("/:pid", (req, res) => {
  let id = parseInt(req.params.pid);
  contenedor.getById(id).then((result) => {
    res.send(result);
  });
});
//POST
router.post("/", /* upload.single("foto"), */ authMiddleware, (req, res) => {
  // let file = req.file;
  let product = req.body;
  console.log("producto", product);
  product.precio = parseInt(product.precio);
  product.timestamp = Date.now();
  product.stock = parseInt(product.stock);
  product.codigo = parseInt(product.codigo);
  product.foto = product.foto;
  // req.protocol + "://" + req.hostname + ":8080" + "/images/" + file.filename;
  contenedor.save(product).then((result) => {
    res.send(result);
    if (result.status === "success") {
      contenedor.getAll().then((result) => {
        io.emit("updateProducts", result);
      });
    }
  });
});
//PUT
router.put(
  "/:pid",
  /*  upload.single("image"), */ authMiddleware,
  (req, res) => {
    // let file = req.file;
    let product = req.body;
    let id = parseInt(req.params.pid);
    product.foto = product.foto;
    product.timestamp = Date.now();
    // req.protocol +
    // "://" +
    // req.hostname +
    // ":8080" +
    // "/images/" +
    // file.filename;
    contenedor.update(id, product).then((result) => {
      res.send(result);
    });
  }
);
//DELETE
router.delete("/:pid", authMiddleware, (req, res) => {
  let id = parseInt(req.params.pid);
  contenedor.deleteById(id).then((result) => {
    res.send(result);
  });
});

export default router;