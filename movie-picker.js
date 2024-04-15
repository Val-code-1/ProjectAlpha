// This is our unique key for the API. Documentation found at https://api.watchmode.com/docs/#title
const key = "5fv18iHmaUTf60qgnI787JkHHyYaRDCxcvHhw8T3";

let typeArray = []; // This will store the selected media types
let genreArray = []; // This will store the selected genres
let sourceArray = []; // This will store the selected streaming services
let ratingArray = []; // This will store the selected ratings
let runtimeArray = []; // This will store the selected runtimes

// Converts the type images into selectable buttons
document.querySelectorAll("#media-type-icons img").forEach((img) => {
  img.addEventListener("click", toggleTypeSelection);
});

// Converts the genre images into selectable buttons
document.querySelectorAll("#genre-container img").forEach((img) => {
  img.addEventListener("click", toggleGenreSelection);
});

// Converts the streaming service images into selectable buttons
document.querySelectorAll("#source-container img").forEach((img) => {
  img.addEventListener("click", toggleSourceSelection);
});

// Converts the rating images into selectable buttons
document.querySelectorAll("#ao-rating-section img").forEach((img) => {
  img.addEventListener("click", toggleRatingSelection);
});

// Converts the runtime images into selectable buttons
document.querySelectorAll("#ao-runtime-section img").forEach((img) => {
  img.addEventListener("click", toggleRuntimeSelection);
});

// Ensures that the 'Any' option appears selected by default, and that the search button is enabled
document.querySelectorAll("img").forEach((img) => {
  if (img.dataset.selected === "true") {
    img.classList.add("selected");
  }
});

// Selects/deselects the type images, updates the typeArray, and enables/disables the search button
function toggleTypeSelection(event) {
  const img = event.target;
  const mediaTypeButton = document.querySelector("#type-next-button-image");
  const isSelected = img.getAttribute("data-selected") === "true";
  const sourceId = img.getAttribute("data-api-id");
  if (isSelected) {
    img.classList.remove("selected");
    img.setAttribute("data-selected", "false");
    typeArray = typeArray.filter((id) => id !== sourceId);
    if (typeArray.length === 0) {
      mediaTypeButton.disabled = true;
      mediaTypeButton.style.opacity = 0.3;
    }
  } else {
    img.classList.add("selected");
    img.setAttribute("data-selected", "true");
    if (!typeArray.includes(sourceId)) {
      typeArray.push(sourceId);
    }
    if (typeArray.length > 0) {
      mediaTypeButton.disabled = false;
      mediaTypeButton.style.opacity = 1;
    }
  }
}

// Selects/deselects the genre images, updates the genreArray, and enables/disables the search button
function toggleGenreSelection(event) {
  const img = event.target;
  const genreButton = document.querySelector("#genre-next-button-image");
  const isSelected = img.getAttribute("data-selected") === "true";
  const sourceId = img.getAttribute("data-api-id");
  if (isSelected) {
    img.classList.remove("selected");
    img.setAttribute("data-selected", "false");
    if (genreArray.includes(sourceId)) {
      genreArray = genreArray.filter((id) => id !== sourceId);
    }
    if (genreArray.length === 0) {
      genreButton.disabled = true;
      genreButton.style.opacity = 0.3;
    }
  } else {
    if (sourceId === "all") {
      genreArray = [];
      const possibleGenres = document.querySelectorAll("#genre-icons img");
      possibleGenres.forEach((genre) => {
        if (genre.classList.contains("selected")) {
          genre.classList.remove("selected");
        }
        genre.setAttribute("data-selected", "false");
      });
      img.classList.add("selected");
      img.setAttribute("data-selected", "true");
      genreButton.disabled = false;
      genreButton.style.opacity = 1;
    } else {
      const allGenresButton = document.getElementById("all-genres-icon");
      if (allGenresButton.dataset.selected === "true") {
        allGenresButton.classList.remove("selected");
        allGenresButton.setAttribute("data-selected", "false");
      }
      img.classList.add("selected");
      img.setAttribute("data-selected", "true");
      if (!genreArray.includes(sourceId)) {
        genreArray.push(sourceId);
      }
      if (genreArray.length > 0) {
        genreButton.disabled = false;
        genreButton.style.opacity = 1;
      }
    }
  }
}

