import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAllSlugs } from "./pages";
import { buildCanonical, pagePath, SITE_URL } from "./metadata";

describe("canonical URLs match trailingSlash: true", () => {
  it("apex origin has no trailing slash", () => {
    assert.equal(SITE_URL.endsWith("/"), false);
    assert.match(SITE_URL, /^https:\/\/paychecklink\.com$/);
  });

  it("buildCanonical always ends with a slash", () => {
    assert.equal(buildCanonical(""), "https://paychecklink.com/");
    assert.equal(buildCanonical("states"), "https://paychecklink.com/states/");
    assert.equal(
      buildCanonical("/california-paycheck-calculator/"),
      "https://paychecklink.com/california-paycheck-calculator/"
    );
  });

  it("pagePath normalizes extra slashes", () => {
    assert.equal(pagePath(""), "/");
    assert.equal(pagePath("/about"), "/about/");
    assert.equal(pagePath("about/"), "/about/");
  });

  it("every sitemap loc (home, hubs, slugs) uses trailing slash on the apex host", () => {
    const slugs = [
      "",
      "states",
      "countries",
      "methodology",
      "about",
      "privacy",
      ...getAllSlugs(),
    ];
    assert.ok(slugs.length > 50);
    for (const slug of slugs) {
      const url = buildCanonical(slug);
      assert.match(url, /^https:\/\/paychecklink\.com\/.*\/$/);
      assert.equal(url.includes("www."), false);
    }
    assert.equal(buildCanonical(""), "https://paychecklink.com/");
    assert.equal(
      buildCanonical("california-paycheck-calculator"),
      "https://paychecklink.com/california-paycheck-calculator/"
    );
  });
});
