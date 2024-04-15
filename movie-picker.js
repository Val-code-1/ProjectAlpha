// This is our unique key for the API. Documentation found at https://api.watchmode.com/docs/#title
const key = "5fv18iHmaUTf60qgnI787JkHHyYaRDCxcvHhw8T3";

const typeArray = []; // This will store the selected media types
const genreArray = []; // This will store the selected genres
const sourceArray = []; // This will store the selected streaming services

let searchButton = document.getElementById("find-movie-button");
let results = document.getElementById("results");

searchButton.addEventListener("click", () => {
  let url = `https://api.watchmode.com/v1/list-titles/?apiKey=${key}&source_ids=${sourceArray.join(
    ","
  )}&genres=${genreArray.join(",")}&types=${typeArray.join(",")}&limit=20`;

  fetch(url, { method: "Get" })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
    });
});

document.querySelectorAll("#streaming-services-box img").forEach((img) => {
  img.addEventListener("click", toggleSourceSelection);
});

document.querySelectorAll("#genres-box img").forEach((img) => {
  img.addEventListener("click", toggleGenreSelection);
});

document.querySelectorAll("#media-type-box img").forEach((img) => {
  img.addEventListener("click", toggleTypeSelection);
});

function toggleSourceSelection(event) {
  const img = event.target;
  const isSelected = img.getAttribute("data-selected") === "true";
  const sourceId = img.getAttribute("data-api-id");
  if (isSelected) {
    img.classList.remove("selected");
    img.setAttribute("data-selected", "false");
    sourceArray = sourceArray.filter((id) => id !== sourceId);
  } else {
    img.classList.add("selected");
    img.setAttribute("data-selected", "true");
    if (!sourceArray.includes(sourceId)) {
      sourceArray.push(sourceId);
    }
  }
}

function toggleGenreSelection(event) {
  const img = event.target;
  const isSelected = img.getAttribute("data-selected") === "true";
  const sourceId = img.getAttribute("data-api-id");
  if (isSelected) {
    img.classList.remove("selected");
    img.setAttribute("data-selected", "false");
    genreArray = genreArray.filter((id) => id !== sourceId);
  } else {
    img.classList.add("selected");
    img.setAttribute("data-selected", "true");
    if (!genreArray.includes(sourceId)) {
      genreArray.push(sourceId);
    }
  }
}

function toggleTypeSelection(event) {
  const img = event.target;
  const isSelected = img.getAttribute("data-selected") === "true";
  const sourceId = img.getAttribute("data-api-id");
  if (isSelected) {
    img.classList.remove("selected");
    img.setAttribute("data-selected", "false");
    typeArray = typeArray.filter((id) => id !== sourceId);
  } else {
    img.classList.add("selected");
    img.setAttribute("data-selected", "true");
    if (!typeArray.includes(sourceId)) {
      typeArray.push(sourceId);
    }
  }
}