// Selects/deselects the streaming service images, updates the sourceArray, and enables/disables the search button
function toggleSourceSelection(event) {
  const img = event.target;
  const sourceButton = document.querySelector("#source-next-button-image");
  const isSelected = img.getAttribute("data-selected") === "true";
  const sourceId = img.getAttribute("data-api-id");
  if (isSelected) {
    img.classList.remove("selected");
    img.setAttribute("data-selected", "false");
    sourceArray = sourceArray.filter((id) => id !== sourceId);
    if (sourceArray.length === 0) {
      sourceButton.disabled = true;
      sourceButton.style.opacity = 0.3;
    }
  } else {
    img.classList.add("selected");
    img.setAttribute("data-selected", "true");
    if (!sourceArray.includes(sourceId)) {
      sourceArray.push(sourceId);
    }
    if (sourceArray.length > 0) {
      sourceButton.disabled = false;
      sourceButton.style.opacity = 1;
    }
  }
}

// Selects/deselects the rating images, updates the ratingArray
function toggleRatingSelection(event) {
  const img = event.target;
  const isSelected = img.getAttribute("data-selected") === "true";
  const sourceId = img.getAttribute("data-api-id");
  if (isSelected) {
    img.classList.remove("selected");
    img.setAttribute("data-selected", "false");
    ratingArray = ratingArray.filter((id) => id !== sourceId);
  } else {
    if (sourceId === "all") {
      ratingArray = [];
      const possibleRatings = document.querySelectorAll(
        "#ao-rating-section img"
      );
      possibleRatings.forEach((rating) => {
        if (rating.classList.contains("selected")) {
          rating.classList.remove("selected");
        }
        rating.setAttribute("data-selected", "false");
      });
      img.classList.add("selected");
      img.setAttribute("data-selected", "true");
    } else {
      const allRatingsButton = document.getElementById("any-rating-icon");
      if (allRatingsButton.dataset.selected === "true") {
        allRatingsButton.classList.remove("selected");
        allRatingsButton.setAttribute("data-selected", "false");
      }
      img.classList.add("selected");
      img.setAttribute("data-selected", "true");
      if (!ratingArray.includes(sourceId)) {
        ratingArray.push(sourceId);
      }
      if (ratingArray.length > 0) {
      }
    }
  }
}

// Selects/deselects the runtime images, updates the runtimeArray
function toggleRuntimeSelection(event) {
  const img = event.target;
  const isSelected = img.getAttribute("data-selected") === "true";
  const sourceId = img.getAttribute("data-time");
  if (isSelected) {
    img.classList.remove("selected");
    img.setAttribute("data-selected", "false");
    runtimeArray = runtimeArray.filter((id) => id !== sourceId);
  } else {
    if (sourceId === "all") {
      runtimeArray = [];
      const possibleRuntimes = document.querySelectorAll(
        "#ao-runtime-section img"
      );
      possibleRuntimes.forEach((runtime) => {
        if (runtime.classList.contains("selected")) {
          runtime.classList.remove("selected");
        }
        runtime.setAttribute("data-selected", "false");
      });
      img.classList.add("selected");
      img.setAttribute("data-selected", "true");
    } else {
      const allRuntimesButton = document.getElementById("any-runtime-icon");
      if (allRuntimesButton.dataset.selected === "true") {
        allRuntimesButton.classList.remove("selected");
        allRuntimesButton.setAttribute("data-selected", "false");
      }
      img.classList.add("selected");
      img.setAttribute("data-selected", "true");
      if (!runtimeArray.includes(sourceId)) {
        runtimeArray.push(sourceId);
      }
      if (runtimeArray.length > 0) {
      }
    }
  }
}

// Enables button logic for the next button (in Type selection)
document
  .getElementById("type-next-button-image")
  .addEventListener("click", function () {
    if (!this.disabled) {
      minimizeMediaTypeSelection();
      expandGenreSelection();
    }
  });

// Enables button logic for the next button (in Genre selection)
document
  .getElementById("genre-next-button-image")
  .addEventListener("click", function () {
    if (!this.disabled) {
      minimizeGenreSelection();
      expandSourceSelection();
    }
  });

// Enables button logic for the back button (in Genre selection)
document
  .getElementById("genre-back-button-image")
  .addEventListener("click", function () {
    returnToMediaTypeSelection();
    hideGenreSelection();
  });

// Enables button logic for the next button (in Source selection)
document
  .getElementById("source-next-button-image")
  .addEventListener("click", function () {
    if (!this.disabled) {
      minimizeSourceSelection();
      expandAdditionalOptions();
    }
  });

