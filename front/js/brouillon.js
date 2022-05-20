// items model
class Item {
  constructor(color,
    imageUrl,
    altText,
    name,
    description,
    price,
    quant,
    totalPrice,
    id) {
    this.color = color;
    this.imageUrl = imageUrl;
    this.altText = altText;
    this.name = name;
    this.description = description;
    this.price = price;
    this.quant = quant;
    this.totalPrice = totalPrice;
    this.id = id
  }
  changQt(newQt) {
    this.quant = newQt;
  }
}

// shopping cart model with is properties and methods
class Cart {

  itemOption = JSON.parse(localStorage.getItem('option'));
  itemsListUrl = 'http://localhost:3000/api/products/';
  items = [];
  cartPrice = []; //Total cart price

  // method to items quantity
  qtyUpdate(id, color, qty) {
    for (let i in this.items) {
      if (this.items[i].id == id && this.items[i].color == color) {
        this.items[i].totalPrice = qty * this.items[i].price;
        console.log(this.items[i].totalPrice)
      }
    }
  }

  // method to delete items   
  removeItem(itemId, productColor) {
    console.log(itemId)
    console.log(productColor)
    this.itemOption = this.itemOption.filter(function (current) { return current.id != itemId, current.itemColor != productColor });
    console.log(this.itemOption);
    localStorage.setItem('option', JSON.stringify(this.itemOption));
    window.location.reload();
  }

  // method to get all the item price array in the cart (to calculate its total price)  
  setCartPrice(arr) {
    for (let i in arr) { this.cartPrice.push(arr[i].totalPrice) }

    return this.cartPrice;
  }

  // method to get data from API  
  getItemData(url) {
    return fetch(url)
      .then(function (rep) {
        return rep.json();
      });
  }

  //methode to create items objet  
  creatItems() {
    for (let i in this.itemOption) {
      this.getItemData(this.itemsListUrl + this.itemOption[i].id)
        .then((res) => {
          const newItem = new Item(
            this.itemOption[i].itemColor,
            res.imageUrl,
            res.altTxt,
            res.name,
            res.description,
            res.price,
            this.itemOption[i].quant,
            (this.itemOption[i].quant) * (res.price),
            res._id,
          );
          this.items.push(newItem);
        })
    }
    return new Promise((resolve, rejects) => {
      setTimeout(() => { (this.items.length >= 0) ? resolve(this.items) : rejects('pas d items') }, 200)
    })
  }
}
const cart = new Cart;
let cartItems = cart.items;


function displayPrice(arr) {
  const itemPriceLt = [];
  for (let i in arr) { itemPriceLt.push(arr[i].totalPrice) }
  document.getElementById('totalPrice').innerHTML = itemPriceLt.reduce((acc, prix) => {
    return acc + prix;

  }, 0);
}

async function displayCart() {
  const res = await cart.creatItems();
  for (let i in res) {
    const article = document.createElement('article');
    document.getElementById('cart__items').appendChild(article);
    article.setAttribute('data-id', `${res[i].id}`);
    article.classList.add('cart__item');
    article.setAttribute('data-color', `${res[i].color}`);
    article.innerHTML = `<div class="cart__item__img">
     <img src=${res[i].imageUrl} alt=${res[i].altText}>
   </div>
   <div class="cart__item__content">
     <div class="cart__item__content__description">
       <h2>${res[i].name}</h2>
       <p>${cart.items[i].color}</p>
       <p>${res[i].price} €</p>
     </div>
     <div class="cart__item__content__settings">
       <div class="cart__item__content__settings__quantity">
         <p>Qté : </p>
         <input type="number" data-inputid=${res[i].id} data-itemcolor=${res[i].color} class="itemQuantity" name="itemQuantity" min="1" max="100" value="${res[i].quant}">
       </div>
       <div class="cart__item__content__settings__delete">
         <p data-itemid=${res[i].id} data-productcolor=${res[i].color} class="deleteItem">Supprimer</p>
       </div>
     </div>
   </div>`;

  }
  displayPrice(cartItems)
  editQty()
  delet()
}

function editQty() {
  const qtyInput = document.querySelectorAll('.itemQuantity');
  for (i = 0; i < qtyInput.length; i++) {
    let currentElement = qtyInput[i].value;
    const id = qtyInput[i].dataset.inputid;
    const color = qtyInput[i].dataset.itemcolor;
    qtyInput[i].addEventListener('input', (e) => {
      currentElement = e.target.value;
      cart.qtyUpdate(id, color, currentElement);
      displayPrice(cartItems);

    })
  }

}

function delet() {
  const deleteButtons = document.querySelectorAll('.deleteItem');
  for (i = 0; i < deleteButtons.length; i++) {
    const currentElement = deleteButtons[i].dataset.itemid;
    const currentElementColor = deleteButtons[i].dataset.productcolor;
    deleteButtons[i].addEventListener('click', (e) => {
      console.log(currentElementColor)
      cart.removeItem(currentElement, currentElementColor);
    })
  }
}

function contactEventConstructor(id, regex, errorMsg) {
  document.getElementById(id).addEventListener('input', (event) => {
    regex.test(event.target.value) ?
      document.getElementById(`${id}` + 'ErrorMsg').textContent = '' :
      document.getElementById(`${id}` + 'ErrorMsg').textContent = `${errorMsg}`
  })
}

function redirect(orderId) {
  location.href = `../html/confirmation.html?=${orderId}`;
}

function validation() {

  contactEventConstructor('firstName', /^[a-zéèçïê' ]{2,25}$/i, 'prenom invalide');
  contactEventConstructor('lastName', /^[a-zéèçïê' ]{2,25}$/i, 'Nom invalide');
  contactEventConstructor('address', /^[0-9]{1,10} [a-z. -]{2,} [0-9]{1,7}$/i, 'Adresse invalide. Ex: 7 place de la Barrasse 13011');
  contactEventConstructor('city', /^[a-zéèçïê' -]{2,50}$/i, 'Ville incorrecte');
  contactEventConstructor('email', /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i, 'Ville incorrecte');

  const submit = document.getElementById('order');
  submit.addEventListener('click', (event) => {
    event.preventDefault();

    const firstName = /^[a-zéèçïê' ]{2,25}$/i.test(document.getElementById('firstName').value);
    const lastName = /^[a-zéèçïê' ]{2,25}$/i.test(document.getElementById('lastName').value);
    const adresse = /^[0-9]{1,10} [a-z .-]{2,} [0-9]{1,7}$/i.test(document.getElementById('address').value)
    const city = /^[a-zéèçïê' -]{2,50}$/i.test(document.getElementById('city').value);
    const email = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i.test(document.getElementById('email').value);

    if (firstName && lastName && adresse && city && email && cartItems.length > 0) {
      const contactObjet = {
        firstName: `${document.getElementById('firstName').value}`,
        lastName: `${document.getElementById('lastName').value}`,
        address: `${document.getElementById('address').value}`,
        city: `${document.getElementById('city').value}`,
        email: `${document.getElementById('email').value}`
      };
      const productsArray = [];
      for (let i in cartItems) { productsArray.push(cartItems[i].id) }
      const finalObjet = { contactObjet, productsArray }

      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact: contactObjet, products: productsArray })
      })
        .then((resp) => {
          return resp.json();
        })
        .then((res) => { redirect(res.orderId) })
    }
    else {
      console.log('Verifier les champs');
    }
  })
}
displayCart();
validation();




