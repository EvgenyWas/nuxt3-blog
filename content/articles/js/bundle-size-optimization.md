---
id: 2
title: 'Small Bundles, Fast Pages: What To Do With Too Much JavaScript'
description: 'Minimising the amount of JavaScript in your pages is an essential step to ensure a speedy user experience. This post will explain why bundle size matters and recommend tools and processes you can follow to monitor, visualise, and most importantly, shrink your JS bundles.'
image: '/storage/articles/js/bundle-size-optimization/image'
src: 'https://calibreapp.com/blog/bundle-size-optimization'
author: 'Ben Schwarz'
keywords: ['perfomance', 'refactoring']
---

Minimising the amount of JavaScript in your pages is an essential step to ensure a speedy user experience.

This post will explain why bundle size matters and recommend tools and processes you can follow to monitor, visualise, and most importantly, shrink your JS bundles.

<br>

## How does bundle size affect performance?

Large amounts of JavaScript negatively affect site speed in two distinct phases:

1. **During page load:** big bundles take longer to download.
2. **During parse and compile:** big bundles take longer to be turned into machine code, which delays JS initialisation.

If your users happen to be on a slow, spotty network, a device with a low battery or even just an underpowered Android, large bundle size will likely cause delays during load, render, user interaction or even page scroll.

Of course, your users don’t have to be using old devices or slow networks to have a sub-par experience. The effects of a large bundle can be partially mitigated by caching, compressing and minifying script resources, though reducing the size of a bundle is the only way to guarantee a fast page.

By keeping pages as light as possible, you’re ensuring that every visitor has the best chance of a great experience.

<br>

## Which performance metrics are affected by bundle size?

In short, most of them! Pages with large amounts of script can delay Largest Contentful Paint, cause Cumulative Layout Shifts, increase First Input Delay, Total Blocking Time and Time to Interactive.

Slow readings in those metrics quantify poor user experiences and can result in SEO ranking penalties.

<br>

## How much JavaScript is too much?

When we’re talking about performance, we usually focus on the compressed size of resources. However, once resources are uncompressed, they will be 2–3x larger.

For example, a page with 300kB of compressed script can yield 900kB–1.3MB once decompressed.

![uncompressed-js](/storage/articles/js/bundle-size-optimization/uncompressed-js)

> Here on NPMJS.com, `commons.js` is 306kB over the wire, but 1.2MB once uncompressed.

For CPU-constrained devices, multi-megabyte payloads are particularly damaging to performance:

![cost-of-javascript](/storage/articles/js/bundle-size-optimization/cost-of-javascript)

We recommend restricting pages to a **maximum of < 300kb of script (compressed)**. Where possible, use code splitting to break up your code into small chunks of 50KB or less. That way**,** browsers can download JS resources in parallel, making full use of HTTP 2 multiplexing.

> The new global baseline leaves space for ~100KiB (gzipped) of HTML/CSS/fonts and 300-350KiB of JavaScript on the wire (compressed). Alex Russell

<br>

## Tools and automations to keep your code fast

### Setup your editor for success

Use the import cost plugin in [Sublime](https://packagecontrol.io/packages/Import%20Cost) or [VSCode](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost) to report the size of third party libraries as you code:

![import-cost-plugin](/storage/articles/js/bundle-size-optimization/import-cost-plugin)

With import cost, you can set thresholds for what is considered a small or medium package. We recommend setting more aggressive targets than the defaults:

```js
// Upper size limit, in KB, that will count a package as a small package
"importCost.smallPackageSize": 15,

  // Upper size limit, in KB, that will count a package as a medium package
"importCost.mediumPackageSize": 50,
```

> TIP
> Import cost can’t calculate cost-savings of two libraries with a common dependency within bundled code.

### Visualise what your bundles include

Use tools like [Bundle Buddy](https://www.bundle-buddy.com/), [source-map-explorer](https://github.com/danvk/source-map-explorer#readme) and [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer#readme) to generate interactive bundle treemaps.

In a treemap, larger blocks correlate to larger file sizes—perfect for quickly spotting large imports!

![bundle-analyzer](/storage/articles/js/bundle-size-optimization/bundle-analyzer)

By visually exploring bundles, you will be able to identify modules that are larger than expected.

### Look for smaller, alternative third-party libraries

Often we choose a library dependency, then use it forever. But, there may be more lightweight alternatives that you’re unaware of.

Using BundlePhobia.com, you can scan a project’s package.json file or search for a given npm package.

![bundlephobia](/storage/articles/js/bundle-size-optimization/bundlephobia)

> `Moment.js` has increased in size by 15% in the last 15 releases.

When a library is “tree shakable”, bundler tools like webpack, rollup, or esbuild can perform unused code elimination during a build. Opt to use tree shakable libraries when you can!

![bundlephobia-similar-packages](/storage/articles/js/bundle-size-optimization/bundlephobia-similar-packages)

> TIP
> Sometimes libraries are smaller because they don’t support older browsers. Be sure to test thoroughly for edge cases!

### Block selected packages from being used

Communicating why to use one package over another can be difficult across teams or companies. To counter this, you can use ESLint’s `no-restricted-import` to warn or error when a restricted package is included.

In the following example, ESLint will fail the build when we use the `moment` package, suggesting `date-fns` as a vetted alternative:

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "moment",
            "message": "Use date-fns instead. See https://bundlephobia.com/package/moment"
          }
        ]
      }
    ]
  }
}
```

<br>

## Dynamically load components and dependencies

Most popular bundlers like Webpack, ESBuild, Rollup or Parcel can code-split your code and dependencies. Code-splitting allows you to lazy-load parts of your application as required, resulting in smaller bundle sizes and faster initial load experiences.

React, Next, Angular, and Vue all provide utilities to make lazily-loading components more straightforward. Here’s a React example:

```js
import React, { Fragment, Suspense } from 'react';
import Skeleton from './Skeleton';

