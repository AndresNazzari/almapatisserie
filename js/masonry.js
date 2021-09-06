
var elem = document.querySelector('.gallery-container');
var msnry = new Masonry(elem, {
    // options
    itemSelector: '.gallery__item',
    columnWidth: 328,
    gutter: 20,
    isFitWidth: true,
});