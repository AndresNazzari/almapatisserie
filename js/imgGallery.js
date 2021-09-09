const serverURL = 'https://www.almapatisserie.com.ar/'
const mockImgGalleryPath = 'assets/mock/gallery_images.json'
const GalleryImgFullPath = 'assets/img/gallery/fullscreen/'
const GalleryImgW328Path = 'assets/img/gallery/w328/'

const imagenes = document.querySelector('.imagenes');

window.onload = getImagenes();


function getImagenes() {
    fetch(`${serverURL}${mockImgGalleryPath}`).then((res) => res.json()).then((data) => printImagenes(data));
}

function printImagenes(data) {
    const itemContainer = document.createElement('div')
    itemContainer.className = 'gallery-container'

    data.forEach(item => {
        itemContainer.innerHTML += createDomElement(item)
        imagenes.append(itemContainer)
    });
}

function createDomElement(item) {
    const itemHtml =
        `<div class="gallery__item">
            <a href = ${serverURL}${GalleryImgFullPath}${item.image} data-lightbox="roadtrip">
                <img src=${serverURL}${GalleryImgW328Path}${item.image} alt="Imagen de galeria"
                class="gallery_img" width=${item.width} height=${item.height}>
            </a>
        </div>`;
    return itemHtml

}