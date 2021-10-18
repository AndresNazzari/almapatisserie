/**************************************************************
*        VARIABLES Y CONSTANTES
***************************************************************/
const serverURL = 'http://127.0.0.1:5501/'   //'https://www.almapatisserie.com.ar/'
const mockImgGalleryPath = 'assets/mock/gallery_images.json'
const GalleryImgFullPath = 'assets/img/gallery/fullscreen/'
const GalleryImgW328Path = 'assets/img/gallery/w328/'
const imagenes = document.querySelector('.imagenes');

/**************************************************************
*        FUNCIONES
***************************************************************/
function getImagenes() {
    fetch(`${serverURL}${mockImgGalleryPath}`).then((res) => res.json()).then((data) => printImagenes(data));
}

function printImagenes(data) {
    const itemContainer = document.createElement('div')
    itemContainer.className = 'gallery-container'

    data.forEach(item => {
        const galleryItem = document.createElement("div")
        galleryItem.setAttribute("class", "gallery__item")

        const aLight = document.createElement("a")
        aLight.setAttribute("href", serverURL + GalleryImgFullPath + item.image)
        aLight.setAttribute("data-lightbox", "roadtrip")

        const img = document.createElement("img")
        img.setAttribute("src", serverURL + GalleryImgW328Path + item.image)
        img.setAttribute("alt", "Imagen de galeria")
        img.setAttribute("width", item.width)
        img.setAttribute("height", item.height)
        img.setAttribute("class", "gallery_img")

        aLight.appendChild(img)
        galleryItem.appendChild(aLight)
        itemContainer.appendChild(galleryItem)
        imagenes.appendChild(itemContainer)
    });
}

/**************************************************************
*        LOGICA
***************************************************************/
window.onload = getImagenes();


//SCRIPT PARA OPCIONES DE LIGHTBOX
lightbox.option({
    'resizeDuration': 500,
    'showImageNumberLabel': true,
    'wrapAround': true
})

