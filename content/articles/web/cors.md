---
id: 4
title: 'CORS'
description: 'It’s every developer’s frustration once in a while to see that big red Access to fetched has been blocked by CORS policy error in your console! 😬 Although there are some ways to quickly get rid of this error, let’s not take anything for granted today! Instead, let’s see what CORS is actually doing, and why it’s actually our friend 👏🏼'
image: '/storage/articles/web/cors/image'
src: 'https://dev.to/lydiahallie/cs-visualized-cors-5b8h'
author: 'Lydia Hallie'
keywords: ['fundamentals', 'api']
---

It’s every developer’s frustration once in a while to see that big red `Access to fetched has been blocked by CORS policy` error in your console! 😬 Although there are some ways to quickly get rid of this error, let’s not take anything for granted today! Instead, let’s see what CORS is actually doing, and why it’s actually our friend 👏🏼

> ❗️ In this blog post I won’t explain HTTP basics. In case you’d like to know more about HTTP requests and responses, I wrote a small blog post about it a while ago though 🙂 In my examples I use HTTP/1.1 instead of HTTP/2, this doesn’t affect CORS.

On the frontend, we often want to display data that's located elsewhere! Before we can display this data, the browser first has to make a request to a server in order to fetch that data! The client sends an HTTP request with all the information that the server needs in order to send that data back to the client 🙂

Let’s say we’re trying to fetch some user information on our `www.mywebsite.com` website from a server that’s located at `api.website.com`!

![1](/storage/articles/web/cors/1)

Perfect! 😃 We just sent an HTTP request to the server, which then responded with the JSON data we asked for.

Let's try the exact same request but from another domain. Instead of making the request from `www.mywebsite.com`, we’re now making the request from a website located at `www.anotherdomain.com`.

![2](/storage/articles/web/cors/2)

Wait, what? We sent the exact same request, but this time the browser shows us a weird error?

We just saw CORS in action! 💪🏼 Let’s see why this error occurred, and what it exactly means.

<hr>

## ✋🏼 Same-Origin Policy

The web enforces something called the same-origin policy. By default, we can only access resources that are located at the same origin as the origin of our request! 💪🏼 It's totally okay to load an image that's located at `https://mywebsite.com/image1.png`, for example.

A resource is cross-origin when it's located at a different (sub)domain, protocol, or port!

![3](/storage/articles/web/cors/3)

Cool, but why does the same-origin policy even exist?

Let's say that the same-origin policy didn't exist, and you accidentally clicked one of the many virus links your aunt sent you on Facebook. This link redirects you to an "evil website" that has an iframe embedded which loads your bank's website, and successfully logs you in by some set cookies! 😬

The developers of this "evil website" made it possible for the website to access this iframe and interact with the DOM contents of your bank's website in order to send money to their account on your behalf!

![4](/storage/articles/web/cors/4)

Yeah... this is a huge security risk! We don't want anyone to just be able to access everything 😧

Luckily, the same-origin policy helps us out here! This policy makes sure that we can only access resources from the same origin.

![5](/storage/articles/web/cors/5)

In this case, the origin www.evilwebsite.com tried to access cross-origin resources from www.bank.com! The same-origin policy blocked this from happening and made sure that the evil website's devs couldn't just access our bank data 🥳

Okay, so... what does this have to do with CORS?

<hr>

## 🔥 Client-side CORS

Although the same-origin policy actually only applies to scripts, browsers "extended" this policy for JavaScript requests: by default, we can only access fetched resources from the same origin!

![6](/storage/articles/web/cors/6)

Hmm, but... We often have to access cross-origin resources 🤔 Maybe our frontend needs to interact with our backend API in order to load the data? In order to allow cross-origin requests safely, the browser uses a mechanism called **CORS**! 🥳

CORS stands for **Cross-Origin Resource Sharing**. Although the browser disallows us from accessing resources that aren’t located at the same origin, we can use CORS to change those security restrictions a bit while still making sure that we’re accessing those resources safely 🎉

User agents (a browser, for example) can use the CORS mechanism in order to allow cross-origin requests which otherwise would've been blocked, based on the values of certain CORS-specific headers in the HTTP response! ✅

When a cross-origin request is made, the client automatically adds an extra header to our HTTP request: `Origin`. The value of the `Origin` header is the origin where the request came from!

![7](/storage/articles/web/cors/7)

In order for the browser to allow accessing cross-origin resources, it expects certain headers from the server's response, which specify whether this server allows cross-origin requests!

<hr>

## 💻 Server-side CORS

As a server developer, we can make sure that cross-origin requests are allowed by adding extra headers to the HTTP response, which all start with Access-Control-\* 🔥 Based on the values of these CORS response headers, the browser can now allow certain cross-origin responses which would’ve normally been blocked by the same-origin policy!

