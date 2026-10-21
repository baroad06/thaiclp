# Website languages

- Thai uses the original routes; English uses `/en` with the same paths.
- `i18n.js` provides the locale, translation helpers and same-page language links.
- `messages.en.json` maps Thai UI source strings to English. Templates use `t(source)`.
- `products.en.json` maps category URLs and original image filenames to English names. Keep the image filename keys in sync with `product/data.json`.
- The catalogue retains both language names as search aliases, regardless of the selected display language.
- `public/js/site.js` refreshes language links when live catalogue filters change.
- Run `npm test` and `npm run build:css` after changing templates or translations.
