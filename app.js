import { PETS, ageGroup, formatAge, filterPets } from "./pets.js";

const FAV_KEY = "petpulse-favourites";
const THEME_KEY = "petpulse-theme";

const grid = document.querySelector("#petGrid");
const filtersForm = document.querySelector("#filters");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const favCount = document.querySelector("#favCount");
const favList = document.querySelector("#favList");
const favEmpty = document.querySelector("#favEmpty");
const modalEl = document.querySelector("#petModal");
const modal = new bootstrap.Modal(modalEl);
const applyForm = document.querySelector("#applyForm");
const applySuccess = document.querySelector("#applySuccess");

const photoCache = new Map();
let favourites = new Set(readJson(FAV_KEY, []));
let activePet = null;

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable — favourites last for this visit only.
  }
}

/** Resolve a photo URL: Dog CEO for dogs (by breed), Cat-as-a-Service for cats. Cached per id. */
async function photoFor(key, { dogBreed } = {}) {
  if (photoCache.has(key)) return photoCache.get(key);
  let url;
  if (dogBreed) {
    try {
      const response = await fetch(`https://dog.ceo/api/breed/${dogBreed}/images/random`);
      const data = await response.json();
      if (data.status !== "success") throw new Error(data.message);
      url = data.message;
    } catch {
      url = "https://dog.ceo/img/dog-api-logo.svg";
    }
  } else {
    url = `https://cataas.com/cat?width=480&height=360&seed=${encodeURIComponent(key)}`;
  }
  photoCache.set(key, url);
  return url;
}

async function loadImage(img, key, dogBreed) {
  img.src = await photoFor(key, { dogBreed });
}

function petCard(pet) {
  const col = document.createElement("div");
  col.className = "col-sm-6 col-lg-4 col-xl-3";
  const saved = favourites.has(pet.id);
  col.innerHTML = `
    <article class="card pet-card h-100 border-0 shadow-sm rounded-4">
      <div class="position-relative">
        <img class="card-img-top pet-photo rounded-top-4" alt="" loading="lazy">
        <button type="button" class="btn fav-btn ${saved ? "is-saved" : ""}" data-fav aria-pressed="${saved}"></button>
        <span class="badge age-badge"></span>
      </div>
      <div class="card-body">
        <h3 class="card-title h5 fw-black mb-1"></h3>
        <p class="card-text small text-body-secondary mb-2 pet-meta"></p>
        <div class="d-flex flex-wrap gap-1 traits"></div>
      </div>
      <div class="card-footer bg-transparent border-0 pt-0 pb-3">
        <button type="button" class="btn btn-outline-brand rounded-pill w-100" data-open>Meet ${pet.species === "dog" ? "👋🐶" : "👋🐱"}</button>
      </div>
    </article>`;
  // Dynamic values go through textContent/attributes, never innerHTML.
  col.querySelector(".card-title").textContent = pet.name;
  col.querySelector(".pet-meta").textContent = `${pet.sex} · ${formatAge(pet.ageYears)} · ${pet.shelter}`;
  col.querySelector(".age-badge").textContent = ageGroup(pet.ageYears);
  col.querySelector(".pet-photo").alt = `${pet.name}, a ${pet.species}`;
  col.querySelector("[data-fav]").setAttribute("aria-label", `${saved ? "Remove" : "Save"} ${pet.name}`);
  col.querySelector("[data-fav]").textContent = saved ? "♥" : "♡";
  const traits = [`⚡ ${pet.energy} energy`, pet.kids ? "👶 Kid-friendly" : "🧘 Adults only"];
  col.querySelector(".traits").append(...traits.map((t) => Object.assign(document.createElement("span"), { className: "badge trait", textContent: t })));
  col.querySelector("article").dataset.petId = pet.id;
  loadImage(col.querySelector(".pet-photo"), pet.id, pet.breed);
  return col;
}

