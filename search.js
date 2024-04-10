// This is our unique key for the API. Documentation found at https://api.watchmode.com/docs/#title
const key = "5fv18iHmaUTf60qgnI787JkHHyYaRDCxcvHhw8T3";

// The search button which will fire the event listener and the div all results will be appended to
let searchButton = document.getElementById("searchFire");
let results = document.getElementById("results");

// The event listener
searchButton.addEventListener("click", () => {
  // This was needed to clear previous results
  results.innerHTML = " ";

  let searchField = document.getElementById("searchField").value;
  // This is needed to change the empty spaces to %20 to be read in the following API calls
  let searchEntry = searchField.split(" ").join("%20");

  // This API is user friendly to help with misspelled and incomplete words
  let url = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${key}&search_value=${searchEntry}&search_type=2`;

  fetch(url, { method: "Get" })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);

      // Could have gone the length of the API return but we are limited to 1000 calls a month so keep this for loop at 5 so we can present
      for (let i = 0; i < 5; i++) {
        let resultName = document.createElement("div");
        let resultImg = document.createElement("img");

        resultName.className = "resultName";
        resultImg.className = "resultImg";

        resultName.id = `title ${json.results[i].id}`;
        resultImg.id = `${json.results[i].id}`;

        resultName.innerHTML = `${json.results[i].name}`;
        resultImg.src = `${json.results[i].image_url}`;

        results.appendChild(resultName);
        results.appendChild(resultImg);

        // When poster is clicked, second API is called with detailed info
        resultImg.addEventListener("click", () => {
          console.log(`ID: ${json.results[i].id}`);

          let infoAPI = `https://api.watchmode.com/v1/title/${resultImg.id}/details/?apiKey=${key}`;
          let streamAPI = `https://api.watchmode.com/v1/title/${resultImg.id}/sources/?apiKey=${key}`;

          fetch(infoAPI, { method: "Get" })
            .then((res) => res.json())
            .then((json) => {
              console.log(json);

              results.replaceChildren();
              results.innerHTML = ` `;

              let titleName = document.createElement("h2");
              titleName.id = `${json.title}`;
              titleName.className = "titleName";
              titleName.innerHTML = `${json.title}`;
              results.appendChild(titleName);

              let poster = document.createElement("img");
              poster.id = `${json.poster}`;
              poster.className = "poster";
              poster.src = `${json.poster}`;
              results.appendChild(poster);

              let overview = document.createElement("h4");
              overview.id = `${json.plot_overview}`;
              overview.className = "overview";
              overview.innerHTML = `${json.plot_overview}`;
              results.appendChild(overview);

              let year = document.createElement("div");
              year.className = "year";
              year.innerHTML = `${json.year}`;
              results.appendChild(year);

              let rating = document.createElement("h6");
              rating.className = "rating";
              rating.innerHTML = `${json.us_rating}`;
              results.appendChild(rating);
              fetch(streamAPI, { method: "Get" })
                .then((res) => res.json())
                .then((streams) => {
                  console.log(streams);

                  for (let i = 0; i < streams.length; i++) {
                    let streamSource = document.createElement("div");
                    streamSource.className = "streamSource";
                    streamSource.innerHTML = `${streams[i].name}`;
                    results.appendChild(streamSource);

                    let streamType = document.createElement("div");
                    streamType.className = "streamType";
                    streamType.innerHTML = `${streams[i].type}`;
                    results.appendChild(streamType);
                  }
                });
            });
        });

        console.log(json.results[i].id);
      }
    });
});
