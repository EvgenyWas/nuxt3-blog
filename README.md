<div align="center">

# [Nuxt3 Blog](https://nuxt3-blog-mu.vercel.app/)

🖼 My pet project within mentoring at KMS Lighthouse

</div>

---

## ⚒️ Tech stack
<div>
<img alt="Nuxt" src="https://img.shields.io/badge/NuxtJS-0f172a?logo=nuxtdotjs">
<img alt="Nuxt Content" src="https://img.shields.io/badge/NuxtContent-0f172a?logo=nuxtdotjs">
<img alt="Vuetify" src="https://img.shields.io/badge/Vuetify-0f172a?logo=vuetify">
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-0f172a?logo=typescript">
<img alt="Vercel" src="https://img.shields.io/badge/Vercel-0f172a?logo=vercel">
<img alt="PNPM" src="https://img.shields.io/badge/PNPM-0f172a?logo=pnpm">
<img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-0f172a?logo=mongodb">
<img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-0f172a?logo=mongoosedotws">
<img alt="Zod" src="https://img.shields.io/badge/Zod-0f172a?logo=zod">
<img alt="Cloudinary" src="https://img.shields.io/badge/Cloudinary-0f172a?logo=cloudinary">
</div>

- **Framework** → [Nuxt](https://nuxtjs.org/)
- **Content** → [Nuxt Content](https://content.nuxtjs.org/)
- **Design System** → [Vuetify](https://vuetifyjs.com/)
- **Language** → [Typescript](https://www.typescriptlang.org/)
- **Deployment** → [Vercel](https://vercel.com/)
- **Package Manager** → [pnpm](https://pnpm.io/)
- **Data Base** → [MongoDB](https://www.mongodb.com/)

## ⚡ Running locally

```bash
# Installation (recommended for nuxt3)
pnpm i --shamefully-hoist

# Development server
pnpm dev
```

Add a `.env` file with the following content:

```env
# Cloudinary
NUXT_CLOUDINARY_CLOUD_NAME=...
NUXT_CLOUDINARY_API_KEY=...
NUXT_CLOUDINARY_API_SECRET=...

# MongoDB
NUXT_MONGODB_URL=...

# GitHub
NUXT_GITHUB_CLIENT_ID=...
NUXT_GITHUB_CLIENT_SECRET=...

# Google
NUXT_GOOGLE_CLIENT_ID=...
NUXT_GOOGLE_CLIENT_SECRET=...

# JWT
NUXT_JWT_ACCESS_SECRET=...
NUXT_JWT_REFRESH_SECRET=...

# Your app URL
NUXT_PUBLIC_APP_URL=...
```

## 📄 License

[MIT](./LICENSE) © Yauheni Vasiukevich