function render() {
  const filters = {
    species: filtersForm.species.value,
    age: filtersForm.age.value,
    kids: filtersForm.kids.checked,
  };
  const pets = filterPets(PETS, filters);
  grid.replaceChildren(...pets.map(petCard));
  resultCount.textContent = `${pets.length} ${pets.length === 1 ? "friend" : "friends"} waiting for you`;
  emptyState.classList.toggle("d-none", pets.length > 0);
}

function renderFavourites() {
  favCount.textContent = favourites.size;
  const items = PETS.filter((pet) => favourites.has(pet.id)).map((pet) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center px-0";
    const name = Object.assign(document.createElement("button"), { type: "button", className: "btn btn-link p-0 fw-bold", textContent: pet.name });
    name.addEventListener("click", () => {
      bootstrap.Offcanvas.getInstance("#favourites")?.hide();
      openPet(pet.id);
    });
    const remove = Object.assign(document.createElement("button"), { type: "button", className: "btn btn-sm btn-outline-secondary rounded-pill", textContent: "Remove" });
    remove.addEventListener("click", () => toggleFavourite(pet.id));
    li.append(name, remove);
    return li;
  });
  favList.replaceChildren(...items);
  favEmpty.classList.toggle("d-none", items.length > 0);
}

function toggleFavourite(id) {
  favourites.has(id) ? favourites.delete(id) : favourites.add(id);
  writeJson(FAV_KEY, [...favourites]);
  render();
  renderFavourites();
}

async function openPet(id) {
  const pet = PETS.find((p) => p.id === id);
  if (!pet) return;
  activePet = pet;
  modalEl.querySelector("#petModalTitle").textContent = `Meet ${pet.name}`;
  modalEl.querySelector(".modal-bio").textContent = pet.bio;
  const facts = [
    ["Age", formatAge(pet.ageYears)],
    ["Sex", pet.sex],
    ["Energy", pet.energy],
    ["Good with kids", pet.kids ? "Yes" : "Better with adults"],
    ["Shelter", pet.shelter],
  ];
  modalEl.querySelector(".modal-facts").replaceChildren(...facts.map(([label, value]) => {
    const li = document.createElement("li");
    li.innerHTML = "<strong></strong> ";
    li.querySelector("strong").textContent = `${label}:`;
    li.append(value);
    return li;
  }));
  const photo = modalEl.querySelector(".modal-photo");
  photo.alt = `${pet.name}, a ${pet.species}`;
  photo.src = await photoFor(pet.id, { dogBreed: pet.breed });
  applyForm.reset();
  applyForm.classList.remove("was-validated", "d-none");
  applySuccess.classList.add("d-none");
  modal.show();
}

grid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-pet-id]");
  if (!card) return;
  if (event.target.closest("[data-fav]")) toggleFavourite(card.dataset.petId);
  else if (event.target.closest("[data-open]")) openPet(card.dataset.petId);
});

filtersForm.addEventListener("change", render);
filtersForm.addEventListener("submit", (event) => event.preventDefault());

applyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyForm.classList.add("was-validated");
  if (!applyForm.checkValidity()) return;
  const name = applyForm.querySelector("#applicantName").value.trim().split(" ")[0];
  applySuccess.textContent = `Thanks ${name}! ${activePet.shelter.split(",")[0]} will call you within 48 hours about ${activePet.name}. (Demo: nothing was sent.)`;
  applySuccess.classList.remove("d-none");
  applyForm.classList.add("d-none");
});

document.querySelector("#themeToggle").addEventListener("click", (event) => {
  const next = document.documentElement.dataset.bsTheme === "dark" ? "light" : "dark";
  document.documentElement.dataset.bsTheme = next;
  event.currentTarget.textContent = next === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
});
if (document.documentElement.dataset.bsTheme === "dark") document.querySelector("#themeToggle").textContent = "☀️";

document.querySelectorAll("[data-dog]").forEach((img) => loadImage(img, `hero-${img.dataset.dog}`, img.dataset.dog));
document.querySelectorAll("[data-cat]").forEach((img) => loadImage(img, img.dataset.cat));

render();
renderFavourites();
