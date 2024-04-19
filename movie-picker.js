// This is our unique key for the API. Documentation found at https://api.watchmode.com/docs/#title
const key = "vraRSIW4EMLXPqzKeL67PDKheqUSl0wIlx2uzGDa";

let typeArray = []; // This will store the selected media types
let genreArray = []; // This will store the selected genres
let sourceArray = []; // This will store the selected streaming services
let ratingArray = []; // This will store the selected ratings
let runtimeArray = []; // This will store the selected runtimes
let resultsPageArray = []; // This will store the results in array chunks of 25
let searchArray = []; // This will store the results to search for, and prevent re-calling for the same data
let displayArray = []; // This will store the results to display on the page
let storedDisplaySet = {}; // This will store the data of expanded result pulls
let pageView = 0; // This will store the next current page to display
let moreResultsPage = 1; // This will store the next page of results to display

// Converts the type images into selectable buttons
document.querySelectorAll("#media-type-icons img").forEach((img) => {
  img.addEventListener("click", toggleTypeSelection);
});

// Converts the genre images into selectable buttons
document.querySelectorAll("#genre-icons img").forEach((img) => {
  img.addEventListener("click", toggleGenreSelection);
});

// Converts the streaming service images into selectable buttons
document.querySelectorAll("#source-container img").forEach((img) => {
  img.addEventListener("click", toggleSourceSelection);
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
    }
  });

// Initiaties the search based on the selected options and calls on function to parse the results
document
  .getElementById("source-next-button-image")
  .addEventListener("click", () => {
    let url = `https://api.watchmode.com/v1/list-titles/?apiKey=${key}&source_ids=${sourceArray.join(
      ","
    )}&genres=${genreArray.join(",")}&types=${typeArray.join(",")}`;

    fetch(url, { method: "Get" })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        constructResultsArray(json);
      });
  });

// Enables button logic for the back button (in Source selection)
document
  .getElementById("source-back-button-image")
  .addEventListener("click", function () {
    returnToGenreSelection();
    hideSourceSelection();
  });

// Enables button logic for the next view button (in Results display)
document
  .getElementById("results-next-button-image")
  .addEventListener("click", () => {
    if (pageView < displayArray.length - 1) {
      pageView++;
      if (pageView === displayArray.length - 1) {
        document.getElementById(
          "results-next-button-image"
        ).style.opacity = 0.3;
      }
      document.getElementById("results-prev-button-image").style.opacity = 1;
      inflateResultsDisplay();
    }
  });

// Enables button logic for the prev view button (in Results display)
document
  .getElementById("results-prev-button-image")
  .addEventListener("click", () => {
    if (pageView > 0) {
      pageView--;
      if (pageView === 0) {
        document.getElementById(
          "results-prev-button-image"
        ).style.opacity = 0.3;
      }
      document.getElementById("results-next-button-image").style.opacity = 1;
      inflateResultsDisplay();
    }
  });

