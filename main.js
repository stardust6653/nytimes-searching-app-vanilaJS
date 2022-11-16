const component = document.querySelector(".component");
const newsArea = document.querySelector("#news_area");

const searchForm = document.querySelector(".search_form");
const searchInput = document.querySelector(".search_input");
const recentlySearch = document.querySelector(".recently_search");
const deleteBtn = document.querySelector(".delete_btn");

const clipBtn = document.querySelectorAll(".clip_btn");
const clipView = document.querySelector(".clip_view");

let keywordArr = [];

const API_KEY = config.API_KEY;
let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=korea&fq=korea&page=1&sort=newest&api-key=${API_KEY}`;

function reRender() {
  const newsArea = document.querySelector("#news_area");
  newsArea.remove();
  const createNewsArea = createEl("div");
  createNewsArea.id = "news_area";
  component.append(createNewsArea);
}

function resetKeyword() {
  keywordArr = [];
  const output = ``;
  recentlySearch.innerHTML = output;
  reRender();
}

function paintArticle(data) {
  const newsArea = document.querySelector("#news_area");
  innerText(clipView, "즐겨찾기 보기");
  const length = data.response.docs.length;
  if (length === 0) {
    alert("찾으시는 결과가 없습니다. 다시 검색해주세요.");
    return;
  }

  for (i = 0; i < length; i++) {
    const headline = data.response.docs[i].headline["main"];
    const date = data.response.docs[i].pub_date;
    const detail = data.response.docs[i].web_url;

    const div = createEl("div");
    const h3 = createEl("h3");
    const p = createEl("p");
    const clipBtn = createEl("button");
    const detailLinkBtn = createEl("button");
    const detailLink = createEl("a");

    innerText(h3, headline);
    innerText(p, date);
    innerText(clipBtn, "즐겨찾기 추가");
    innerText(detailLink, "자세히 보기");

    setAttribute(detailLink, "href", detail);
    setAttribute(detailLink, "target", "_blank");

    addClassList(div, "news_card");

    detailLinkBtn.appendChild(detailLink);
    div.appendChild(h3);
    div.appendChild(p);
    div.appendChild(clipBtn);
    div.appendChild(detailLinkBtn);
    newsArea.appendChild(div);

    function setClipFn() {
      if (clipBtn.innerText === "즐겨찾기 추가") {
        innerText(clipBtn, "즐겨찾기 해제");
        addClassList(div, "clip");
      } else {
        innerText(clipBtn, "즐겨찾기 추가");
        removeClassList(div, "clip");
      }
    }

    clipBtn.addEventListener("click", setClipFn);
  }
}

function recentlySearchKeyword() {
  const keyword = searchInput.value;
  keywordArr.push(keyword);

  if (keywordArr.length > 5) {
    keywordArr.shift();
  }

  switch (keywordArr.length) {
    case 1:
      output = `
        <span>${keywordArr[0]}</span>
      `;
      recentlySearch.innerHTML = output;
      break;
    case 2:
      output = `
        <span>${keywordArr[1]}</span>
        <span>${keywordArr[0]}</span>
      `;
      recentlySearch.innerHTML = output;
      break;
    case 3:
      output = `
        <span>${keywordArr[2]}</span>
        <span>${keywordArr[1]}</span>
        <span>${keywordArr[0]}</span>
      `;
      recentlySearch.innerHTML = output;
      break;
    case 4:
      output = `
        <span>${keywordArr[3]}</span>
        <span>${keywordArr[2]}</span>
        <span>${keywordArr[1]}</span>
        <span>${keywordArr[0]}</span>
      `;
      recentlySearch.innerHTML = output;
      break;
    case 5:
      output = `
        <span>${keywordArr[4]}</span>
        <span>${keywordArr[3]}</span>
        <span>${keywordArr[2]}</span>
        <span>${keywordArr[1]}</span>
        <span>${keywordArr[0]}</span>
      `;
      recentlySearch.innerHTML = output;
      break;
  }
}

function clipFn() {
  const newsCards = document.querySelectorAll(".news_card");

  newsCards.forEach(newsCard => {
    if (newsCard.className.includes("clip") !== true) {
      addClassList(newsCard, "hidden");
    }
    return;
  });

  if (clipView.innerText === "즐겨찾기 보기") {
    innerText(clipView, "전체기사 보기");
  } else if (clipView.innerText === "전체기사 보기") {
    innerText(clipView, "즐겨찾기 보기");
    newsCards.forEach(newsCard => {
      removeClassList(newsCard, "hidden");
    });
  }
}

function changeInput() {
  setTimeout(() => {
    const topic = searchInput.value;
    if (topic.trim().length !== 0) {
      url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${topic}&fq=${topic}&page=1&sort=newest&api-key=${API_KEY}`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          recentlySearchKeyword();
          reRender();
          paintArticle(data);
          searchInput.value = "";
        })
        .catch(error => console.log(error));
    }
  }, 5000);
}

function clickSearch(event) {
  event.preventDefault();
  const topic = searchInput.value;
  url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${topic}&fq=${topic}&page=1&sort=newest&api-key=${API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      recentlySearchKeyword();
      reRender();
      paintArticle(data);
      searchInput.value = "";
    })
    .catch(error => console.log(error));
}

function scrollSearch(event) {
  event.preventDefault();
  const topic = searchInput.value;
  url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${topic}&fq=${topic}&page=2&sort=newest&api-key=${API_KEY}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      paintArticle(data);
    })
    .catch(error => console.log(error));
}

function infiniteScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    scrollSearch(event);
  }
}

function addClassList(place, value) {
  place.classList.add(value);
}

function removeClassList(place, value) {
  place.classList.remove(value);
}

function setAttribute(place, attribute, value) {
  return place.setAttribute(attribute, value);
}

function createEl(element) {
  return document.createElement(element);
}

function innerText(element, content) {
  return (element.innerText = content);
}

if (clipView.innerText === "즐겨찾기 보기") {
  window.addEventListener("scroll", infiniteScroll);
}
clipView.addEventListener("click", clipFn);
deleteBtn.addEventListener("click", resetKeyword);
searchInput.addEventListener("change", changeInput);
searchForm.addEventListener("submit", clickSearch);
