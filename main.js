
let inputData = document.getElementById("searchBookInput");
let searchButton = document.getElementById("searchBook");
let bookresultsDiv = document.getElementById("bookResualts");
let notFoundBooks = document.getElementById("notFoundBook");
///get last search from localstorage
let lastSearch = window.localStorage.getItem("History");


window.addEventListener('load', function () {
    ///when window load firs create a model from ShowBookResults for show results of books last search 
    let showResults = new ShowBookResults();
    ///if in local storage be a search run if block body 
    if (localStorage.getItem("History") !== null) {
        inputData.focus();
        inputData.value = lastSearch;
        inputData.nextElementSibling.className = "active";
        showResults.promise(fetch("https://www.googleapis.com/books/v1/volumes?q=name:" + lastSearch.split(' ').join('')));
    }

})



///This func delete each old results whene click search button (I use prototype)
function DeleteOldResults() { }
//create deletenode methode as DeleteOldResults prototype 
DeleteOldResults.prototype.deletenode = function (node) {
    //Delete all node if that node has any child
    while (node.hasChildNodes()) {
        node.removeChild(node.childNodes[0]);
    }
}
///Define ShowBookResults func as porototype
function ShowBookResults() {
    ///Call DeleteOldResults in ShowBookResults
    DeleteOldResults.call(this);
    ///Create methode with name 'promise' and declare promise in that alseo with one argument   
    this.promise = function (promise) {
        ///this promise argument is Our input value
        promise
            .then(function (response) {
                ///convert result to json
                return response.json();

            }).then(
                function (json) {
                    /// If no results return will be displayed notFoundBooks element 
                    ///and the continuation of the codes will not be executed else versa
                    if (json.totalItems === 0) {
                        notFoundBooks.setAttribute("style", "display: block;")
                        return 0;
                    } else {
                        notFoundBooks.setAttribute("style", "display: none;")
                    }
                    ///show each result in card  
                    for (let i = 0; i < json.items.length; i++) {
                        bookresultsDiv.innerHTML += '<div class="col-4 mb-4">' +
                            '<div class="card">' +
                            '<div class="view overlay">' +
                            '<img class="card-img-top"' +
                            'src=' + json.items[i].volumeInfo.imageLinks.thumbnail +
                            'alt="Card image cap">' +
                            '<a href="' + json.items[i].volumeInfo.previewLink + '" target="_blank">' +
                            '<div class="mask rgba-white-slight waves-effect waves-light"></div>' +
                            '</a>' +
                            '</div>' +
                            '<div class="card-body">' +
                            '<h4 class="card-title">' + json.items[i].volumeInfo.title + '</h4>' +
                            '<p class="card-text">' + json.items[i].volumeInfo.description + '</p>' +
                            '<a href="' + json.items[i].volumeInfo.previewLink + '" target="_blank" " class="btn btn-primary">مطالعه بیشتر</a>' +
                            '</div>' +
                            ' </div>' +
                            ' </div >';
                    }
                }
            )
    }
}
///use DeleteOldResults in ShowBookResults as a prototype
ShowBookResults.prototype = Object.create(DeleteOldResults.prototype)

searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.localStorage.setItem("History", inputData.value.split(' ').join(''));
    let showResults = new ShowBookResults();
    let promise = fetch("https://www.googleapis.com/books/v1/volumes?q=name:" + inputData.value.split(' ').join(''));
    showResults.deletenode(bookresultsDiv);
    showResults.promise(promise);
})




