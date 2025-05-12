/* eslint-disable no-undef */
// unit.test.js

import { add, subtract, multiply, divide } from "../source/test-script.js";

test("should test add", () => {
  expect(add(2, 4)).toBe(6);
});

test("should test subtract", () => {
  expect(subtract(2, 2)).toBe(0);
});

test("should test multiply", () => {
  expect(multiply(2, 2)).toBe(4);
});

test("should test divide", () => {
  expect(divide(2, 2)).toBe(1);
});
