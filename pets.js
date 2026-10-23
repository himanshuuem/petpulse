// Fictional shelter data. `breed` maps to a Dog CEO API path for real photos.
export const PETS = [
  { id: "bruno", name: "Bruno", species: "dog", breed: "beagle", ageYears: 1.5, sex: "Male", kids: true, energy: "High", shelter: "Happy Tails, Pune", bio: "A nose-first explorer who will follow a biscuit trail anywhere. Loves fetch and afternoon naps in equal measure." },
  { id: "luna", name: "Luna", species: "cat", ageYears: 3, sex: "Female", kids: true, energy: "Medium", shelter: "Whisker Haven, Bengaluru", bio: "Window-watcher and professional sunbeam tester. Purrs the moment you sit down." },
  { id: "biscuit", name: "Biscuit", species: "dog", breed: "labrador", ageYears: 9, sex: "Male", kids: true, energy: "Low", shelter: "Second Chance, Delhi", bio: "A gentle senior who has mastered sit, stay and the art of the head-on-knee stare." },
  { id: "shadow", name: "Shadow", species: "cat", ageYears: 0.8, sex: "Male", kids: false, energy: "High", shelter: "Whisker Haven, Bengaluru", bio: "Tiny panther energy. Best in a calm, adult home where he can climb everything." },
  { id: "kaju", name: "Kaju", species: "dog", breed: "pariah", ageYears: 2.5, sex: "Female", kids: true, energy: "Medium", shelter: "Indie Paws, Kolkata", bio: "A street-smart Indie who aced obedience class. Loyal, healthy and ready for her forever couch." },
  { id: "mochi", name: "Mochi", species: "cat", ageYears: 10, sex: "Female", kids: true, energy: "Low", shelter: "Second Chance, Delhi", bio: "A dignified senior who wants a lap, a heater and someone to talk to." },
  { id: "rocket", name: "Rocket", species: "dog", breed: "husky", ageYears: 4, sex: "Male", kids: false, energy: "Very high", shelter: "Happy Tails, Pune", bio: "Needs a runner, a hiker or a very big garden. Sings instead of barking." },
  { id: "pepper", name: "Pepper", species: "dog", breed: "pug", ageYears: 6, sex: "Female", kids: true, energy: "Low", shelter: "Indie Paws, Kolkata", bio: "Snores like a tractor, loves like a saint. Prefers short walks and long cuddles." },
];

export function ageGroup(ageYears) {
  if (ageYears < 2) return "young";
  if (ageYears >= 8) return "senior";
  return "adult";
}

export function formatAge(ageYears) {
  if (ageYears < 1) return `${Math.round(ageYears * 12)} months`;
  return `${ageYears} ${ageYears === 1 ? "year" : "years"}`;
}

export function filterPets(pets, { species = "all", age = "all", kids = false }) {
  return pets.filter((pet) =>
    (species === "all" || pet.species === species) &&
    (age === "all" || ageGroup(pet.ageYears) === age) &&
    (!kids || pet.kids));
}
