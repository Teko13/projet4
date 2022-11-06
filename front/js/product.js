const link = window.location.search;
const param = new URLSearchParams(link).get("id");
const objetUrl = `http://localhost:3000/api/products/${param}`;

// =================== GET ITEM FROM API ====================
function getItemData(url) {
    return fetch(url)
        .then(function (rep) {
            return rep.json();
        });
}

// =================== CREATION OF COLOR SELECTOR INPUT ====================
function setColorsOptionsIputs(colorArray) {
    for (i in colorArray) {
        const option = document.createElement('option');
        option.setAttribute("value", colorArray[i]);
        option.textContent = `${colorArray[i]}`;
        document.getElementById('colors').appendChild(option);
    }
}

// =================== CHECK OF LOCAL STORAGE AND ADD ITEM OPTION ====================
function addItem(itemOjet) {
    const button = document.getElementById('addToCart');
    button.addEventListener('click', () => {

        if (document.getElementById('colors').value == '') {
            alert("Couleur obligatoir")
        }

        else if (
            document.getElementById('quantity').value <= 0 ||
            document.getElementById('quantity').value > 100) {
            alert("Quantité incorrecte (doit être supérieur à 0)")
        }

        else {
            let item = {
                id: `${itemOjet._id}`,
                itemColor: `${document.getElementById('colors').value}`,
                quant: `${document.getElementById('quantity').value}`
            }
            let saveOption = JSON.parse(localStorage.getItem('option'));
            if (saveOption) {
                saveOption.find(curent => (
                    curent.id == item.id) && (curent.itemColor == item.itemColor)) ?
                    saveOption.forEach((curent) => {
                        if (curent.id == item.id) { curent.quant = parseInt(item.quant) + parseInt(curent.quant) }
                    }) :
                    saveOption.push(item);
                localStorage.setItem('option', JSON.stringify(saveOption));
                alert('article ajouté');
            }
            else {
                saveOption = [];
                saveOption.push(item);
                localStorage.setItem('option', JSON.stringify(saveOption));
                alert('article ajouté');
            }
        }


    })
}

// =================== DISPLAY ITEM DETAILS ====================
function displayItem() {
    getItemData(objetUrl)
        .then(function (itemObjet) {
            document.querySelector('.item__img').innerHTML = `<img src=${itemObjet.imageUrl} alt=${itemObjet.altTxt}>`;
            document.getElementById('title').innerHTML = `${itemObjet.name}`;
            document.getElementById('price').innerHTML = `${itemObjet.price}`;
            document.getElementById('description').textContent = `${itemObjet.description}`;
            setColorsOptionsIputs(itemObjet.colors);
            addItem(itemObjet);
        });
}
displayItem();


