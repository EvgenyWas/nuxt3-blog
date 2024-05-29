---
id: 3
title: 'Resumability vs Hydration'
description: 'So if both Hydration and resumabality do the same thing, what is the difference? I think the best way to understand the difference is to create a small example showing Hydration and resumability and pay attention to which code executes where (server vs client) and when (before vs after interaction.)'
image: '/storage/articles/web/resumability-vs-hydration/image'
src: 'https://www.builder.io/blog/resumability-vs-hydration'
author: 'MIŠKO HEVERY'
keywords: ['architecture']
---

Resumability is a faster alternative to Hydration. At first glance, it may seem like resumability and Hydration are the same. After all, both bring interactivity to your page. Defining Hydration to be just making a page interactive is so broad as it fails to be useful as it includes non-server-rendered applications.

For something to be considered Hydration, the page needs to have a pre-rendering server step (either SSR or SSG.) Without a server step, the page is just client-side rendered; therefore, there is no hydration. (This is an important distinction because hydration and client rendering are, for the most part, the same thing.)

So if both Hydration and resumabality do the same thing, what is the difference? I think the best way to understand the difference is to create a small example showing Hydration and resumability and pay attention to which code executes where (server vs client) and when (before vs after interaction.)

For this example, we will choose three frameworks as they demonstrate different approaches on the hydration / resumability spectrum:

- **React:** A popular framework that executes components on Hydration and on interactivity. ([playground]())
- **SolidJS:** An fine-grained reactive framework that executes components on Hydration only (not on interactivity.) ([playground]())
- **Qwik:** A fine-grained reactive framework that does not hydrate and therefore does not execute the code on Hydration. ([playground]())

<br>

## Client-side rendering

Before we jump into Hydration and resumability, reviewing how client-side rendering (CSR) works is helpful. To really appreciate the benefits, it is important to have an example of component hierarchy with a hoisted state.

```js
import * as React from 'react';
import { useState } from 'react';
import './style.css';

export default function Counter() {
  console.log('Render: <Counter/>');
  const [count, setCount] = useState(0);
  return (
    <div>
      <Display count={count} />
      <Incrementor setCount={setCount} count={count} />
    </div>
  );
}

function Display(props: { count: number }) {
  console.log('Render: <Display/>');
  return <div>Current count: {props.count}</div>;
}

function Incrementor(props: {
  count: number;
  setCount: (count: number) => void;
}) {
  console.log('Render: <Incrementor/>');
  return (
    <button
      onClick={() => {
        console.log('Interaction: +1');
        props.setCount(props.count + 1);
      }}
    >
      +1
    </button>
  );
}
```

We have implemented the above code in all three frameworks. Notice that we have placed console.log() at key locations to show what is going on.

![client-side](/storage/articles/web/resumability-vs-hydration/client-side)

As you can see, there is no difference between the three frameworks. All of the frameworks executed all of the code and therefore have the same console output. This makes sense, as the first time the application is executed and rendered, the frameworks have no choice but to start the execution at the root component and then descend to children and execute each component along the way.

Now let's interact with the component and observe how the logs are different.

![client-side-result](/storage/articles/web/resumability-vs-hydration/client-side-result)

This is where we start to notice differences between frameworks. Notice that all three frameworks console out +1 due to the interaction but only React causes all of the components to re-execute and re-print the logs for components. So why the difference?

React is coarse-grain reactive. This means that React re-rendering starts with the component which owns the state, and then React descends down the component tree. Solid and Qwik, on the other hand, are fine-grain reactive. This means that a change in state is not associated with a component but rather directly with the DOM node that needs to be updated. The end result is that React re-executes the components, whereas Solid and Qwik only need to update the DOM state. Short-circuiting the re-execution of components and re-creation vDOM is the reason why Solid is one of the fastest frameworks out there.

While executing less code is important on updates, it would be better if we could save the execution on the initial render. So let's look at what happens when pre-rendering of HTML is involved.

<br>

## HTML pre-rendering

It can take considerable time to do the client-side rendering (CSR) of the application while the user stares at a blank screen. Pre-rendering of HTML was introduced to solve this specific problem. The goal of pre-rendering is to show the statistic page to the user and, in the background, make the page interactive.

How do you pre-render the HTML? Well, that is straightforward. You just execute the application on the server (SSR/SSG) rather than on the client. Once the application builds up the HTML, you send the HTML over to the client (or cache it at CDN for later sending).

![pre-rendering-1](/storage/articles/web/resumability-vs-hydration/pre-rendering-1)

