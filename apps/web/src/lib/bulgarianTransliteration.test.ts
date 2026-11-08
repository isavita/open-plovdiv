import { describe, expect, it } from "vitest";
import { englishBulgarianAddress, englishBulgarianName, romanizeBulgarian } from "./bulgarianTransliteration";

describe("Bulgarian details on English pages", () => {
  it("transliterates architect names while preserving the original", () => {
    expect(englishBulgarianName("Георги Фингов")).toBe("Georgi Fingov (Bulgarian: Георги Фингов)");
    expect(englishBulgarianName("Петко Боз")).toBe("Petko Boz (Bulgarian: Петко Боз)");
    expect(englishBulgarianName("Georgi Fingov")).toBe("Georgi Fingov");
  });

  it("keeps the source address intact and renders a readable Latin-script form", () => {
    const original = 'ул. "Цар Ивайло" № 2А, град Пловдив';
    expect(englishBulgarianAddress(original)).toBe('Street "Tsar Ivaylo" № 2A, city of Plovdiv (Bulgarian: ' + original + ")");
    const boulevard = 'бул. "Цар Борис III Обединител"';
    expect(englishBulgarianAddress(boulevard)).toBe('Boulevard "Tsar Boris III Obedinitel" (Bulgarian: ' + boulevard + ")");
    expect(englishBulgarianAddress("Старинен Пловдив")).toBe("Old Plovdiv (Bulgarian: Старинен Пловдив)");
    expect(englishBulgarianAddress("15 Main Street")).toBe("15 Main Street");
    expect(romanizeBulgarian("Шести септември")).toBe("Shesti septemvri");
  });
});
