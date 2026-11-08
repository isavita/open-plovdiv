import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import people from "../../../../data/generated/history-knowledge/people.json";
import { featuredPortraitDerivative } from "./featuredPortraits";

describe("featured portrait derivatives", () => {
  it("uses local images only for matching sources with available credit and licence", () => {
    for (const id of ["person-hristo-stoichkov-q187125", "person-sonya-yoncheva-q3490781", "person-boris-christoff-q362106", "person-yordan-yovchev-q887271"]) {
      const person = people.find((entry) => entry.id === id)!;
      expect(person.image_credit, id).toBeTruthy();
      expect(person.image_license, id).toBeTruthy();
      expect(person.image_license_url, id).toMatch(/^https:\/\/creativecommons\.org\//);
      expect(person.image_page_url, id).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
      const derivative = featuredPortraitDerivative(id, person.image!);
      expect(derivative, id).not.toBeNull();
      for (const image of [derivative!.small, derivative!.large]) {
        expect(existsSync(resolve(process.cwd(), "public", `.${image}`)), image).toBe(true);
      }
      expect(featuredPortraitDerivative(id, "https://example.org/changed.jpg"), id).toBeNull();
    }
  });
});