Although there are [several CORS headers](https://fetch.spec.whatwg.org/#http-responses) we can use, there is one header that the browser needs in order to allow cross-origin resource access: `Access-Control-Allow-Origin`! 🙂
The value of this header specifies which origins are allowed to access the resources that they're requesting from the server.

If we’re developing a server that `https://mywebsite.com` should have access to, we can add the value of that domain to the `Access-Control-Allow-Origin` header!

![8](/storage/articles/web/cors/8)

Awesome! 🎉 This header is now added to the response that the server sends back to the client. By adding this header, the same-policy origin will no longer restrict us from receiving resources that were located at the `https://api.mywebsite.com` origin, if we sent the request from `https://mywebsite.com`!

![9](/storage/articles/web/cors/9)

The CORS mechanism within the browser checks whether the value of the `Access-Control-Allow-Origin` header equals the value of the `Origin` that was sent by the request 🤚🏼

In this case, the origin of our request is `https://www.mywebsite.com`, which is listed in the `Access-Control-Allow-Origin` response header!

![10](/storage/articles/web/cors/10)

Perfect! 🎉 We were able to receive the cross-origin resources successfully! So what happens when we’re trying to access these resources from an origin that’s not listed in the `Access-Control-Allow-Origin` header? 🤔

![11](/storage/articles/web/cors/11)

Ahh yeah, CORS throws the notorious error that can be so frustrating at times! But now we actually see that it makes total sense

```md
The 'Access-Control-Allow-Origin' header has a value
'https://www.mywebsite.com' that is not equal
to the supplied origin.
```

In this case, the supplied origin was `https://www.anotherwebsite.com`. However, the server didn’t have this supplied origin in the list of allowed origins in the `Access-Control-Allow-Origin` header! CORS successfully blocked the request, and we cannot access the fetched data in our code 😃

> CORS also allows us to add the wildcard `*` as the value for the allowed origins. This means that requests from all origins should have access to the requested resources, so be careful!

<hr>

`Access-Control-Allow-Origin` is one of the many CORS headers we can provide. A server developer can extend the server's CORS policies in order to (dis)allow certain requests! 💪🏼

Another common header is the `Access-Control-Allow-Methods` header! CORS will only allow cross-origin requests if they were sent with the listed methods.

![12](/storage/articles/web/cors/12)

In this case, only requests with a `GET`, `POST`, or `PUT` method will be allowed! Other methods such as `PATCH` or `DELETE` will be blocked ❌

> If you're curious about what the other possible CORS headers are and what they're used for, [check out this list](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#The_HTTP_response_headers).

Speaking of `PUT`, `PATCH`, and `DELETE` requests, CORS actually handles those requests differently! 🙃 These "non-simple" requests initiate something called a **preflight request**!

<hr>

## 🚀 Preflighted Requests

CORS has two types of requests: a simple request and a preflighted request. Whether a request is simple or preflighted depends on some values within the request (don't worry, you don't have to memorize this lol).

A request is simple when the request is a `GET` or `POST` method and doesn't have any custom headers! Any other request, such as requests with a `PUT`, `PATCH`, or `DELETE` method, will be preflighted.

> In case you’re just curious about which requirements a request has to meet in order to be a simple request, MDN has [a useful list](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests)!

Okay sure, but what does "preflighted request" even mean, and why does this happen?

<hr>

Before the actual request gets sent, the client generates a preflighted request! The preflighted request contains information about the actual request we’re about to in its `Access-Control-Request-*` headers 🔥

This gives the server information about the actual request that the browser is trying to make: what is the method of the request, what are the additional headers, and so on.

![13](/storage/articles/web/cors/13)

The server receives this preflighted request, and sends an empty HTTP response back with the server's CORS headers! The browser receives the preflight response, which contains no data besides the CORS headers, and checks whether the HTTP request should be allowed! ✅

![14](/storage/articles/web/cors/14)

If that's the case, the browser sends the actual request to the server, which then responds with the data we asked for!

![15](/storage/articles/web/cors/15)

However, if it’s not the case, CORS will block the preflighted request, and the actual request never gets sent ✋🏼 The preflighted request is a great way to prevent us from accessing or modifying resources on servers that don't have any CORS policies enabled (yet)! Servers are now protected from potentially unwanted cross-origin requests 😃

> 💡 In order to reduce the number of roundtrips to our server, we can cache the preflighted responses by adding an `Access-Control-Max-Age` header to our CORS requests! We can cache the preflighted response this way, which the browser can use instead of sending a new preflighted request!

<hr>

## 🍪 Credentials

Cookies, authorization headers, and TLS certificates are by default only set on same-origin requests! However, we may want to use these credentials in our cross-origin request. Maybe we want to include cookies on the request that the server can use in order to identify the user!

Although CORS doesn't include credentials by default, we can change this by adding the `Access-Control-Allow-Credentials` CORS header! 🎉

If we want to include cookies and other authorization headers to our cross-origin request, we need to set the `withCredentials` field to `true` on the request and add the `Access-Control-Allow-Credentials` header to the response.

![16](/storage/articles/web/cors/16)

All set! We can now include credentials in our cross-origin request 🥳

<hr>

Although I think we can all agree that CORS errors can be frustrating at times, it's amazing that it enables us to safely make cross-origin requests in the browser (it should receive a bit more love lol) ✨

Obviously there is so much more to the same-origin policy and CORS than I was able to cover here in this blog post! Luckily, there are many great resources out there like [this one](https://livebook.manning.com/book/cors-in-action/part-1/) or [the W3 spec](https://www.w3.org/wiki/CORS_Enabled) if you want to read more about it 💪🏼
