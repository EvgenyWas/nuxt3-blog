---
id: 1
title: 'Optimizing A Vue App'
description: 'Prioritizing performance when building our web apps improves the user experience and helps ensure they can be used by as many people as possible. In this article, Michelle Barker will walk you through some of the front-end optimization tips to keep our Vue apps as efficient as possible.'
src: 'https://www.smashingmagazine.com/2022/11/optimizing-vue-app/'
author: 'Michelle Barker'
keywords: ['perfomance', 'refactoring']
---

Single Page Applications (SPAs) can provide a rich, interactive user experience when dealing with real-time, dynamic data. But they can also be heavy, bloated, and perform poorly. In this article, we’ll walk through some of the front-end optimization tips to keep our Vue apps relatively lean and only ship the JS we need when it’s needed.

> Some familiarity with Vue and the Composition API is assumed, but there will hopefully be some useful takeaways regardless of your framework choice.

As a front-end developer at Ada Mode, my job involves building Windscope, a web app for wind farm operators to manage and maintain their fleet of turbines. Due to the need to receive data in real time and the high level of interactivity required, an SPA architecture was chosen for the project. Our web app is dependent on some heavy JS libraries, but we want to provide the best experience for the end user by fetching data and rendering as quickly and efficiently as possible.

<br>

## Choosing A Framework

Our JS framework of choice is Vue, partly chosen as it’s the framework I’m most familiar with. Previously Vue had a smaller overall bundle size compared to React. However, since recent React updates, the balance appears to have shifted in React’s favor. That doesn’t necessarily matter, as we’ll look at how to only import what we need in the course of this article. Both frameworks have excellent documentation and a large developer ecosystem, which was another consideration. Svelte is another possible choice, but it would have required a steeper learning curve due to unfamiliarity, and being newer, it has a less developed ecosystem.

