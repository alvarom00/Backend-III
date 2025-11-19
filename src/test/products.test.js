import { expect } from "chai";
import supertest from "supertest";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import app from "../app.js";

const requester = supertest(app);

describe("TEST FUNCIONALES - PRODUCTS", () => {
  let cookie = null;
  let createdProductId = null;

  before(async () => {
    await User.deleteMany({});
    await Cart.deleteMany({});

    const regRes = await requester.post("/api/sessions/register").send({
      first_name: "Rodrigo",
      last_name: "Garcia",
      email: "admin1@example.com",
      age: 30,
      password: "loquesea",
      role: "admin",
    });

    console.log("REGISTER RESPONSE:", regRes.statusCode, regRes.body);

    const loginRes = await requester
      .post("/api/sessions/login")
      .send({ email: "admin1@example.com", password: "loquesea" });

    console.log("LOGIN RESPONSE:", loginRes.statusCode, loginRes.body);

    expect(loginRes.statusCode).to.equal(200);

    cookie = loginRes.headers["set-cookie"][0].split(";")[0];
  });

  it("GET /api/products debe devolver un objeto paginado", async () => {
    const res = await requester.get("/api/products");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("object");
    expect(res.body.payload).to.be.an("array");
  });

  it("POST /api/products debe crear un producto", async () => {
    const mockProduct = {
      title: "Producto test",
      description: "Descripción test",
      price: 999,
      stock: 5,
      category: "test",
    };

    const res = await requester
      .post("/api/products")
      .set("Cookie", cookie)
      .send(mockProduct);

    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload).to.be.an("object");
    expect(res.body.payload._id).to.exist;

    createdProductId = res.body.payload._id;
  });

  it("GET /api/products/:id debe devolver el producto creado", async () => {
    const res = await requester.get(`/api/products/${createdProductId}`);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload).to.be.an("object");
    expect(res.body.payload._id).to.equal(createdProductId);
  });

  it("PUT /api/products/:id debe actualizar el producto", async () => {
    const res = await requester
      .put(`/api/products/${createdProductId}`)
      .set("Cookie", cookie)
      .send({ price: 1234 });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload.price).to.equal(1234);
  });

  it("DELETE /api/products/:id debe borrar el producto", async () => {
    const res = await requester
      .delete(`/api/products/${createdProductId}`)
      .set("Cookie", cookie);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Producto eliminado");
  });
});
