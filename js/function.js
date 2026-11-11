const API_KEY = "d3a3d6ccca824a2dad53488545702f74";
const PAGE_SIZE = 10;
const MAX_PAGES = 10;
const NO_IMAGE = "./images/no-image-available.jpg";

async function getData(category = "business", search = "", page = 1) {
    const parameters = new URLSearchParams({
        country: "us",
        category: category,
        q: search,
        pageSize: PAGE_SIZE,
        page: page,
        apiKey: API_KEY
    });

    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?${parameters}`);
        const myData = await response.json();

        if (myData.status !== "ok") {
            showMessage(myData.message || "Something went wrong");
            return;
        }
        showData(myData, page);
    } catch (error) {
        console.error(error);
        showMessage("Network error, please try again");
    }
}

function showData(data, currentPage) {
    const numberOfPages = Math.min(Math.ceil(data.totalResults / PAGE_SIZE), MAX_PAGES);
    const news = data.articles;
    const $dataContainer = $("#data .row");

    $dataContainer.html("");

    if (news.length > 0) {
        for (let item of news) {
            $dataContainer.append(cardComponent(item));
        }
        $("nav .pagination").html(preparePagination(currentPage, numberOfPages));
    } else {
        showMessage("No results found");
    }
}

function showMessage(message) {
    $("#data .row").html(`<div class="col-12"><div class="alert alert-warning text-center">${message}</div></div>`);
    $("nav .pagination").html("");
}

function preparePagination(currentPage, totalPages) {
    const prevPage = Math.max(currentPage - 1, 1);
    const nextPage = Math.min(currentPage + 1, totalPages);

    let lis = `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                  <a class="page-link" style="cursor:pointer" onclick="paginate(${prevPage})">Previous</a></li>`;

    for (let i = 1; i <= totalPages; i++) {
        lis += `<li class="page-item ${currentPage === i ? 'active' : ''}">
                  <a class="page-link" style="cursor:pointer" onclick="paginate(${i})">${i}</a></li>`;
    }

    lis += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                  <a class="page-link" style="cursor:pointer" onclick="paginate(${nextPage})">Next</a></li>`;
    return lis;
}

function cardComponent(item) {
    return `<div class="col-lg-4 mb-5">
                <div class="item">
                    <div class="card m-auto" style="max-width: 320px">
                        <img src="${item.urlToImage ?? "no image avaliable.jpg"}" class="card-img-top" alt="${item.title ?? ''}"
                             onerror="this.src='${"no image avaliable.jpg"}'">
                        <div class="card-body">
                            <h4 class="card-title">${item.title?.slice(0, 40) ?? ''}</h4>
                            <p class="card-text">${item.description?.slice(0, 150) ?? ''}</p>
                            <a href="${item.url}" target="_blank" class="btn btn-primary">See More</a>
                        </div>
                    </div>
                </div>
            </div>`;
}

function paginate(pageNumber) {
    const category = $("#category").val();
    const search = $("#search").val();
    getData(category, search, pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
}