<template>
  <article>
    <ContentQuery
      v-slot="{ data }"
      path="/about"
      find="one"
    >
      <ContentRenderer :value="data" />
    </ContentQuery>
  </article>
</template>
