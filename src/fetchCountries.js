import Notiflix from 'notiflix';

export function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
      throw new Error(
          Notiflix.Notify.failure('Oops, there is no country with that name'),
        document.querySelector('.country-list').innerHTML = ``,
    );
  });
}
