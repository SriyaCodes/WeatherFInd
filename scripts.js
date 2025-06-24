const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

// Your OpenWeatherMap API Key
const apiKey = "4d8fb5b93d4af21d66a2948710284366";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputVal = input.value.trim();

  const listItems = Array.from(list.querySelectorAll(".city"));

  // Check for duplicate city
  const duplicate = listItems.find((el) => {
    const cityNameSpan = el.querySelector(".city-name span").textContent.toLowerCase();
    const datasetName = el.querySelector(".city-name").dataset.name.toLowerCase();

    if (inputVal.includes(",")) {
      const [city, country] = inputVal.split(",");
      if (country.length > 2) {
        return cityNameSpan === city.toLowerCase();
      } else {
        return datasetName === inputVal.toLowerCase();
      }
    } else {
      return cityNameSpan === inputVal.toLowerCase();
    }
  });

  if (duplicate) {
    msg.textContent = `You already know the weather for ${duplicate.querySelector(".city-name span").textContent} 😉`;
    form.reset();
    input.focus();
    return;
  }

  // Fetch weather data
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then((data) => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      li.innerHTML = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      list.appendChild(li);
      msg.textContent = "";
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });

  form.reset();
  input.focus();
});
