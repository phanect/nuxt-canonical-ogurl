# nuxt-canonical-ogurl

A Nuxt module to automatically generate canonical and og:url meta tags

# Set up

1. Add `nuxt-canonical-ogurl` to the dependency in your project

```shell
$ npm install nuxt-canonical-ogurl
```

or

```shell
$ yarn add nuxt-canonical-ogurl
```

2. Add `nuxt-canonical-ogurl` to `buildModules` in nuxt.config.js, then configure options

```javascript
export default {
  // ...
  buildModules: [
    "nuxt-canonical-ogurl",
  ],
  canonicalOgUrl: {
    baseURL: "https://example.com",
  },
  // You need to set router.trailingSlash true or false to use this module
  router: {
    trailingSlash: true,
  },
}
```

To complete set up `nuxt-canonical-ogurl`, you need to set router.trailingSlash.
If you set `router.trailingSlash: true`, trailing slashes are added to the canonical URLs. (e.g. https://example.com/foo/)
If you set `router.trailingSlash: false`, trailing slashes are stripped from the canonical URLs. (e.g. https://example.com/foo)
If you don't set `router.trailingSlash`, `nuxt-canonical-ogurl` raises an error.

# Options
```javascript
export default {
  // ...
  canonicalOgUrl: {
    baseURL: "https://example.com",
  },
}
```

## `baseURL`
type: `String`

Base URL for canonical tags.
If you set `baseURL: "https://example.com"`, canonical URL for pages/foo.vue would be "https://example.com/foo/" (in case `router.trailingSlash: true`).

## License

MIT
