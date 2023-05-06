import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const searchForm = document.querySelector('#search-form') 
const gallery = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')
let searchQuery = '' 
let page = 1 
searchForm.addEventListener('submit', async (e) => { 
  e.preventDefault() 
  searchQuery = e.target.searchQuery.value 
  page = 1 
  gallery.innerHTML = '' 
  loadMoreBtn.style.display = 'none'
  const { data } = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '36126278-15e0a3a5596ac27de13104eef', 
      q: searchQuery, 
      image_type: 'photo',
      orientation: 'horizontal', 
      safesearch: true, 
      page,    
      per_page: 40 
    }
  })  
  if (data.totalHits === 0) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    loadMoreBtn.style.display = 'none'
    return
  }   
  renderImages(data.hits) 
  loadMoreBtn.style.display = 'flex'
  page++ 
}) 
loadMoreBtn.addEventListener('click', async () => { 
  loadMoreBtn.style.display = 'none'  
  const { data } = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '36126278-15e0a3a5596ac27de13104eef', 
      q: searchQuery, 
      image_type: 'photo',
      orientation: 'horizontal', 
      safesearch: true, 
      page, 
      per_page: 40 
    }
  }) 
  renderImages(data.hits) 
  loadMoreBtn.style.display = 'flex'
  page++  
  if (page * 40 > data.totalHits) {
    loadMoreBtn.style.display = 'none' 
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
  }
}) 
function renderImages(hits) {
  hits.forEach(hit => {
    const card = document.createElement('div')
    card.classList.add('photo-card')
    const img = document.createElement('img')
    img.src = hit.webformatURL
    img.alt = hit.tags
    img.loading = 'lazy'
    card.append(img)
    const info = document.createElement('div')
    info.classList.add('info')
    const likes = document.createElement('p')
    likes.classList.add('info-item')
    likes.innerHTML = "<b>Likes</b> " + hit.likes
    info.append(likes)
    const views = document.createElement('p')
    views.classList.add('info-item')
    views.innerHTML = "<b>Views</b> " + hit.views
    info.append(views)
    const comments = document.createElement('p')
    comments.classList.add('info-item')
    comments.innerHTML = "<b>Comments</b> " + hit.comments
    info.append(comments)
    const downloads = document.createElement('p')
    downloads.classList.add('info-item')
    downloads.innerHTML = "<b>Downloads</b> " + hit.downloads
    info.append(downloads)
    card.append(info)
    gallery.append(card)
  })
};