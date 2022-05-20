const url = window.location.search;
const orderId = url.replace('?', '').replace('=', '');
console.log(orderId);
document.getElementById('orderId').textContent = orderId