// Enables button logic to display more results
document
  .getElementById("more-results-button-image")
  .addEventListener("click", () => {
    displayMoreResults();
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
  document
    .querySelectorAll("#media-type-icons .icon-container")
    .forEach((container) => {
      container.style.margin = "5px";
    });
  document.getElementById("type-button-container").style.display = "none";
}

// Expands the Genre section for the user to make their choice
function expandGenreSelection() {
  document.getElementById("genre-preview").style.display = "none";
  document.getElementById("genre-container").style.display = "flex";
  document.getElementById("genre-next-button-image").style.opacity = 1;
}

// Returns the user to the Media Type section
function returnToMediaTypeSelection() {
  document
    .querySelectorAll("#media-type-container h2, #media-type-container h4")
    .forEach((text) => {
      text.style.display = "block";
    });
  document.querySelectorAll("#media-type-icons img").forEach((img) => {
    img.style.width = "";
    img.style.height = "";
  });
  document
    .querySelectorAll("#media-type-icons .icon-container")
    .forEach((container) => {
      container.style.margin = "";
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
  document
    .querySelectorAll("#genre-container .icon-container")
    .forEach((container) => {
      container.style.margin = "5px";
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
    img.style.width = "";
    img.style.height = "";
  });
  document
    .querySelectorAll("#genre-container .icon-container")
    .forEach((container) => {
      container.style.margin = "";
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
  document
    .querySelectorAll("#source-container .icon-container")
    .forEach((container) => {
      container.style.margin = "5px";
    });
  document.getElementById("source-button-container").style.display = "none";
}

// It takes the desired values from the resutls and stores them in sub-arrays of 25 inside of the resultsPageArray
function constructResultsArray(json) {
  const results = json.titles;
  const size = 25;

  for (let i = 0; i < results.length; i += size) {
    const chunk = results.slice(i, i + size).map((item) => ({
      id: item.id,
      title: item.title,
      year: item.year,
      type: item.type,
    }));
    resultsPageArray.push(chunk);
  }
  populateResultsBoxes();
}

// Populates the hidden results display with the results stored in the resultsPageArray
function populateResultsBoxes() {
  const resultsContainer = document.getElementById("more-results-display");

  resultsPageArray.forEach((page, pageIndex) => {
    let resultsPage = document.createElement("div");
    resultsPage.id = `page-${pageIndex + 1}`;
    resultsPage.className = "more-results-page";
    resultsPage.style.display = "none";
    resultsContainer.appendChild(resultsPage);

    let populatedRows = [];
    for (let i = 0; i < page.length; i += 5) {
      let fiveResults = page.slice(i, i + 5);
      populatedRows.push(fiveResults);
    }

    populatedRows.forEach((row, rowIndex) => {
      let resultsRow = document.createElement("div");
      resultsRow.className = "more-results-row";
      resultsPage.appendChild(resultsRow);

      row.forEach((item) => {
        let resultsBox = document.createElement("div");
        resultsBox.className = "more-results-box";
        resultsBox.innerHTML = `<h5>${item.title} (${item.year})</h5>
                               <h6>[${item.type}]</h6>`;
        resultsBox.dataset.id = item.id;
        resultsRow.appendChild(resultsBox);

        if (pageIndex === 0 && rowIndex === 0) {
          searchArray.push(item.id);
        }
      });
    });
    pageIndex = pageIndex++;
  });

  pullDisplayData();
}

// Creates an Array and Object to store the expanded data of the first five items
function pullDisplayData() {
  let fetchPromises = searchArray.map((result) => {
    if (!storedDisplaySet[result]) {
      let url = `https://api.watchmode.com/v1/title/${result}/details/?apiKey=${key}&append_to_response=sources`;

      return fetch(url, { method: "Get" })
        .then((res) => res.json())
        .then((json) => {
          storedDisplaySet[result] = json;
          displayArray.push(result);
        });
    }
  });

  Promise.all(fetchPromises).then(() => {
    inflateResultsDisplay();
    document.getElementById("more-results-container").style.display = "flex";
  });
}

// Prepares a set of five results to be displayed, and displays the first of them
function inflateResultsDisplay() {
  let displayID = displayArray[pageView];
  let data = storedDisplaySet[displayID];
  let resultsSources = data.sources;
  let resultsGenres = data.genre_names;

  let resultsContainer = document.getElementById("results-container");
  resultsContainer.style.display = "flex";

  let displayTitle = document.getElementById("display-title");
  displayTitle.innerHTML = data.title;

  let displayPoster = document.getElementById("display-poster");
  displayPoster.src = data.poster;

  let displayYear = document.getElementById("display-release-date");
  displayYear.innerHTML = data.year;

  let displayEndYear = document.getElementById("display-finale");
  if (data.end_year) {
    displayEndYear.innerHTML = data.end_year;
  }

  let displaySeasonCount = document.getElementById(
    "display-source-season-count"
  );
  let resultSeasonCount = resultsSources[0].seasons;
  displaySeasonCount.innerHTML = `${resultSeasonCount} Seasons`;

  let displayEpisodeCount = document.getElementById(
    "display-source-episode-count"
  );
  let resultEpisodeCount = resultsSources[0].episodes;
  displayEpisodeCount.innerHTML = `${resultEpisodeCount} Episodes`;

  let displayGenre = document.getElementById("display-genre-container");

  displayGenre.innerHTML = "";

  resultsGenres.forEach((genre) => {
    let genreDiv = document.createElement("div");
    genreDiv.className = "display-genre";
    displayGenre.appendChild(genreDiv);

    let genreImg = document.createElement("img");
    genreImg.className = "display-genre-icon";
    genreDiv.appendChild(genreImg);

    switch (genre) {
      case "Action":
        genreImg.src = "./src/genres/action.png";
        genreImg.alt = "Action Icon";
        break;
      case "Action & Adventure":
        genreImg.src = "./src/genres/action-adventure.png";
        genreImg.alt = "Action & Adventure Icon";
        break;
      case "Adult":
        genreImg.src = "./src/genres/adult.png";
        genreImg.alt = "Adult Icon";
        break;
      case "Adventure":
        genreImg.src = "./src/genres/adventure.png";
        genreImg.alt = "Adventure Icon";
        break;
      case "Animation":
        genreImg.src = "./src/genres/animation.png";
        genreImg.alt = "Animation Icon";
        break;
      case "Anime":
        genreImg.src = "./src/genres/anime.png";
        genreImg.alt = "Anime Icon";
        break;
      case "Biography":
        genreImg.src = "./src/genres/biography.png";
        genreImg.alt = "Biography Icon";
        break;
      case "Comedy":
        genreImg.src = "./src/genres/comedy.png";
        genreImg.alt = "Comedy Icon";
        break;
      case "Crime":
        genreImg.src = "./src/genres/crime.png";
        genreImg.alt = "Crime Icon";
        break;
      case "Documentary":
        genreImg.src = "./src/genres/documentary.png";
        genreImg.alt = "Documentary Icon";
        break;
      case "Drama":
        genreImg.src = "./src/genres/drama.png";
        genreImg.alt = "Drama Icon";
        break;
      case "Family":
        genreImg.src = "./src/genres/family.png";
        genreImg.alt = "Family Icon";
        break;
      case "Fantasy":
        genreImg.src = "./src/genres/fantasy.png";
        genreImg.alt = "Fantasy Icon";
        break;
      case "Food":
        genreImg.src = "./src/genres/food.png";
        genreImg.alt = "Food Icon";
        break;
      case "Game Show":
        genreImg.src = "./src/genres/game-show.png";
        genreImg.alt = "Game Show Icon";
        break;
      case "History":
        genreImg.src = "./src/genres/history.png";
        genreImg.alt = "History Icon";
        break;
      case "Horror":
        genreImg.src = "./src/genres/horror.png";
        genreImg.alt = "Horror Icon";
        break;
      case "Kids":
        genreImg.src = "./src/genres/kids.png";
        genreImg.alt = "Kids Icon";
        break;
      case "Music":
        genreImg.src = "./src/genres/music.png";
        genreImg.alt = "Music Icon";
        break;
      case "Musical":
        genreImg.src = "./src/genres/musical.png";
        genreImg.alt = "Musical Icon";
        break;
      case "Mystery":
        genreImg.src = "./src/genres/mystery.png";
        genreImg.alt = "Mystery Icon";
        break;
      case "Nature":
        genreImg.src = "./src/genres/nature.png";
        genreImg.alt = "Nature Icon";
        break;
      case "News":
        genreImg.src = "./src/genres/news.png";
        genreImg.alt = "News Icon";
        break;
      case "Reality":
        genreImg.src = "./src/genres/reality.png";
        genreImg.alt = "Reality Icon";
        break;
      case "Romance":
        genreImg.src = "./src/genres/romance.png";
        genreImg.alt = "Romance Icon";
        break;
      case "Sci-Fi & Fantasy":
        genreImg.src = "./src/genres/sci-fi-fantasy.png";
        genreImg.alt = "Sci-Fi & Fantasy Icon";
        break;
      case "Science Fiction":
        genreImg.src = "./src/genres/science-fiction.png";
        genreImg.alt = "Science Fiction Icon";
        break;
      case "Soap":
        genreImg.src = "./src/genres/soap.png";
        genreImg.alt = "Soap Icon";
        break;
      case "Sports":
        genreImg.src = "./src/genres/sports.png";
        genreImg.alt = "Sports Icon";
        break;
      case "Supernatural":
        genreImg.src = "./src/genres/supernatural.png";
        genreImg.alt = "Supernatural Icon";
        break;
      case "Talk":
        genreImg.src = "./src/genres/talk.png";
        genreImg.alt = "Talk Icon";
        break;
      case "Thriller":
        genreImg.src = "./src/genres/thriller.png";
        genreImg.alt = "Thriller Icon";
        break;
      case "Travel":
        genreImg.src = "./src/genres/travel.png";
        genreImg.alt = "Travel Icon";
        break;
      case "TV Movie":
        genreImg.src = "./src/genres/tv-movie.png";
        genreImg.alt = "TV Movie Icon";
        break;
      case "War":
        genreImg.src = "./src/genres/war.png";
        genreImg.alt = "War Icon";
        break;
      case "War & Politics":
        genreImg.src = "./src/genres/war-politics.png";
        genreImg.alt = "War & Politics Icon";
        break;
      case "Western":
        genreImg.src = "./src/genres/western.png";
        genreImg.alt = "Western Icon";
        break;
      default:
        break;
    }

    let genreText = document.createElement("div");
    genreText.className = "display-genre-text";
    genreText.innerHTML = genre;
    genreDiv.appendChild(genreText);
  });

  let displayType = document.getElementById("display-type");
  if (data.type === ("movie" || "short_film" || "tv_special")) {
    displayType.innerHTML = "Movie";
  }
  if (data.type === ("tv_series" || "tv_miniseries")) {
    displayType.innerHTML = "TV Show";
  }

  let displayRuntime = document.getElementById("display-runtime");
  displayRuntime.innerHTML = data.runtime_minutes;

  let displayUSRating = document.getElementById("display-rating");
  displayUSRating.innerHTML = data.us_rating;

  let displayPlot = document.getElementById("display-plot");
  displayPlot.innerHTML = data.plot_overview;

  let displayUserRating = document.getElementById("display-user-rating");
  let resultUserRating = data.user_rating;
  displayUserRating.innerHTML = `User Rating: ${resultUserRating} /10`;

  let displayCriticScore = document.getElementById("display-critic-score");
  let resultCriticScore = data.critic_score;
  displayCriticScore.innerHTML = `Critic Score: ${resultCriticScore}%`;

  let displaySource = document.getElementById("display-source-info");

  displaySource.innerHTML = "";

  let uniqueSources = resultsSources.filter(
    (source, index, self) =>
      index === self.findIndex((s) => s.source_id === source.source_id)
  );

  uniqueSources.forEach((source) => {
    let sourceDiv = document.createElement("div");
    sourceDiv.className = "display-source";

    let sourceLink = document.createElement("a");
    sourceLink.className = "display-source-link";
    sourceLink.href = source.web_url;

    let sourceImg = document.createElement("img");
    sourceImg.className = "display-source-icon";

    let sourceId = String(source.source_id);

    let isMatched = false;

    switch (sourceId) {
      case "203":
        sourceImg.src = "./src/streaming-services/netflix.png";
        sourceImg.alt = "Netflix Icon";
        isMatched = true;
        break;
      case "157":
        sourceImg.src = "./src/streaming-services/hulu.png";
        sourceImg.alt = "Hulu Icon";
        isMatched = true;
        break;
      case "372":
        sourceImg.src = "./src/streaming-services/disney-plus.png";
        sourceImg.alt = "Disney+ Icon";
        isMatched = true;
        break;
      case "371":
        sourceImg.src = "./src/streaming-services/apple-tv-plus.png";
        sourceImg.alt = "Apple TV+ Icon";
        isMatched = true;
        break;
      case "387":
        sourceImg.src = "./src/streaming-services/hbo-max.png";
        sourceImg.alt = "HBO Max Icon";
        isMatched = true;
        break;
      case "26":
        sourceImg.src = "./src/streaming-services/prime-video.png";
        sourceImg.alt = "Prime Video Icon";
        isMatched = true;
        break;
      case "389":
        sourceImg.src = "./src/streaming-services/peacock.png";
        sourceImg.alt = "Peacock Icon";
        isMatched = true;
        break;
      case "444":
        sourceImg.src = "./src/streaming-services/paramount-plus.png";
        sourceImg.alt = "Paramount+ Icon";
        isMatched = true;
        break;
      case "455":
        sourceImg.src =
          "./src/streaming-services/paramount-plus-with-showtime.png";
        sourceImg.alt = "Paramount+ with Showtime Icon";
        isMatched = true;
        break;
      case "378":
        sourceImg.src = "./src/streaming-services/amc-plus.png";
        sourceImg.alt = "AMC+ Icon";
        isMatched = true;
        break;
      case "232":
        sourceImg.src = "./src/streaming-services/starz.png";
        sourceImg.alt = "Starz Icon";
        isMatched = true;
        break;
      case "108":
        sourceImg.src = "./src/streaming-services/mgm-plus.png";
        sourceImg.alt = "MGM+ Icon";
        isMatched = true;
        break;
      case "373":
        sourceImg.src = "./src/streaming-services/fubo-tv.png";
        sourceImg.alt = "Fubo TV Icon";
        isMatched = true;
        break;
      case "344":
        sourceImg.src = "./src/streaming-services/youtube-tv.png";
        sourceImg.alt = "YouTube TV Icon";
        isMatched = true;
        break;
      case "365":
        sourceImg.src = "./src/streaming-services/amazon-freevee.png";
        sourceImg.alt = "Amazon Freevee Icon";
        isMatched = true;
        break;
      case "452":
        sourceImg.src = "./src/streaming-services/roku-channel.png";
        sourceImg.alt = "Roku Channel Icon";
        isMatched = true;
        break;
      case "140":
        sourceImg.src = "./src/streaming-services/google-play.png";
        sourceImg.alt = "Google Play Icon";
        isMatched = true;
        break;
      case "307":
        sourceImg.src = "./src/streaming-services/vudu.png";
        sourceImg.alt = "Vudu Icon";
        isMatched = true;
        break;
      case "24":
        sourceImg.src = "./src/streaming-services/amazon-video.png";
        sourceImg.alt = "Amazon Video Icon";
        isMatched = true;
        break;
      case "349":
        sourceImg.src = "./src/streaming-services/apple.png";
        sourceImg.alt = "Apple Icon";
        isMatched = true;
        break;
      default:
        break;
    }

    if (isMatched) {
      sourceLink.appendChild(sourceImg);
      sourceDiv.appendChild(sourceLink);

      let sourceType = document.createElement("div");
      sourceType.className = "display-source-type";
      sourceType.innerHTML = source.type;
      sourceDiv.appendChild(sourceType);

      let sourcePrice = document.createElement("div");
      sourcePrice.className = "display-source-price";
      sourcePrice.innerHTML = source.price;
      sourceDiv.appendChild(sourcePrice);

      displaySource.appendChild(sourceDiv);
    }
  });

  if (data.trailer) {
    let displayThumbnail = document.getElementById("display-trailer-thumbnail");
    let displayTrailer = document.getElementById("display-trailer");

    displayThumbnail.src = data.trailer_thumbnail;
    displayThumbnail.alt = "Trailer Thumbnail";

    let videoId = data.trailer.split("v=")[1];

    displayThumbnail.addEventListener("click", function () {
      let iframe = document.createElement("iframe");
      iframe.id = "trailer-iframe";
      iframe.src = "https://www.youtube.com/embed/" + videoId;
      iframe.frameborder = 0;
      iframe.allow = "autoplay; encrypted-media";
      iframe.allowfullscreen = true;
      displayTrailer.innerHTML = "";
      displayTrailer.appendChild(iframe);
    });
  }
}

// Makes the next set of results visible
function displayMoreResults() {
  document.getElementById(`page-${moreResultsPage}`).style.display = "flex";
  moreResultsPage++;
  if (moreResultsPage === resultsPageArray.length + 1) {
    document.getElementById("more-results-button-image").style.display = "none";
  }
}
