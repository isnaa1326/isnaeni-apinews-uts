$(document).ready(function () {
  const newsContainer = $('#news-container');
  let currentCategory = 'general';

  fetchNews(currentCategory);

  $('.category-btn').on('click', function () {
    $('.category-btn').removeClass('active');
    $(this).addClass('active');
    currentCategory = $(this).data('category');
    fetchNews(currentCategory);
  });

  $('#search-btn').on('click', function () {
    const term = $('#search-input').val().trim();
    if (term) fetchNews(currentCategory, term);
  });

  $('#search-input').keypress(function (e) {
    if (e.which === 13) $('#search-btn').click();
  });

  function fetchNews(category, searchTerm = '') {
    newsContainer.html(`<div class="loading"><i class="fas fa-spinner"></i><p>Memuat berita...</p></div>`);

    let url = `/api/news?category=${category}`;
    if (searchTerm) url += `&q=${encodeURIComponent(searchTerm)}`;

    $.getJSON(url, function (data) {
      if (data.articles?.length) displayNews(data.articles);
      else newsContainer.html(`<p class="text-center text-muted py-5">Tidak ada berita ditemukan.</p>`);
    }).fail(() => {
      newsContainer.html(`<p class="text-center text-danger py-5">Gagal memuat berita.</p>`);
    });
  }

  function displayNews(articles) {
    newsContainer.empty();
    articles.forEach(a => {
      const date = new Date(a.publishedAt).toLocaleDateString();
      const imgUrl = a.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image';
      const card = `
        <div class="news-card">
          <div class="news-image"><img src="${imgUrl}" alt="${a.title}"></div>
          <div class="news-content">
            <div class="news-source d-flex justify-content-between small text-muted mb-2">
              <span>${a.source.name || 'Unknown'}</span>
              <span>${date}</span>
            </div>
            <h5 class="news-title">${a.title}</h5>
            <p class="news-desc">${a.description || ''}</p>
            <a href="${a.url}" target="_blank" class="news-link">Read More <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>`;
      newsContainer.append(card);
    });
  }
});
