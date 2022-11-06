const itemsListUrl = 'http://localhost:3000/api/products/';

// =================== GET DATA FROM API ====================
function getData(url) {
    return fetch(url)
        .then(function (res) {
            return res.json();
        })
}

// =================== DISPLAY ALL ITEMS ====================
function displayDatas() {
    getData(itemsListUrl)
        .then(function (datas) {
            const itemsBlock = document.getElementById('items');
            for (let i in datas) {
                const item = document.createElement('a');
                itemsBlock.appendChild(item);
                item.setAttribute('href', `./product.html?id=${datas[i]._id}`);
                item.innerHTML = `<article>
                  <img src=${datas[i].imageUrl} alt=${datas[i].altText}>
                  <h3 class=${datas[i].name}>${datas[i].name}</h3>
                  <p class=${datas[i].description}>${datas[i].description}</p>
                </article>
                </a>`
            }
        })
}
displayDatas();