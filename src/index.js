import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener(
  'input',
  debounce(() => {
    const name = searchBox.value.trim();
    if (!name) {
      clearMarkup();
      return;
    }
    fetchCountries(name).then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearMarkup();
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountryList(countries);
        clearMarkup(countryInfo);

        countryList.addEventListener('click', e => {
          if (e.target.classList.contains('country-list__item')) {
            const countryCode = e.target.getAttribute('data-country-code');
            const country = countries.find(c => c.cca3 === countryCode);
            renderCountryInfo(country);
            clearMarkup(countryList);
          }
        });
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
        clearMarkup(countryList);
      } else {
        clearMarkup();
      }
    }).catch(() => { clearMarkup(); });
  }, 300)
);

function clearMarkup(element = null) {
  if (element) {
    element.innerHTML = '';
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}


function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `
        <li class="country-list__item" data-country-code="${country.cca3}">
          <img class="country-list__flag" src="${country.flags.svg}" alt="${country.name.official} flag" width="32" height="20">
          <span class="country-list__name">${country.name.official}</span>
        </li>
      `;
    })
    .join('');
  countryList.innerHTML = `<ul class="country-list__list">${markup}</ul>`;
}

function renderCountryInfo(country) {
    const languages = Object.values(country.languages);
  const markup = `
    <div class="country-info__flag-container">
      <img class="country-info__flag" src="${country.flags.svg}" alt="${
    country.name.official
  } flag" width="128" height="80">
    </div>
    <div class="country-info__details">
      <h2 class="country-info__name">${country.name.official}</h2>  
      <p class="country-info__capital"><span class="country-info__label">Capital: </span>${
        country.capital
      }</p>
      <p class="country-info__population"><span class="country-info__label">Population: </span>${
        country.population
      }</p>
  <p class="country-info__languages"><span class="country-info__label">Languages: </span>${languages.join(
    ', '
  )}</p>  
</div> `;

  const countryInfo = document.querySelector('.country-info');
  countryInfo.innerHTML = markup;
}
