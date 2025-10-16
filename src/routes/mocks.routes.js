import { Router } from "express";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Pet from "../models/Pet.js";

const router = Router();

const mockObjectId = () => faker.database.mongodbObjectId();

router.get("/mockingpets", (req, res) => {
  const pets = Array.from({ length: 50 }, () => ({
    _id: mockObjectId(),
    name: faker.animal.type() + " " + faker.word.noun(),
    species: faker.helpers.arrayElement(["dog", "cat", "bird", "fish"]),
    age: faker.number.int({ min: 1, max: 15 }),
  }));
  res.json({ status: "success", payload: pets });
});

router.get('/mockingusers', (req, res) => {
  const users = Array.from({ length: 50 }, () => ({
    _id: mockObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 80 }),
    password: bcrypt.hashSync('coder123', 10),
    role: faker.helpers.arrayElement(['user', 'admin']),
    pets: []
  }))
  res.json({ status: 'success', payload: users })
})

router.post("/generateData", async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body ?? {};

    const usersCount = Number(users) >= 0 ? Math.floor(Number(users)) : 0;
    const petsCount = Number(pets) >= 0 ? Math.floor(Number(pets)) : 0;

    const fakeUsers = Array.from({ length: usersCount }, () => ({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 80 }),
      password: bcrypt.hashSync("coder123", 10),
      role: faker.helpers.arrayElement(["user", "admin"]),
      pets: [],
    }));

    const fakePets = Array.from({ length: petsCount }, () => ({
      name: faker.helpers.arrayElement([
        faker.animal.dog(),
        faker.animal.cat(),
        faker.animal.bird(),
        faker.animal.fish(),
      ]),
      species: faker.helpers.arrayElement(["dog", "cat", "bird", "fish"]),
      age: faker.number.int({ min: 1, max: 20 }),
    }));

    const inserted = {};
    if (fakeUsers.length > 0) {
      const createdUsers = await User.insertMany(fakeUsers);
      inserted.users = createdUsers.length;
    } else inserted.users = 0;

    if (fakePets.length > 0) {
      const createdPets = await Pet.insertMany(fakePets);
      inserted.pets = createdPets.length;
    } else inserted.pets = 0;

    return res.json({
      status: "success",
      message: "Datos generados e insertados correctamente",
      inserted,
    });
  } catch (err) {
    console.error("Error generateData:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
