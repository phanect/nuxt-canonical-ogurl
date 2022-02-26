"use strict";

const { expect } = require("@jest/globals");
const { readFile } = require("fs/promises");
const { JSDOM } = require("jsdom");
const { Nuxt, Builder, Generator } = require("nuxt");
const { join } = require("path");

const nuxtConfigBase = {
  target: "static",
  components: true,
  modern: "client",

  head: {
    title: "test",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
  },

  buildModules: [
    require("../libs/module.js"),
  ],

  canonicalOgUrl: {
    baseURL: "https://example.com",
  },
};

async function generate(config) {
  const nuxt = new Nuxt(config);
  const builder = new Builder(nuxt);
  const generator = new Generator(nuxt, builder);
  const { errors } = await generator.generate();

  if (0 < errors.length) {
    throw errors[0].error;
  }
}

async function extractCanonicalAndOgUrl(filepath) {
  const html = await readFile(filepath, "utf8");
  const { window } = new JSDOM(html);

  return {
    canonical: window.document.head.querySelector("link[rel='canonical']").href,
    ogUrl: window.document.head.querySelector("meta[property='og:url']").content,
  };
}

test("if canonical & og:url are generated properly when trailingSlash: true", async () => {
  await generate({
    ...nuxtConfigBase,

    srcDir: join(__dirname, "fixtures/basic/"),
    generate: {
      dir: join(__dirname, "fixtures/basic/dist/"),
    },

    router: {
      trailingSlash: true,
    },
  });

  const {
    canonical: canonicalIndex,
    ogUrl: ogUrlIndex,
  } = await extractCanonicalAndOgUrl(join(__dirname, "fixtures/basic/dist/index.html"));

  expect(canonicalIndex).toBe("https://example.com/");
  expect(ogUrlIndex).toBe("https://example.com/");

  const {
    canonical: canonicalSubPage,
    ogUrl: ogUrlSubPage,
  } = await extractCanonicalAndOgUrl(join(__dirname, "fixtures/basic/dist/subpage/index.html"));

  expect(canonicalSubPage).toBe("https://example.com/subpage/");
  expect(ogUrlSubPage).toBe("https://example.com/subpage/");
}, 50000);

test("if canonical & og:url are generated properly when trailingSlash: false", async () => {
  await generate({
    ...nuxtConfigBase,

    srcDir: join(__dirname, "fixtures/basic/"),
    generate: {
      dir: join(__dirname, "fixtures/basic/dist/"),
    },

    router: {
      trailingSlash: false,
    },
  });

  const {
    canonical: canonicalIndex,
    ogUrl: ogUrlIndex,
  } = await extractCanonicalAndOgUrl(join(__dirname, "fixtures/basic/dist/index.html"));

  expect(canonicalIndex).toBe("https://example.com/"); // slash appended on index page even trailingSlash: false
  expect(ogUrlIndex).toBe("https://example.com");

  const {
    canonical: canonicalSubPage,
    ogUrl: ogUrlSubPage,
  } = await extractCanonicalAndOgUrl(join(__dirname, "fixtures/basic/dist/subpage/index.html"));

  expect(canonicalSubPage).toBe("https://example.com/subpage");
  expect(ogUrlSubPage).toBe("https://example.com/subpage");
}, 50000);

test("if error raised when trailingSlash is not specified", async () => {
  await expect(async () => {
    await generate({
      ...nuxtConfigBase,

      srcDir: join(__dirname, "fixtures/basic/"),
      generate: {
        dir: join(__dirname, "fixtures/basic/dist/"),
      },
    });
  }).rejects.toThrow("router.trailingSlash must be specified in nuxt.config.js to use enable nuxt-canonical-ogurl.");
}, 50000);

test("if error raised when baseURL is not specified", async () => {
  delete nuxtConfigBase.canonicalOgUrl.baseURL;

  await expect(async () => {
    await generate({
      ...nuxtConfigBase,

      srcDir: join(__dirname, "fixtures/basic/"),
      generate: {
        dir: join(__dirname, "fixtures/basic/dist/"),
      },

      router: {
        trailingSlash: false,
      },
    });
  }).rejects.toThrow("canonicalOgUrl.baseURL must be specified in nuxt.config.js to use enable nuxt-canonical-ogurl.");
}, 50000);

test("if error raised when canonical is manually specified in nuxt.config.js", async () => {
  await expect(async () => {
    await generate({
      ...nuxtConfigBase,

      srcDir: join(__dirname, "fixtures/basic/"),
      generate: {
        dir: join(__dirname, "fixtures/basic/dist/"),
      },

      head: {
        link: [
          { rel: "canonical", href: "https://example.com/" },
        ],
      },

      router: {
        trailingSlash: true,
      },
    });
  }).rejects.toThrow("Canonical tag should not be inserted manually. nuxt-canonical-ogurl would insert it automatically.");
}, 50000);

test("if error raised when og:url is manually specified in nuxt.config.js", async () => {
  await expect(async () => {
    await generate({
      ...nuxtConfigBase,

      srcDir: join(__dirname, "fixtures/basic/"),
      generate: {
        dir: join(__dirname, "fixtures/basic/dist/"),
      },

      head: {
        meta: [
          { hid: "og:url", property: "og:url", content: "https://example.com/" },
        ],
      },

      router: {
        trailingSlash: true,
      },
    });
  }).rejects.toThrow("og:url should not be inserted manually. nuxt-canonical-ogurl would insert it automatically.");
}, 50000);
