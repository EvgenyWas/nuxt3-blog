---
id: 2
title: 'HTML Space – How to Add a Non-breaking Space with the &nbsp; Character Entity'
description: "In HTML, you can't create an extra blank space after the space ( ) character with the spacebar. If you want 10 blank spaces in your HTML code and you try to add them with the spacebar, you'll only see one space in the browser."
image: '/storage/articles/html/html-space/image'
src: 'https://www.freecodecamp.org/news/html-space-how-to-add-a-non-breaking-space-with-the-nbsp-character-entity/'
author: 'Kolade Chris'
keywords: ['fundamentals']
---

In HTML, you can't create an extra blank space after the space (` `) character with the spacebar. If you want 10 blank spaces in your HTML code and you try to add them with the spacebar, you'll only see one space in the browser.

Also, one or more of the words that are supposed to be together might break into a new line.

So, in this article, I will show you how to create any number of blank spaces you want in your code, and how to add a non-breaking space with the `&nbsp;` character entity.

<br>

## First, What Are Character Entities?

Character entities are reserved for displaying various characters in the browser.

For instance, the less than symbol (`<`) and greater than symbol (`>`) are reserved for tags in HTML. If you want to use them in your code, HTML might mistake them for opening and closing tags.

If you want to use them as "greater than" and "less than", you need to use their respective character entities (`&lt;` and `&gt;`). Then you can safely display them in the browser.

<br>

## How to Add Non-breaking Spaces in HTML with `&nbsp;`

Since the browser will display only one blank space even if you put millions in your code, HTML has the `&nbsp;` character entity. It makes it possible to display multiple blank spaces.

Without the `&nbsp;` character entity, this is how your code would look:

```html
<div>
  <p>
    Lemurs are primates found exclusively in the isolated island of Madagascar. Lemurs are primates just like apes and
    monkeys, but they evolved independently and are unique. The numbers of lemurs are dwindling due to poaching and
    other destructive human activities. Lemurs are worth more than $2 Trillion. In fact, no amount of money can ever buy
    one. So, protect lemurs!
  </p>
</div>
```

I have added some CSS to make the HTML clearer and to make it easier to see what I'm trying to show:

```css
body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  font-size: 2rem;
}

span {
  background-color: #2ecc71;
}
```

![without-nbsp](/storage/articles/html/html-space/without-nbsp)

In the HTML code below, I inserted some `&nbsp;` character entities to create multiple blank spaces:

```html
<div>
  <p>
    Lemurs &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; are primates found exclusively in the isolated island of Madagascar.
    Lemurs are primates just like apes and monkeys, but they evolved independently and are unique. The numbers of lemurs
    are dwindling due to poaching and other destructive human activities. Lemurs are worth more than $2 Trillion. In
    fact, no amount of money can ever buy one. So, &nbsp; &nbsp; &nbsp; &nbsp; protect lemurs!
  </p>
</div>
```

![one-space-with-nbsp](/storage/articles/html/html-space/one-space-with-nbsp)

You can see there are 5 blank spaces between the first two words, and 4 between the antepenultimate and penultimate words. That’s because I inserted 5 and 4 `&nbsp;` characters, respectively.

Without the `&nbsp;` character entity, that wouldn’t be possible.

<br>

## What if you want a bunch of spaces in your code?

What if, for instance, you want 10 blank spaces in your code? Writing `&nbsp;` 10 times would be redundant and boring.

Instead, HTML provides the `&ensp;` character entity for 2 non-breaking spaces, and `&emsp;` for 4 non-breaking spaces.

```html
<div>
  <p>
    Lemurs &emsp; &nbsp; are primates found exclusively in the isolated island of Madagascar. Lemurs are primates just
    like apes and monkeys, but they evolved independently and are unique. The numbers of lemurs are dwindling due to
    poaching and other destructive human activities. Lemurs are worth more than $2 Trillion. In fact, no amount of money
    can ever buy one. So, &ensp; &ensp; protect lemurs!
  </p>
</div>
```

In the code above, I inserted 5 blank spaces between the first two words by using &emsp; once (4 spaces) and &nbsp; once (1 space). Then I used 2 &ensp entities between the antepenultimate and penultimate words. So, the number of blank spaces remain the same as in the first example:

![mutiple-blanks-pace](/storage/articles/html/html-space/mutiple-blanks-pace)

<br>

## Why would you need a non-breaking space in your code?

Sometimes, HTML might break up words that are supposed to be together into another line – for example, initials, units, dates, amount of money, and more.

The `&nbsp;` character entity prevents this from happening. When you insert the `&nbsp;` character between such words, it will render a space and will never let any of the words break into a new line.

In the HTML code below, I have some information about lemurs – the beautiful primates found in Madagascar:

```html
<div>
  <p>
    Lemurs are primates found exclusively in the isolated island of Madagascar. Lemurs are primates just like apes and
    monkeys, but they evolved independently and are unique. Th numbers of lemurs are dwindling due to poaching and other
    destructive human activities. Lemurs are worth more than <span>$2 Trillion.</span> In fact, no amount of money can
    ever buy one. So, protect lemurs!
  </p>
</div>
```

I have some CSS to make it clearer and show what I'm trying to show:

```css
body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  font-size: 2rem;
}

span {
  background-color: #2ecc71;
}
```

The result looks like this:

![breaking-space](/storage/articles/html/html-space/breaking-space)

You can see that the $2 Trillion breaks, which does not look good as it might confuse the reader.

The `&nbsp;` character entity forces the two words together:

```html
<div>
  <p>
    Lemurs are primates found exclusively in the isolated island of Madagascar. Lemurs are primates just like apes and
    monkeys, but they evolved independently and are unique. Th numbers of lemurs are dwindling due to poaching and other
    destructive human activities. Lemurs are worth more than <span>$2&nbsp;Trillion.</span> In fact, no amount of money
    can ever buy one. So, protect lemurs!
  </p>
</div>
```

![non-breaking-space](/storage/articles/html/html-space/non-breaking-space)

How cool is that!

<br>

## Conclusion

You have seen that with the `&nbsp;`, `&ensp;`, and the `&emsp;` character entities, you can display blank spaces in the browser. This isn't possible just using the spacebar key.

You can also use the `&nbsp;` character entity in specific places to prevent words that should stay together from breaking into the next line.

Thank you for reading, and keep coding.
