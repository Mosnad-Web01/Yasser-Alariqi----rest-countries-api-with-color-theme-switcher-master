window.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.querySelector(".theme-btn");
    const countriesContainer = document.querySelector(".countries-container .container");
    const searchInput = document.querySelector(".input-section input");
    const select = document.querySelector(".filter-section select");

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeBtn.querySelector("i").classList.toggle("fa-sun");
        themeBtn.querySelector("i").classList.toggle("fa-moon");
    });

    searchInput.addEventListener("input", debounce(() => {
        getCountries(searchInput.value, select.value);
    }, 500));

    select.addEventListener("change", () => {
        getCountries(searchInput.value, select.value);
    });

    getCountries();

    async function getCountries(search = "", region = "") {
        const res = await fetch(`https://restcountries.com/v3.1/all`);
        const data = await res.json();
        displayCountries(data.filter(country => {
            const matchesSearch = country.name.common.toLowerCase().includes(search.toLowerCase());
            const matchesRegion = !region || region === "Filter by Region" || country.region === region;
            return matchesSearch && matchesRegion;
        }));
    }

    function displayCountries(countries) {
        countriesContainer.innerHTML = "";  // clear countries container

        countries.forEach(country => {
            const { name, flags, population, region, capital, cca3 } = country;  // Use cca3 as a unique identifier
            const countryDiv = document.createElement("article");
            countryDiv.classList.add("country");
            countryDiv.setAttribute("data-id", cca3);  // Set data-id attribute
            countryDiv.innerHTML = `
                <img src="${flags.png}" alt="${name.common}">
                <div class="country-info">
                    <h2 class="card-title">${name.common}</h2>
                    <ul class="card-info">
                        <li><strong>Population:</strong> ${population.toLocaleString()}</li>
                        <li><strong>Region:</strong> ${region}</li>
                        <li><strong>Capital:</strong> ${capital}</li>
                    </ul>
                </div>
            `;
            countriesContainer.appendChild(countryDiv);
        });
    }

    // Delegate click event to the container
    countriesContainer.addEventListener("click", (e) => {
        const countryCard = e.target.closest(".country");
        if (countryCard) {
            const countryId = countryCard.getAttribute("data-id");
            window.location.href = `detailPage.html?id=${countryId}`;
        }
    });

    // Debounce function to limit API calls
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
});