Notice that just like CSR all frameworks have to execute all of the components starting from the root. This makes sense because executing application code is how the framework learns about the application.

**Making HTML interactive**

Once we have pre-rendered application on the client, we need to make it interactive. Initially, when HTML pre-rendering was introduced, the framework would still do CSR and just replace the static content with client-side-rendered content. In that sense, "hydration" was just a re-branding of CSR. Since then, CSR has gotten smarter, and it now tries to reuse HTML whenever possible, but at its core, Hydration is still just CSR.

![pre-rendering-2](/storage/articles/web/resumability-vs-hydration/pre-rendering-2)

But now we start seeing differences. Notice that both React and Solid have to re-execute the application code on the client, whereas Qwik does not have to do it. So what is going on? Well, remember that Hydration is just re-branded CSR. So in that sense, it makes sense. The framework needs to re-execute the application starting at the root and descending to the children. The purpose of this execution is to collect information such as component boundaries, event listeners, and reactivity graphs about the app.

Solid is good about not doing unnecessary work, but it still needs to execute the components to rebuild the fine-grained reactivity graph. Qwik was able to serialize the reactivity graph at the server, so it could skip that step on the client.

Is executing code on startup a problem? Well, it depends on the size of your application. In our toy demo, it will make very little difference. The issue is that this cost is proportional to the complexity of the application. As you start a project, Hydration will not be an issue, but as the project grows, it will become an issue as a death by a thousand cuts.

Remember that Hydration is just rebranded CSR. CSR speed was a problem, so we introduced HTML pre-rendering. Pre-rendered HTML helped with the time-to-visual problem but it did nothing to fix the time-to-interactive. (Contrary, an argument can be made that adding pre-rendered HTML resulted in more work for the browser and hence has delayed time-to-interactive.)

**Interactivity after pre-rendered HTML**

Let's look at what happens with interactivity.

![pre-rendering-result](/storage/articles/web/resumability-vs-hydration/pre-rendering-result)

The interactivity is very similar to that of CSR. React causes all components to re-execute, but SolidJS and Qwik only execute the event handler.

So why does this matter? Notice that Qwik only executed the components on the server but never on the client. Neither during the initial make-it-interactive step nor the interactivity step. This means that in this case, Qwik does not need to download the components code to the client ever. (There are other cases where Qwik may have to download component code, but those are not as common.)

While SolidJS was efficient at not executing the code on interaction, it did have to download the code and execute it at the very beginning to make the application interactive. Even though SolidJS never has to execute the code again, the download and execution price has been paid.

<br>

## Resumability

Resumability is a way for a framework to recover its state without re-executing the application components on the client. This is done by serializing not just the application state but also the framework state during HTML pre-rendering. By serializing the component boundaries, event listeners, and reactivity graph, a resumable framework can continue executing where the server left off. The client can resume the execution where the server left off and therefore save itself the cost of re-executing the component tree (Hydration) in order to become interactive. Combine this with fine-grain-reactivity, and the framework, most of the time, does not have to download the components.

![resumability](/storage/articles/web/resumability-vs-hydration/resumability)

Qwik could not do Hydration even if it wanted to because the hydration code (components) were not downloaded to the client.

There is another point worth making. Hydration must execute before the app becomes interactive. Yes, the execution may be lazy, but the button will not process events until Hydration executes. Resumability is direct. A button is interactive before any code execution.

> Resumability recovers the framework's state as a result of interaction, whereas Hydration must run before interaction.

**Code duplication**

Hydration is when an application is downloaded and executed twice, once as HTML and again as JavaScript. Resumability allows you to de-dup the application code. The client either downloads HTML or JavaScript for a particular part but rarely both.

**Lazy loading doesn't help**

Hydration requires that the framework executes the components to recover the event listeners and reactivity graph. Inserting a lazy-loaded boundary in the component tree does not help to prevent the code from being downloaded. During Hydration, the framework will be forced to eagerly download and execute the code anyways.

<br>

## Conclusion

We built a simple application with the state, rendering, and interactivity spread across the components to simulate how frameworks deal with component execution. During the initial render of CSR/SSR/SSG, the behaviors are indistinguishable. But interactivity shows off the advantage of fine-grained reactivity, which allows the framework to significantly reduce the amount of code that needs to be present on the client. Combining fine-grained-reactivity with resumability allows a framework to skip the download and execution of most components, resulting in an instant startup. While Hydration and Resumability both make apps interactive, they do so in very different ways.
