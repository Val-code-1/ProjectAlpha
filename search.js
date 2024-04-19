// This is our unique key for the API. Documentation found at https://api.watchmode.com/docs/#title
const key = "vraRSIW4EMLXPqzKeL67PDKheqUSl0wIlx2uzGDa";

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

  // Switch case to change names to images and add that image location to element src
  function streamNamesToIcons(name, element) {
    switch (name) {
      case "Amazon":
        element.src = "./src/streaming-services/amazon-video.png";
        break;
      case "Netflix":
        element.src = "./src/streaming-services/netflix.png";
        break;
      case "AppleTV":
        element.src = "./src/streaming-services/apple.png";
        break;
      case "VUDU":
        element.src = "./src/streaming-services/vudu.png";
        break;
      case "Disney+":
        element.src = "./src/streaming-services/disney-plus.png";
        break;
      case "Google Play":
        element.src = "./src/streaming-services/google-play.png";
        break;
      case "MAX":
        element.src = "./src/streaming-services/hbo-max.png";
        break;
      case "Hulu":
        element.src = "./src/streaming-services/hulu.png";
        break;
      case "Peacock":
        element.src = "./src/streaming-services/peacock.png";
        break;
      case "YouTube":
        element.src = "./src/streaming-services/youtube-tv.png";
        break;
      case "fuboTV":
        element.src = "./src/streaming-services/fubo-tv.png";
        break;
      case "Paramount Plus":
        element.src = "./src/streaming-services/paramount-plus.png";
        break;
      case "Amazon Freevee":
        element.src = "./src/streaming-services/amazon-freevee.png";
        break;
      case "Prime Video":
        element.src = "./src/streaming-services/prime-video.png";
        break;
      default:
        element.src = "./src/streaming-services/sling-tv.png";
        return;
    }
  }

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

                  // No duplicates returned
                  let unique = [];

                  for (let i = 0; i < streams.length; i++) {
                    if (!unique.includes(streams[i].name)) {
                      unique.push(streams[i].name);
                    }
                    console.log(unique);
                  }

                  for (let i = 0; i < unique.length; i++) {
                    let streamSource = document.createElement("img");
                    streamSource.className = "streamSource";
                    streamSource.title = `${unique[i]}`;
                    // streamSource.innerHTML = `${unique[i]}`;
                    streamNamesToIcons(unique[i], streamSource);
                    results.appendChild(streamSource);

                    // let streamType = document.createElement("div");
                    // streamType.className = "streamType";
                    // streamType.innerHTML = `${unique[i].type}`;
                    // results.appendChild(streamType);
                  }
                });
            });
        });

        console.log(json.results[i].id);
      }
    });
});
