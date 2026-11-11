getData();

$("form").submit(function (e) {
    e.preventDefault();
    const category = $("#category").val();
    const search = $("#search").val();
    getData(category, search, 1);
});