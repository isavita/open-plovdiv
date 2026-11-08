import { strict as assert } from "node:assert";
import { test } from "node:test";
import { isSourceImageFilename, preserveSourceImageFilenames } from "./translation_guards.mjs";

test("preserves literal image filenames without converting translated provenance prose", () => {
  const filename = "Wikimedia Commons — 0530 Вид на улицу, январь 1878.jpg";
  const prose = "Media for landmark: Old Town.jpg";
  const translations = { [filename]: "Incorrectly translated filename", [prose]: "Traduit : Old Town.jpg" };
  preserveSourceImageFilenames(translations);
  assert.equal(translations[filename], filename);
  assert.equal(translations[prose], "Traduit : Old Town.jpg");
  assert.equal(isSourceImageFilename("A caption. An image.jpg"), false);
  assert.equal(isSourceImageFilename("An image.JPG"), true);
  assert.equal(isSourceImageFilename("File:Old town3.jpg"), true);
});