// Lazy loading React import
const Dashboard = React.lazy(() => import('./Dashboard'));

function Page() {
  return (
    <Fragment>
      <Suspense fallback={<Skeleton message="Loading" />}>
        <Dashboard />
      </Suspense>
    </Fragment>
  );
}
```

Lazy-loading comes with many benefits:

- Less initial script to load
- A greater number of smaller requests loaded in parallel
- Code that isn’t changed regularly can be cached long-term

Lazy-loading works well for:

- Route/navigation based lazy-loading: load only the scripts your page requires, not the whole site!
- Interaction based lazy-loading: load dependencies as they’re required. e.g.: when a viewer opens a panel.

<br>

## Prefer server-side rendering for primary content

Whether for end-users or SEO spiders, we must render primary content as quickly as possible.

For content-driven pages, we recommend server-side rendered (SSR) over Single Page Applications (SPA). Single Page Applications are suitable for applications with long session times or interfaces that seamlessly transition (e.g. shopping carts), but at the same time, we must show content fast. Render server-side when you can.

<br>

## Lazy load third party resources with facades

Business requirements often drive the usage of third parties, but that does not mean that developers can’t influence third party performance.

At Calibre, we improved Time to Interactive by 30% using react-live-chat-loader, our facade library for Help Scout, Intercom, Facebook Messenger, Drift, Userlike and Chatwoot.

Facade libraries work based on delaying the load of a third party by temporarily showing a ‘fake’ (non-interactive) chat widget, video panel, or support tool until the page has finalised loading critical content.

As a team, you can use several strategies to wrangle third-party performance. Here are some of our favourites:

- Delay third parties from loading until required using facades.
- Use dns-prefetching for third party domains, e.g.: `<link rel="dns-prefetch" href="https://fonts.googleapis.com/" />`.
- Prefer to bundle third party libraries yourself, rather than using their CDN.
- Compare page performance with and without a given third party script. Share the results with people making decisions about third party tooling!
- Request Performance SLAs in contractual agreements with third parties.

<br>

## Deliver ES6 modules to up-to-date browsers

Supporting older browsers can hold you back from using new technologies (and their performance benefits!). Still, we need to be careful about abruptly dropping support for legacy technologies, which might result in a lack of access.

Consider splitting your build into two builds:

- An ES5 build, with browser supports, polyfills and Babel transcoding.
- An ES2015+ build, utilising async/await, Promises, arrow functions, Map and Set types and Dynamic Imports for lazy-loading.

```html
<!-- Deliver ES5 code to non-module supporting browsers -->
<script
  nomodule
  src="legacy-support-bundle.js"
></script>

<!-- Deliver ES2015+ code to module capable browsers -->
<script
  type="module"
  src="bundle.js"
></script>
```

> RESOURCE
> For instructions to create es5 & ES2015+ builds using Webpack, see Phil Walton’s excellent post, Deploying ES2015+ Code in Production Today .

<br>

## Keep monitoring JavaScript size

Optimising bundle size doesn’t end with one housekeeping effort (we wish!). As codebases grow and evolve, we need safeguards to keep JavaScript size in check. Some tools mentioned earlier will be helpful here.

Another recommended strategy is using performance budgets. By setting targets, you create accountability for metrics and how they affect user experience. At Calibre, we create budgets for JavaScript execution metrics and third party JavaScript to get alerts when we exceed them:

![budgets-dashboard](/storage/articles/js/bundle-size-optimization/budgets-dashboard)

You can also use [Lighthouse](https://web.dev/use-lighthouse-for-performance-budgets/) to set performance budgets and script your own solution!

<hr>

By using a combination of the above tips and strategies, you can improve user and developer experience. If you have other tips or successful workflows, let us know!
