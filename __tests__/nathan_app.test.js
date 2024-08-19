const request = require("supertest");
const data = require("../db/data/test-data");
const { seed } = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const { terminate } = require("firebase/firestore");
const app = require("../api/app.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return terminate(db);
});

describe("/api/recipes/:recipe_id", () => {
  describe("GET", () => {
    it("200: returns specified recipe", () => {
      const id = 0;
      return request(app)
        .get(`/api/recipes/${id}`)
        .expect(200)
        .then(({ body: { recipe } }) => {
          const {
            recipe_id,
            cook_time,
            ingredients,
            instructions,
            prep_time,
            recipe_name,
          } = recipe;
          expect(recipe_id).toBe("0");
          expect(cook_time).toBe(102);
          expect(typeof ingredients).toBe("string");
          expect(typeof instructions).toBe("string");
          expect(prep_time).toBe(92);
          expect(recipe_name).toBe("Rev");
        });
    });
    it("404: returns not found when recipe id doesn't exist", () => {
      return request(app)
        .get("/api/recipes/2000")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Recipe not found.");
        });
    });
  });
  describe("PATCH", () => {
    it("200: returns the recipe after being edited", () => {
      const id = 0;
      const patchInfo = { cook_time: 100 };
      return request(app)
        .patch(`/api/recipes/${id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { recipe } }) => {
          const {
            recipe_id,
            cook_time,
            ingredients,
            instructions,
            prep_time,
            recipe_name,
          } = recipe;
          expect(recipe_id).toBe("0");
          expect(typeof cook_time).toBe("number");
          expect(typeof ingredients).toBe("string");
          expect(typeof instructions).toBe("string");
          expect(typeof prep_time).toBe("number");
          expect(typeof recipe_name).toBe("string");
        });
    });
    it("200: patch cook_time", () => {
      const id = 0;
      const patchInfo = { cook_time: 100 };
      return request(app)
        .patch(`/api/recipes/${id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { recipe } }) => {
          const { recipe_id, cook_time } = recipe;
          expect(recipe_id).toBe("0");
          expect(cook_time).toBe(100);
        });
    });
    it("200: patch ingredients", () => {
      const id = 0;
      const patchInfo = { ingredients: "eggs" };
      return request(app)
        .patch(`/api/recipes/${id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { recipe } }) => {
          const { recipe_id, ingredients } = recipe;
          expect(recipe_id).toBe("0");
          expect(ingredients).toBe("eggs");
        });
    });
    it("200: patch instructions", () => {
      const id = 0;
      const patchInfo = { instructions: "whisk the eggs" };
      return request(app)
        .patch(`/api/recipes/${id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { recipe } }) => {
          const { recipe_id, instructions } = recipe;
          expect(recipe_id).toBe("0");
          expect(instructions).toBe("whisk the eggs");
        });
    });
    it("200: patch prep_time", () => {
      const id = 0;
      const patchInfo = { prep_time: 60 };
      return request(app)
        .patch(`/api/recipes/${id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { recipe } }) => {
          const { recipe_id, prep_time } = recipe;
          expect(recipe_id).toBe("0");
          expect(prep_time).toBe(60);
        });
    });
    it("200: patch recipe_name", () => {
      const id = 0;
      const patchInfo = { recipe_name: "Scrambled eggs" };
      return request(app)
        .patch(`/api/recipes/${id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { recipe } }) => {
          const { recipe_id, recipe_name } = recipe;
          expect(recipe_id).toBe("0");
          expect(recipe_name).toBe("Scrambled eggs");
        });
    });
    it("200: patch any number of elements simultaneously", () => {
      const id = 0;
      const patchInfo = { cook_time: 15, recipe_name: "Scrambled eggs" };
      return request(app)
        .patch(`/api/recipes/${id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { recipe } }) => {
          const { recipe_id, cook_time, recipe_name } = recipe;
          expect(recipe_id).toBe("0");
          expect(cook_time).toBe(15);
          expect(recipe_name).toBe("Scrambled eggs");
        });
    });
    it("400: refuses any keys not greenlisted", () => {
      const id = 0;
      const patchInfo = { cook_time: 15, name: "Scrambled eggs" };
      return request(app)
        .patch(`/api/recipes/${id}`)
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request - invalid key on object.");
        });
    });
    it("400: responds bad request when no patch info given", () => {
      const id = 0;
      const patchInfo = {};
      return request(app)
        .patch(`/api/recipes/${id}`)
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request - no key on object.");
        });
    });
  });
});
