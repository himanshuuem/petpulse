import { test } from "node:test";
import assert from "node:assert/strict";
import { PETS, ageGroup, formatAge, filterPets } from "./pets.js";

test("ageGroup buckets ages", () => {
  assert.equal(ageGroup(0.8), "young");
  assert.equal(ageGroup(4), "adult");
  assert.equal(ageGroup(9), "senior");
});

test("formatAge shows months under one year", () => {
  assert.equal(formatAge(0.5), "6 months");
  assert.equal(formatAge(1), "1 year");
});

test("filterPets combines filters", () => {
  const result = filterPets(PETS, { species: "dog", age: "all", kids: true });
  assert.ok(result.length > 0);
  assert.ok(result.every((p) => p.species === "dog" && p.kids));
});
