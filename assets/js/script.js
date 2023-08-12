const imagesWrapper = document.querySelector(".images");
const manu_btn = document.querySelector(".hamburger");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const searchInputBox = document.querySelector(".sc0 input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const form = document.querySelector("form");


cancelBtn.onclick = () => {
    form.classList.remove("active");
    searchBtn.classList.remove("hide");
    cancelBtn.classList.remove("show1");
}

searchBtn.onclick = () => {
    form.classList.add("active");
    searchBtn.classList.add("hide");
    cancelBtn.classList.add("show1");
}

manu_btn.addEventListener('click', function () {
    manu_btn.classList.toggle('is-active');
})


//API key, paginations, searchTerm variables
const apiKey = "HWNxlx4nboc9S71t9LlM7TNOSvXgaeAwfN2LH3iHapBPnHzmhPIM4RRd";
const perPage = 200;
let currentPage = 1;
let searchTerm = null;


const downloadImg = (imgURL) => {
    //Converting received img to blob, creating its download link, & downloading it
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image!"));
}

const showLightbox = (name, img) => {
    //Showing lightbox and setting img source, name
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}



const generateHTML = (images) => {
    // Making li of all fetch images and adding them to the exissting image wrapper
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>` 
    ).join("");
}

const getImages = (apiURL) => {
    // Fetching images by API call with authorization header
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled"); 
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled"); 
    }).catch(() => alert("Failed to load images!"));
}

const loadMoreImages = () => {
    currentPage++;  //Increment currentPage by 1
    // If searchTerm has some value then call API with search term else call default API
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages =(e) => {
    //If the search input is empty, set the search term to null and return from here
    if(e.target.value === "") return searchTerm = null;
    //If pressed key is Enter, update the current page, search term & call the getImages
    if(e.key === "Enter"){
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
searchInputBox.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));