const handleSearch = (event) => {
    event.preventDefault();
    let searchList = JSON.parse(localStorage.getItem("searchList"));
    if (searchList && searchList.length > 0) {
        localStorage.setItem("searchList", JSON.stringify([event.target.search.value, ...searchList]));
    } else {
        localStorage.setItem("searchList", JSON.stringify([event.target.search.value]));
    }
    window.location.href = "/history.html";
}

const searchWord = async (word) => {
    let contentDiv = document.querySelector("#contentDiv");
    let innerHtml = contentDiv.innerHTML;
    contentDiv.innerHTML = '<div class="spinner-border text-primary" role="status" style="width: 100px; height: 100px; --bs-spinner-border-width:10px; --bs-spinner-animation-speed:2s;"><span class="visually-hidden">Loading...</span></div>';
    let res = await fetch(`/.netlify/functions/search-word?word=${word}`)
    let data = await res.json();
    if (!data.valid) {
        return false
    }
    contentDiv.innerHTML = innerHtml;
    return data.definition
}

const handleContainerClick = async (e) => {
    document.querySelector("#card.active")?.classList.remove("active");
    let cardList = document.querySelector("#cardContainer").childNodes
    cardList.forEach((elem) => {
        if (elem.innerText === e.target.innerText) {
            elem.classList.add("active");
        }
    })
    let definition = await searchWord(e.target.innerText);
    document.querySelector("h1#title").innerText = e.target.innerText;
    document.querySelector("p#description").innerHTML = definition.replace(/(\d+)\./g, '<br/>$1.');
}

let darkMode = window.matchMedia("(prefers-color-scheme)");
if (darkMode.matches){
    document.documentElement.setAttribute("data-bs-theme", "dark");
}

try {
    searchForm.addEventListener('submit', handleSearch);
} catch {
}
try {
    let card = document.querySelector("#card")
    let searchList = JSON.parse(localStorage.getItem("searchList"));
    if (searchList && searchList.length > 0) {
        searchList.forEach((item) => {
            let new_card = card.cloneNode(true);
            new_card.querySelector("#text").innerText = item;
            card.parentNode.appendChild(new_card)
        })
    } else {
        card.parentNode.innerHTML = "<h2 class='mx-auto'>No results found</h2>";
    }
    card.remove()
    document.querySelector("#card").classList.add("active");
    cardContainer.addEventListener("click", handleContainerClick);
    searchWord(searchList[0]).then(data => {
        if (data === false) {
            alert("Sorry, we couldn't find any results")
            localStorage.setItem("searchList", JSON.stringify(searchList.slice(1,)));
            window.location.reload()
            return
        }
        document.querySelector("h1#title").innerText = searchList[0];
        document.querySelector("p#description").innerHTML = data.replace(/(\d+)\./g, '<br/>$1.');
    })
} catch {
}