const API_BASEURL = "https://api.themoviedb.org/3";

const inp = document.getElementById("myInput");
const clearHistory = document.getElementById("clear-history");
const ul = document.getElementById('ul-element');

let currentFocus;
let data = [];

const closeAllLists = (elmnt) => {
    const x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
};

const clearHistoryList = () => {
    ul.innerHTML = "";
    data = [];
};

const renderSearchHistory = () => {
    ul.innerHTML = "";
    for (i = 0; i <= data.length - 1; i++) {
        const li = document.createElement('li');
        li.setAttribute("class", "search-history");
        li.innerHTML = "<p>" + data[i].name + "</p><span>" + data[i].time + " <span id='single-remove' onclick={removeItem(" + i + ")}>X</span></span>"
        ul.appendChild(li);
        removeSingle = document.getElementById("single-remove");
    }
};

const createSearchHistory = (title) => {
    ul.innerHTML = "";
    data.push({ name: title, time: new Date().toLocaleString() })
    renderSearchHistory();
};

const removeItem = (key) => {
    data.splice(key, 1);
    renderSearchHistory();
};

inp.addEventListener("input", function (e) {
    const val = e.target.value;
    if (!val || val.length === 0) return;

    fetch(`${API_BASEURL}/search/company?api_key=4b362574a245356411cd7a6a115441d0&query=${val}&page=1`)
        .then((response) => response.json())
        .then((data) => {
            const arr = data.results;
            closeAllLists();

            currentFocus = -1;

            const outerEle = document.createElement("div");
            outerEle.setAttribute("id", e.target.id + "autocomplete-list");
            outerEle.setAttribute("class", "autocomplete-items");

            e.target.parentNode.appendChild(outerEle);

            for (let i = 0; i < arr.length; i++) {
                const innerDiv = document.createElement("div");
                innerDiv.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                innerDiv.innerHTML += arr[i].name.substr(val.length);
                innerDiv.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
                innerDiv.addEventListener("click", function (e) {
                    inp.value = e.target.getElementsByTagName("input")[0].value;
                    createSearchHistory(inp.value)
                    closeAllLists();
                });
                outerEle.appendChild(innerDiv);
            }
        });
});

clearHistory.addEventListener("click", () => {
    clearHistoryList();
});