As an example to demonstrate the various optimizations, I’ve built a simple Vue app that fetches data from an API and renders some charts using [D3.js](https://d3js.org/).

![1-optimizing-vue-app](/storage/articles/vue/optimizing-vue-app/1-optimizing-vue-app)

> Please refer to the [example GitHub repository](https://github.com/mbarker84/vue-app-example) for the full code.

We’re using Parcel, a minimal-config build tool, to bundle our app, but all of the optimizations we’ll cover here are applicable to whichever bundler you choose.

<br>

## Tree Shaking, Compression, And Minification With Build Tools

It’s good practice to only ship the code you need, and right out of the box, Parcel removes unused Javascript code during the build process (tree shaking). It also minifies the result and can be configured to compress the output with Gzip or Brotli.

As well as minification, Parcel also employs scope hoisting as part of its production process, which can help make minification even more efficient. An in-depth guide to scope hoisting is outside of the scope (see what I did there?) of this article. Still, if we run Parcel’s build process on our example app with the --no-optimize and --no-scope-hoist flags, we can see the resulting bundle is 510kB — around 5 times higher than the optimized and minified version. So, whichever bundler you’re using, it’s fair to say you’ll probably want to make sure it’s carrying out as many optimizations as possible.

But the work doesn’t end here. Even if we’re shipping a smaller bundle overall, it still takes time for the browser to parse and compile our JS, which can contribute to a slower user experience. This article on Bundle Size Optimization by Calibre explains how large JS bundles affect performance metrics.

Let’s look at what else we can do to reduce the amount of work the browser has to do.

<br>

## Vue Composition API

Vue 3 introduced the [Composition API](https://vuejs.org/guide/extras/composition-api-faq), a new set of APIs for authoring components as an alternative to the Options API. By exclusively using the Composition API, we can import only the Vue functions that we need instead of the whole package. It also enables us to write more reusable code using composables. Code written using the Composition API lends itself better to minification, and the whole app is more susceptible to tree-shaking.

> You can still use the Composition API if you’re using an older version of Vue: it was backported to Vue 2.7, and there is an official plugin for older versions.

<br>

## Importing Dependencies

A key goal was to reduce the size of the initial JS bundle downloaded by the client. Windscope makes extensive use of D3 for data visualization, a large library and wide-ranging in scope. However, Windscope only needs part of it (there are entire modules in the D3 library that we don’t need at all). If we examine the entire D3 package on Bundlephobia, we can see that our app uses less than half of the available modules and perhaps not even all of the functions within those modules.

One of the easiest ways to keep our bundle size as small as possible is only to import the modules we need.

Let’s take D3’s `selectAll` function. Instead of using a default import, we can just import the function we need from the `d3-selection` module:

```js
// Previous:
import * as d3 from 'd3';

// Instead:
import { selectAll } from 'd3-selection';
```

<br>

## Code Splitting With Dynamic Imports

There are certain packages that are used in a bunch of places throughout Windscope, such as the AWS Amplify authentication library, specifically the Auth method. This is a large dependency that contributes heavily to our JS bundle size. Rather than import the module statically at the top of the file, dynamic imports allow us to import the module exactly where we need it in our code.

Instead of:

```js
import { Auth } from '@aws-amplify/auth';

const user = Auth.currentAuthenticatedUser();
```

We can import the module when we want to use it:

```js
import('@aws-amplify/auth').then(({ Auth }) => {
  const user = Auth.currentAuthenticatedUser();
});
```

This means that the module will be split out into a separate JS bundle (or “chunk”), which will only be downloaded by the browser if and when it is needed. Additionally, the browser can cache these dependencies, which may change less frequently than the code for the rest of our app.

<br>

## Lazy Loading Routes With Vue Router

Our app uses Vue Router for navigation. Similarly to dynamic imports, we can lazyload our route components, so they will only be imported (along with their associated dependencies) when a user navigates to that route.

In our `index/router.js` file:

```js
// Previously:
import Home from "../routes/Home.vue";
import About = "../routes/About.vue";

// Lazyload the route components instead:
const Home = () => import("../routes/Home.vue");
const About = () => import("../routes/About.vue");

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "about",
    path: "/about",
    component: About,
  },
];
```

The code for the ‘About’ route will only be loaded when the user clicks the ‘About’ link and navigates to the route.

<br>

## Async Components

In addition to lazyloading each route, we can also lazyload individual components using Vue’s `defineAsyncComponent` method.

```js
const KPIComponent = defineAsyncComponent(() => import('../components/KPI.vue))
```

This means the code for the KPI component will be dynamically imported, as we saw in the router example. We can also provide some components to display while it’s in a loading or error state (useful if we’re loading a particularly large file).

```js
const KPIComponent = defineAsyncComponent({
  loader: () => import('../components/KPI.vue),
  loadingComponent: Loader,
  errorComponent: Error,
  delay: 200,
  timeout: 5000,
});
```

<br>

## Splitting API Requests

Our application is primarily concerned with data visualization and relies heavily on fetching large amounts of data from the server. Some of these requests can be quite slow, as the server has to perform a number of computations on the data. In our initial prototype, we made a single request to the REST API per route. Unfortunately, we found this resulted in users having to wait a long time — sometimes up to 10 seconds, watching a loading spinner before the app successfully received the data and could begin rendering the visualizations.

We made the decision to split the API into several endpoints and make a request for each widget. While this could increase the response time overall, it means the app should become usable much quicker, as users will see parts of the page rendered while they’re still waiting for others. Additionally, any error that might occur will be localized while the rest of the page remains usable.

You can see the difference illustrated here:

![async-comparison](/storage/articles/vue/optimizing-vue-app/async-comparison)

> In the example on the right, the user can interact with some components while others are still requesting data. The page on the left has to wait for a large data response before it can be rendered and become interactive.

### CONDITIONALLY LOAD COMPONENTS

Now we can combine this with async components to only load a component when we’ve received a successful response from the server. Here we’re fetching the data, then importing the component when our fetch function returns successfully:

```vue
<template>
  <div>
    <component
      :is="KPIComponent"
      :data="data"
    ></component>
  </div>
</template>

<script>
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import Loader from './Loader';
import Error from './Error';

export default defineComponent({
  components: { Loader, Error },

  setup() {
    const data = ref(null);

    const loadComponent = () => {
      return fetch('https://api.npoint.io/ec46e59905dc0011b7f4')
        .then((response) => response.json())
        .then((response) => (data.value = response))
        .then(() => import('../components/KPI.vue')) // Import the component
        .catch((e) => console.error(e));
    };

    const KPIComponent = defineAsyncComponent({
      loader: loadComponent,
      loadingComponent: Loader,
      errorComponent: Error,
      delay: 200,
      timeout: 5000,
    });

    return { data, KPIComponent };
  },
});
</script>
```

To handle this process for every component, we created a higher order component called WidgetLoader, which you can see in the repository.

This pattern can be extended to any place in the app where a component is rendered upon user interaction. For example, in Windscope, we load a map component (and its dependencies) only when the user clicks on the ‘Map’ tab. This is known as Import on interaction.

### CSS

If you run the example code, you will see that clicking the ‘Locations’ navigation link loads the map component. As well as dynamically importing the JS module, importing the dependency within the component’s `<style>` block will lazyload the CSS too:

```vue
// In MapView.vue
<style>
@import '../../node_modules/leaflet/dist/leaflet.css';

.map-wrapper {
  aspect-ratio: 16 / 9;
}
</style>
```

### REFINING THE LOADING STATE

At this point, we have our API requests running in parallel, with components being rendered at different times. One thing we might notice is the page appears janky, as the layout will be shifting around quite a bit.

![async-loading-layout](/storage/articles/vue/optimizing-vue-app/async-loading-layout)

A quick way to make things feel a bit smoother for users is to set an aspect ratio on the widget that roughly corresponds to the rendered component so the user doesn’t see quite as big a layout shift. We could pass in a prop for this to account for different components, with a default value to fall back to.

```vue
// WidgetLoader.vue
<template>
  <div
    class="widget"
    :style="{ 'aspect-ratio': loading ? aspectRatio : '' }"
  >
    <component
      :is="AsyncComponent"
      :data="data"
    ></component>
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeMount, onBeforeUnmount } from 'vue';
import Loader from './Loader';
import Error from './Error';

export default defineComponent({
  components: { Loader, Error },

  props: {
    aspectRatio: {
      type: String,
      default: '5 / 3', // define a default value
    },
    url: String,
    importFunction: Function,
  },

  setup(props) {
    const data = ref(null);
    const loading = ref(true);

    const loadComponent = () => {
      return fetch(url)
        .then((response) => response.json())
        .then((response) => (data.value = response))
        .then(importFunction)
        .catch((e) => console.error(e))
        .finally(() => (loading.value = false)); // Set the loading state to false
    };

    /* ...Rest of the component code */

    return { data, aspectRatio, loading };
  },
});
</script>
```

<br>

## Aborting API Requests

On a page with a large number of API requests, what should happen if the user navigates away before all the requests have been completed? We probably don’t want those requests to continue running in the background, slowing down the user experience.

We can use the [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) interface, which enables us to abort API requests as desired.

In our `setup` function, we create a new controller and pass its signal into our fetch request parameters:

```js
setup(props) {
    const controller = new AbortController();

    const loadComponent = () => {
      return fetch(url, { signal: controller.signal })
        .then((response) => response.json())
        .then((response) => (data.value = response))
        .then(importFunction)
        .catch((e) => console.error(e))
        .finally(() => (loading.value = false));
        };
}
```

Then we abort the request before the component is unmounted, using Vue’s `onBeforeUnmount` function:

```js
onBeforeUnmount(() => controller.abort());
```

If you run the project and navigate to another page before the requests have been completed, you should see errors logged in the console stating that the requests have been aborted.

<br>

## Stale While Revalidate

So far, we’ve done a pretty good of optimizing our app. But when a user navigates to the second view and then back to the previous one, all the components remount and are returned to their loading state, and we have to wait for the request responses all over again.

[Stale-while-revalidate](https://web.dev/stale-while-revalidate/) is an HTTP cache invalidation strategy where the browser determines whether to serve a response from the cache if that content is still fresh or “revalidate” and serve from the network if the response is stale.

In addition to applying cache-control headers to our HTTP response (out of the scope of this article, but read this article from Web.dev for more detail), we can apply a similar strategy to our Vue component state, using the SWRV library.

First, we must import the composable from the SWRV library:

```js
import useSWRV from 'swrv';
```

Then we can use it in our `setup` function. We’ll rename our `loadComponent` function to `fetchData`, as it will only deal with data fetching. We’ll no longer import our component in this function, as we’ll take care of that separately.

We’ll pass this into the `useSWRV` function call as the second argument. We only need to do this if we need a custom function for fetching data (maybe we need to update some other pieces of state). As we’re using an Abort Controller, we’ll do this; otherwise, the second argument can be omitted, and SWRV will use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API):

```js
// In setup()
const { url, importFunction } = props;

const controller = new AbortController();

const fetchData = () => {
  return fetch(url, { signal: controller.signal })
    .then((response) => response.json())
    .then((response) => (data.value = response))
    .catch((e) => (error.value = e));
};

const { data, isValidating, error } = useSWRV(url, fetchData);
```

Then we’ll remove the `loadingComponent` and `errorComponent` options from our async component definition, as we’ll use SWRV to handle the error and loading states.

```js
// In setup()
const AsyncComponent = defineAsyncComponent({
  loader: importFunction,
  delay: 200,
  timeout: 5000,
});
```

This means we’ll need to include the `Loader` and `Error` components in our template and show and hide them depending on the state. The `isValidating` return value tells us whether there is a request or revalidation happening.

```vue
<template>
  <div>
    <Loader v-if="isValidating && !data"></Loader>
    <Error
      v-else-if="error"
      :errorMessage="error.message"
    ></Error>
    <component
      :is="AsyncComponent"
      :data="data"
      v-else
    ></component>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue';
import useSWRV from 'swrv';

export default defineComponent({
  components: {
    Error,
    Loader,
  },

  props: {
    url: String,
    importFunction: Function,
  },

  setup(props) {
    const { url, importFunction } = props;

    const controller = new AbortController();

    const fetchData = () => {
      return fetch(url, { signal: controller.signal })
        .then((response) => response.json())
        .then((response) => (data.value = response))
        .catch((e) => (error.value = e));
    };

    const { data, isValidating, error } = useSWRV(url, fetchData);

    const AsyncComponent = defineAsyncComponent({
      loader: importFunction,
      delay: 200,
      timeout: 5000,
    });

    onBeforeUnmount(() => controller.abort());

    return {
      AsyncComponent,
      isValidating,
      data,
      error,
    };
  },
});
</script>
```

We could refactor this into its own composable, making our code a bit cleaner and enabling us to use it anywhere.

```js
// composables/lazyFetch.js
import { onBeforeUnmount } from 'vue';
import useSWRV from 'swrv';

export function useLazyFetch(url) {
  const controller = new AbortController();

  const fetchData = () => {
    return fetch(url, { signal: controller.signal })
      .then((response) => response.json())
      .then((response) => (data.value = response))
      .catch((e) => (error.value = e));
  };

  const { data, isValidating, error } = useSWRV(url, fetchData);

  onBeforeUnmount(() => controller.abort());

  return {
    isValidating,
    data,
    error,
  };
}
```

```vue
// WidgetLoader.vue
<script>
import { defineComponent, defineAsyncComponent, computed } from 'vue';
import Loader from './Loader';
import Error from './Error';
import { useLazyFetch } from '../composables/lazyFetch';

export default defineComponent({
  components: {
    Error,
    Loader,
  },

  props: {
    aspectRatio: {
      type: String,
      default: '5 / 3',
    },
    url: String,
    importFunction: Function,
  },

  setup(props) {
    const { aspectRatio, url, importFunction } = props;
    const { data, isValidating, error } = useLazyFetch(url);

    const AsyncComponent = defineAsyncComponent({
      loader: importFunction,
      delay: 200,
      timeout: 5000,
    });

    return {
      aspectRatio,
      AsyncComponent,
      isValidating,
      data,
      error,
    };
  },
});
</script>
```

<br>

## UPDATING INDICATOR

It might be useful if we could show an indicator to the user while our request is revalidating so that they know the app is checking for new data. In the example, I’ve added a small loading indicator in the corner of the component, which will only be shown if there is already data, but the component is checking for updates. I’ve also added a simple fade-in transition on the component (using Vue’s built-in `Transition` component), so there is not such an abrupt jump when the component is rendered.

```vue
<template>
  <div
    class="widget"
    :style="{ 'aspect-ratio': isValidating && !data ? aspectRatio : '' }"
  >
    <Loader v-if="isValidating && !data"></Loader>
    <Error
      v-else-if="error"
      :errorMessage="error.message"
    ></Error>
    <Transition>
      <component
        :is="AsyncComponent"
        :data="data"
        v-else
      ></component>
    </Transition>

    <!--Indicator if data is updating-->
    <Loader
      v-if="isValidating && data"
      text=""
    ></Loader>
  </div>
</template>
```

<br>

## Conclusion

Prioritizing performance when building our web apps improves the user experience and helps ensure they can be used by as many people as possible. We’ve successfully used the above techniques at Ada Mode to make our applications faster. I hope this article has provided some pointers on how to make your app as efficient as possible — whether you choose to implement them in full or in part.

SPAs can work well, but they can also be a performance bottleneck. So, let’s try to build them better.