// Enables button logic for the back button (in Source selection)
document
  .getElementById("source-back-button-image")
  .addEventListener("click", function () {
    returnToGenreSelection();
    hideSourceSelection();
  });

// Initiaties the search based on the selected options
document
  .getElementById("additional-options-next-button-image")
  .addEventListener("click", () => {
    let url = `https://api.watchmode.com/v1/list-titles/?apiKey=${key}&source_ids=${sourceArray.join(
      ","
    )}&genres=${genreArray.join(",")}&types=${typeArray.join(",")}`;

    fetch(url, { method: "Get" })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  });

// Condenses the Media Type section after the user has made their choice
function minimizeMediaTypeSelection() {
  document
    .querySelectorAll("#media-type-container h2, #media-type-container h4")
    .forEach((text) => {
      text.style.display = "none";
    });
  document.querySelectorAll("#media-type-icons img").forEach((img) => {
    img.style.width = "35px";
    img.style.height = "35px";
  });
  document.getElementById("type-button-container").style.display = "none";
}

// Expands the Genre section for the user to make their choice
function expandGenreSelection() {
  document.getElementById("genre-preview").style.display = "none";
  document.getElementById("genre-container").style.display = "flex";
}

// Returns the user to the Media Type section
function returnToMediaTypeSelection() {
  document
    .querySelectorAll("#media-type-container h2, #media-type-container h4")
    .forEach((text) => {
      text.style.display = "block";
    });
  document.querySelectorAll("#media-type-icons img").forEach((img) => {
    img.style.width = "100px";
    img.style.height = "100px";
  });
  document.getElementById("type-button-container").style.display = "flex";
}

// Rehides the Genre section when the user goes back
function hideGenreSelection() {
  document.getElementById("genre-preview").style.display = "block";
  document.getElementById("genre-container").style.display = "none";
}

// Condenses the Genre section after the user has made their choice
function minimizeGenreSelection() {
  document
    .querySelectorAll("#genre-container h2, #genre-container h4")
    .forEach((text) => {
      text.style.display = "none";
    });
  document.querySelectorAll("#genre-container img").forEach((img) => {
    img.style.width = "35px";
    img.style.height = "35px";
  });
  document.getElementById("genre-button-container").style.display = "none";
}

// Expands the Streaming Source section for the user to make their choice
function expandSourceSelection() {
  document.getElementById("source-preview").style.display = "none";
  document.getElementById("source-container").style.display = "flex";
}

// Returns the user to the Genre section
function returnToGenreSelection() {
  document
    .querySelectorAll("#genre-container h2, #genre-container h4")
    .forEach((text) => {
      text.style.display = "block";
    });
  document.querySelectorAll("#genre-container img").forEach((img) => {
    img.style.width = "100px";
    img.style.height = "100px";
  });
  document.getElementById("genre-button-container").style.display = "flex";
}

// Rehides the Streaming Source section when the user goes back
function hideSourceSelection() {
  document.getElementById("source-preview").style.display = "block";
  document.getElementById("source-container").style.display = "none";
}

// Condenses the Streaming Source section after the user has made their choice
function minimizeSourceSelection() {
  document
    .querySelectorAll("#source-container h2, #source-container h4")
    .forEach((text) => {
      text.style.display = "none";
    });
  document.querySelectorAll("#source-container img").forEach((img) => {
    img.style.width = "35px";
    img.style.height = "35px";
  });
  document.getElementById("source-button-container").style.display = "none";
}

// Expands the Additional Options section for the user to make their choice
function expandAdditionalOptions() {
  document.getElementById("additional-options-preview").style.display = "none";
  document.getElementById("additional-options-container").style.display =
    "flex";
}

// Returns the user to the Streaming Source section
function returnToSourceSelection() {
  document
    .querySelectorAll("#source-container h2, #source-container h4")
    .forEach((text) => {
      text.style.display = "block";
    });
  document.querySelectorAll("#source-container img").forEach((img) => {
    img.style.width = "100px";
    img.style.height = "100px";
  });
  document.getElementById("source-button-container").style.display = "flex";
}

// Rehides the Additional Options section when the user goes back
function hideAdditionalOptions() {
  document.getElementById("additional-options-preview").style.display = "block";
  document.getElementById("additional-options-container").style.display =
    "none";
}
