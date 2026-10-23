# 🐾 PetPulse

> An adoptable-pet finder UI built on **Bootstrap 5**, with a custom theme, live dog and cat photos, filters, favourites, a details modal with a validated adoption form, and dark mode.

**🔗 Live demo:** https://himanshuuem.github.io/petpulse/

![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/ES_Modules-F7DF1E?logo=javascript&logoColor=black)
![Tests](https://img.shields.io/badge/tests-node%3Atest-339933?logo=node.js&logoColor=white)

## ✨ Features

- **Bootstrap, re-themed:** a coral brand palette applied through Bootstrap's CSS variables (`--bs-btn-*`), the Nunito typeface and a glass navbar, so it doesn't look like a default template.
- **Real photos at runtime:** dogs come from the [Dog CEO API](https://dog.ceo/dog-api/) by breed and cats from [Cat as a Service](https://cataas.com). URLs are cached per pet so cards stay consistent.
- **Filters** for species, age group and "good with kids", built from Bootstrap form controls and a switch. The filtering logic is a pure, tested function.
- **Favourites** saved in `localStorage` and listed in an **offcanvas** drawer.
- **Pet modal** with facts and an **adoption form** using Bootstrap's `needs-validation` pattern (required fields, a phone pattern, feedback messages).
- **Dark mode** through Bootstrap 5.3's `data-bs-theme`. The choice is remembered and applied before first paint.
- A collage hero, a three-step section and a testimonial carousel.
- Safe rendering: every pet field goes through `textContent`.

## 🛠 Tech Stack

Bootstrap 5.3 (grid, navbar, modal, offcanvas, carousel, forms) · Custom CSS · Vanilla JS ES modules · Dog CEO API · Cat as a Service · `node:test`

## 📁 Structure

```
petpulse/
├── index.html      # Bootstrap layout, modal, offcanvas
├── styles.css      # Brand theme over Bootstrap variables
├── pets.js         # Pet data + pure filter helpers
├── pets.test.js    # Unit tests
├── app.js          # Rendering, favourites, modal, theme
└── package.json
```

## 🚀 Run Locally

```bash
git clone https://github.com/himanshuuem/petpulse.git
cd petpulse
npm start     # http://localhost:3000
npm test
```

## 📚 Origin

This is a reimagining of **TinDog**, the Bootstrap project from [The Complete Web Development Bootcamp](https://www.udemy.com/course/the-complete-web-development-bootcamp/). The pets, shelters and stories are fictional.

---

Made by [Himanshu](https://github.com/himanshuuem)
