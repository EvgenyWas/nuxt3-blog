---
id: 3
title: 'Improving SEO without knowing where to start'
description: 'Improving SEO without knowing where to start'
src: 'https://www.htmhell.dev/adventcalendar/2022/8/'
author: 'Alexis Degryse'
keywords: ['fundamentals', 'perfomance', 'refactoring']
---

## Introduction

Colleagues sometimes ask me: _“Hey Alex, I would like to learn a bit about search engine optimisation (SEO) but I don't really know where to start. Do you have tips for me?”_. Well, it's not surprising: like accessibility, sustainability and environment, or performance, SEO is a big topic.

I usually answer: _“It's awesome that you want to dig into this. SEO is also a significant part of UX, and more globally of web quality assurance. Listen, I'm not a SEO expert but I know a solid start: these are the Opquast rules. If you apply them carefully, you will do better than most other websites.”_

In this article, first I would like to describe shortly what SEO means, then present what Opquast is, and finally explain the benefits of some Opquast's SEO rules.

Disclaimer: Opquast is a society. I am neither an employee nor an affiliate.

<br>

## What is SEO ?

**SEO** stands for **S**earch **E**ngine **O**ptimisation. It comprises improving the visibility of a page, a site, an application in search engine results pages (abbreviated **SERP**). Being positioned on the first page is obviously a good thing for the owner of a site, but it's also about helping search and indexing tools to extract content efficiently, helping users find your content, improving the visual and vocal reproduction of search results to users.

Many people say “SEO is a marathon, not a sprint”, and they're right. As Frederick O’Brien wrote in his article [A Smashing Guide To The World Of Search Engine Optimization](https://www.smashingmagazine.com/smashing-guide-search-engine-optimization/#playing-the-long-game) on Smashing Magazine:

> _Implementing best practice can produce immediate results, but long-term performance requires long-term maintenance._

We could also establish that SEO is about getting as close as possible to the “requirements” of Google and its Page Rank calculation algorithm, but I suggest you don't bother too much with that, especially since the statements of SEO agencies, official communication from Google, and engineers at Google can sometimes contradict each other.

SEO is cool because it makes developers and designers care about web quality (I personally prefer this term rather than UX). Long ago, SEO strategies were mostly about accumulating backlinks (regardless of the quality) and putting important keywords everywhere.

Things have fortunately changed. Today, search engines will favor sites which care about users:

