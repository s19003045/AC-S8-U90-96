(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12

  // 與API連結：
  axios.get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)
      displayDataList(getCurrentPage(data, 1))
      console.log(data)
      getTotalPages(data)
    })
    .catch((err) => console.log(err))


  // 渲染pagination的function
  function getTotalPages(data) {
    const totalPage = Math.ceil(data.length / ITEM_PER_PAGE) || 1

    for (let i = 0; i < totalPage; i++) {
      document.querySelector('.pagination ').innerHTML += `
        <li class="page-item" >
          <a class="page-link" href="javascript:" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
  }

  // 選定searchbar...
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')


  // listen to search form submit event
  searchForm.addEventListener('submit', event => {
    console.log('click!')
    event.preventDefault()
    const results = []
    let regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))
    // 渲染最下下方的分頁
    getTotalPages(results)
    // 呈現第一頁的結果
    displayDataList(results, 1)

  })



  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
      console.log(event.target.dataset.id)
    }
  })

  //從data中取得某一頁的所有電影
  function getCurrentPage(data, pageNum) {
    // 取得該頁的所有電影資料
    // 引入的pageNum為string，要轉換成number
    const currentPageMovie = data.slice((Number(pageNum - 1)) * ITEM_PER_PAGE, ITEM_PER_PAGE * Number(pageNum))
    // console.log(currentPageMovie)
    return currentPageMovie
  }

  // 監聽pagination，並渲染畫面
  pagination.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
      let pageNum = event.target.dataset.page

      // 利用向API取得的data及上面取得的pageNum當成getCurrentPage的參數，最後取得該頁的電影，再匯入displayDataList中，渲染至畫面
      displayDataList(getCurrentPage(data, pageNum))
    }

  })

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }


})()