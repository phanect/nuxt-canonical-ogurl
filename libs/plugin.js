"use strict";

const baseURL = "<%= options.baseURL %>";
const trailingSlashStr = "<%= options.trailingSlash %>";
let trailingSlash;

module.exports = function({ app, route }) {
  if (app.head.link.find(link => link.rel === "canonical")) {
    throw new Error("Canonical tag should not be inserted manually. nuxt-canonical-ogurl would insert it automatically.");
  }

  if (app.head.meta.find(meta => meta.property === "og:url")) {
    throw new Error("og:url should not be inserted manually. nuxt-canonical-ogurl would insert it automatically.");
  }

  if (!baseURL) {
    throw new Error("canonicalOgUrl.baseURL must be specified in nuxt.config.js to use enable nuxt-canonical-ogurl.");
  }

  if (trailingSlashStr === "true") {
    trailingSlash = true;
  } else if (trailingSlashStr === "false") {
    trailingSlash = false;
  } else {
    throw new Error("router.trailingSlash must be specified in nuxt.config.js to use enable nuxt-canonical-ogurl.");
  }

  const canonical = baseURL.replace(/\/$/, "")
      + route.path.replace(/\/$/, "")
      + (trailingSlash ? "/" : "");

  app.head.link.push({ rel: "canonical", href: canonical });
  app.head.meta.push({ hid: "og:url", property: "og:url", content: canonical });
};