- **Content:** both in style (spelling, grammar, freshness of content, consistency between titles, content and keywords) and substance (relevance, reliability, veracity, completeness)
- **Netlinking**: quality backlinks
- **Performance:** _“Hello Core Web Vitals”_
- **Responsiveness**: today, more than half of search queries now come from mobile devices
- **Semantics:** a well-structured and intelligently designed site in HTML is easier to browse by an indexing robot, informations are extracted in a clearer way
- **Accessiblity:** (although it's not a direct ranking factor): always a good thing to remember, accessibility means that people with disabilities can perceive, understand, navigate, contribute and interact with the web2
- **Security:** HTTPS, protection from XSS, tracking, info leaks, etc.

<br>

## Web quality with Opquast

[Opquast](https://www.opquast.com/en/) is a French pioneering company in web quality assurance, focused on “Making the web better”. Opquast is well-known in France for having created The Web Quality Assurance Checklist (under open CC-BY-SA license, available in English, French and Spanish), a list of 240 rules to improve your sites and take better care of your users. Opquast ensures that each of these 240 rules is written in such a way that they are:

- **Transversal:** they are understandable by everyone (developer, designer, dev ops, community manager, marketing manager, sales, web editor, project manager, etc.)
- **Universal:** they are the subject of consensus in consultation with a broad community of experts, agencies, companies and higher education
- **Sustainable:** they are made to last over time
- easily **Verifiable**
- **Useful for users**
- **Realistic**

These rules cover a wide range of topics (security, links, personal information, performance, navigation, images, forms, newsletters, structure, e-commerce, etc.).

Some examples:

- [Rule n° 39](https://checklists.opquast.com/en/web-quality-assurance/the-period-of-validity-and-conditions-of-special-offers-and-promotions-are-indicated) - The period of validity and conditions of special offers and promotions are indicated
- [Rule n° 171](https://checklists.opquast.com/en/web-quality-assurance/it-is-possible-to-unsubscribe-from-newsletters-from-the-website) - It is possible to unsubscribe from newsletters from the website
- [Rule n° 16](https://checklists.opquast.com/en/web-quality-assurance/accounts-can-be-created-without-the-need-to-use-a-third-party-identification-system) - Account creation is possible without the need to use a third-party identification system.

Among these 240 rules, 37 are SEO-related (you'll notice that some rules cover several topics at once) and I want to show you some of them.

<br>

## SEO-related Opquast rules

### Describe information about the page

> [Rule n° 3](https://checklists.opquast.com/en/web-quality-assurance/each-pages-source-code-contains-metadata-that-describe-the-content) - Each page’s source code contains metadata that describes the content.

Thanks to `meta` tags, search engines can provide a short description of the page to users in search result pages (SERP). (Besides, it can be automatically displayed when you share a link on social networks).

```html
<meta
  name="description"
  content="information about the page here"
/>
```

If you omit it, you let search engines choose the description for you (and that's rarely a good thing).

### Identify the site and its content

> [Rule n° 97](https://checklists.opquast.com/en/web-quality-assurance/each-page-provides-a-title-that-enables-one-to-identify-the-site) - Each page provides a title that enables one to identify the website.

> [Rule n° 98](https://checklists.opquast.com/en/web-quality-assurance/each-page-provides-a-title-that-enables-one-to-identify-its-content) - Each page provides a title that enables one to identify its content.

Text in the `title` element is really important, it's used everywhere: tabs, bookmarks, favorites, homescreen phone, screen readers, share preview, social media. And in SERP obviously.

![bk-fail-98](/storage/articles/html/improving-seo/bk-fail-98)

In the `title` element from the "Customer Support" page of the Burger King website, the text is just "Burger King". The site is identified but not the content (Notice how it fails rule n° 3).

### Alternative text

> [Rule n° 111](https://checklists.opquast.com/en/web-quality-assurance/each-decorative-image-has-an-appropriate-text-alternative) - Each decorative image has an appropriate text alternative.

If an image doesn't provide any important information for the good understanding of the content, simply add `alt=""` to it. Otherwise, you let this sort thing happen:

![casto-fail-111](/storage/articles/html/improving-seo/casto-fail-111)

> [Rule n° 113](https://checklists.opquast.com/en/web-quality-assurance/each-information-carrying-image-has-an-appropriate-text-alternative) - Each information-carrying image has an appropriate text alternative.

When an image contains textual and/or visual information useful to understanding the content, it must be described in the `alt` attribute. As you saw in the example of rule n° 97, alternative texts are also taken into account.

```html
<div class="f-incentiveBox__content">
  <img src="/brutX-logo-v2.png" />

  <b>1 MOIS OFFERT</b> puis 4,99€/mois
</div>
```

This piece of HTML is from a product page on fnac.com. The product is on sale with a one-month free offer at a video streaming platform (BrutX). But if you are an indexing robot (or a screen reader user), you wouldn't know because the `alt` attribute is missing.

### Links

> [Rule n° 112](https://checklists.opquast.com/en/web-quality-assurance/each-image-link-has-an-appropriate-text-alternative) - Each image link has an appropriate text alternative.

Users hate unlabeled links. Indexing robots too. They will find this content irrelevant and hard to reference.

```html
<a
  href="/actualite-sup_veto_formation_asv"
  target="_blank"
>
  <img
    src="/imageDiplomeo032022.jpg"
    alt=""
  />
</a>
```

This piece of HTML is from supveto.com. There is an `alt` attribute, but it's empty and it doesn't provide the link with an accessible name.

> [Rule n° 147](https://checklists.opquast.com/en/web-quality-assurance/all-hyperlinks-internal-to-the-site-are-valid) - All links internal to the website are valid.

I said indexing robots hate unlabeled links; they hate broken links even more. You might not be able to check external links regularly but regarding internal links, try to set up a routine (automated or not) to check their validity.

### A bit of semantics

> [Rule n° 125](https://checklists.opquast.com/en/web-quality-assurance/each-pages-source-code-specifies-the-contents-main-language) - Each page’s source code indicates the content’s main language.

Another easy way to help indexing robots crawl your content is to fill the `lang` attribute at the root of the document. Because the natural language of a page isn't always identifiable by tools as screen readers, translation tools, indexing robots, etc.

Example for English:

```html
<html lang="en"></html>
```

You can also indicate a temporary change of language inside content:

```html
<html lang="en">
  ...
  <body>
    ...
    <ul>
      ...
      <li>
        <a href="path/to/german/content"> <span lang="de">Deutsch</span> (German) </a>
      </li>
      <li>
        <a href="path/to/danish/content"> <span lang="da">Dansk</span> (Danish) </a>
      </li>
      ...
    </ul>
  </body>
</html>
```

Available values are listed on [iana.org](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry).

> [Rule n° 224](https://checklists.opquast.com/en/web-quality-assurance/the-date-of-publication-or-update-of-the-contents-is-made-available-in-a-programmatic-form) - The date of publication or update of the contents is made available in a programmatic form.

I always recommend showing a publication date on content pages. It allows users to put what they read into context (reading an article from 2007 is not the same as reading an article from 2022).

Indexing robots also appreciate having a date, even more when it's explicit. See some examples below:

```mdc
Updated on <time datetime="2022-06-12">June 12</time>.
Published on <time datetime="2022-09-27">Sep 27, 2022</time>.
The event starts at <time datetime="20:00">8pm</time>.
```

More examples about this format on [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time#valid_datetime_values) and infos on [html.spec.whatwg.org](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#dates-and-times).

> [Rule n° 227](https://checklists.opquast.com/en/web-quality-assurance/each-pages-content-is-organized-according-to-a-hierarchical-structure-of-headings-and-sub-headings) - Each page’s content is organized according to a hierarchical structure of headings and sub-headings.

Headings are a truly big topic. They are very helpful for users and assistive technologies to apprehend the structure of a page and navigate it. They are also useful for indexing tools because they help them understand what should be considered important. Thus:

- don't use too long headings.
- don't skip levels (for example, an `h3` must not be followed by an `h5` or `h6`).
- don't use `hx` only for visual purposes (use CSS instead)
- don't use too many headings (if everything is important, nothing is).

![nike-fail-227](/storage/articles/html/improving-seo/nike-fail-227)

The structure would benefit from being clearer and more relevant here, especially the multiple headings “Nike Sportwear” are really confusing.

### PDF

Indexing robots crawl PDF documents as well. You can access a PDF document directly from a SERP.

> [Rule n° 233](https://checklists.opquast.com/en/web-quality-assurance/the-text-of-internal-pdf-documents-can-be-selected) - The text of internal PDF documents can be selected.

Not being selectable means that the content of the PDF cannot be crawled (in addition to not being able to be copied, searchable, clickable, translatable, vocalizable). Scanned document are a pain for users, for indexing robots too.

> [Rule n° 234](https://checklists.opquast.com/en/web-quality-assurance/internal-pdf-documents-are-given-a-structure-based-on-headings) - Internal PDF documents are given a structure based on titles.

This one is a variant of the rule 227. The same benefits apply here as well. Use the formatting tools (Heading 1, Heading 2, etc.) in your software to generate a structured PDF.

<br>

## Conclusion

That's it! There are other rules. I invite you to dig more into these (writing about every rule would have made this article way too long). Remember: your approach towards SEO has to be "user first" (search engines will reward you for that). Think this way about SEO, but also for accessibility, performance, privacy, responsive design, eco-conception. Imagine all these themes cohabiting and interacting in a virtuous circle.

### Find out more

- [Opquast - The Web Quality Assurance Checklist](https://checklists.opquast.com/en/web-quality-assurance/)
- [Google - Get started with Search: a developer's guide](https://developers.google.com/search/docs/fundamentals/get-started-developers)
- [Google - Search Engine Optimization (SEO) Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Smashing Magazine - A Smashing Guide To The World Of Search Engine Optimization](https://www.smashingmagazine.com/smashing-guide-search-engine-optimization/)

<hr>

## Footnotes

1. Web Vitals is an initiative by Google to provide unified guidance for quality signals that are essential to delivering a great user experience on the web. See [web.dev/vitals](https://web.dev/vitals/).
2. This definition is from the Web Accessiblity Initiative. More explanation at [w3.org/WAI](https://www.w3.org/WAI/fundamentals/accessibility-intro/#what).
