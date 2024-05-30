---
id: 5
title: 'Why "optimizing" your images with Base64 is almost always a bad idea'
description: 'Unfortunately, even to this day, some optimization plugins and blogs suggest "optimizing" your images by encoding them to Base64 and including that straight into your HTML.'
image: '/storage/articles/web/why-optimizing-your-images-with-base64-is-almost-always-a-bad-idea/image'
src: 'https://bunny.net/blog/why-optimizing-your-images-with-base64-is-almost-always-a-bad-idea/'
author: 'Dejan Grofelnik Pelzel'
keywords: ['perfomance']
---

Unfortunately, even to this day, some optimization plugins and blogs suggest "optimizing" your images by encoding them to Base64 and including that straight into your HTML.

In this post, I want to address why in this day and age, this is almost always a very bad idea that has been carried over from years ago. Back then, web browsers had heavy limits on the number of concurrent connections they could send to the server. This meant an image heavy website would need to queue up requests and wait for the ones before to finish. Base64 provided a way of working around that by using an already open HTTP connection to deliver images embedded directly into the HTML or CSS. This effectively removed the need for an extra roundtrip the browser would need for each of the files.

With the introduction of multiplexing that arrived with HTTP/2, web browsers have become incredibly efficient in delivering hundreds of files through a single connection. This works around most limits that the Base64 encoding solved and in fact means Base64 now does more bad than good.

To get to the answer why, we first need to establish what Base64 actually is. To put it simply, Base64 is an encoding schema used for representing binary data in a text format. This is useful when the storage or delivery medium does not support binary data such as when embedding an image into a database, CSS files or HTML. One must be careful to not mix up compression with encoding. While compression actually compresses data, encoding just defines a way how data is encoded, which brings us to the first issue.

<br>

## Download size increase

Although Base64 is a relatively efficient way of encoding binary data it will, on average still increase the file size for more than 25%. This not only increases your bandwidth bill, but also increases the download time.

![base64-image-size-comparison-1](/storage/articles/web/why-optimizing-your-images-with-base64-is-almost-always-a-bad-idea/base64-image-size-comparison-1)

<br>

## CPU Overhead

When delivering images in Base64, the browser first needs to decode the Base64 encoded strings and then decode the images as well, which introduces an extra layer of unnecessary work. Base64 is very efficient, but count in the GZip or Brotli processing time that happens on the server to compress the response and the milliseconds quickly start adding up.

<br>

## Caching Issues

The third issue is perhaps the biggest performance killer, but perhaps not the most obvious at first glance. When a user accesses your website, the browser will automatically cache the images locally and then load them directly from your disk when visiting the same page again. Due to how Base64 works, the browser is unable to store the images locally so it will always need to fetch them from your server or CDN which creates extra load on your server as well as increases your bandwidth bill.

Another issue here is that if your images are embedded in your HTML code, content delivery networks such as BunnyCDN are not able to cache the files and they will always be returned from your origin server which might be thousands of kilometers away.

<br>

## SEO and User Experience

The issues are actually not only limited to performance. By using Base64 encoded images on your website, you might also be hurting both your SEO and user experience as well.

The reason for this is that sharing Base64 images is much harder due to the fact that they are not actually accessible via a public URL. This means that web crawlers and your users are unable to get links pointing back to your website, which makes sharing content much harder and can potentially hurt your "page rank" as well.

<br>

## When to actually use Base64?

Base64 has a lot of uses in technology, but unless you have a very good reason, you should try to avoid using it as part of your HTML or CSS files. There are some edge cases where Base64 might actually be useful.

One such example would be very small images, where the Base64 string is actually smaller than the length of an URL string and HTTP request overhead when linking to an image file. Take for example a 1x1 pixel transparent PNG. Despite the original image being only 68 bytes in size, factoring in the HTTP headers etc, it actually ends up being bigger than the Base64 encoded string:

> Empty transparent pixel:
> iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=

If you ever run into a blog that suggests using Base64 to improve performance, make sure to take it with a grain of salt and evaluate carefully if there are any real benefits that apply to your own use-case.
