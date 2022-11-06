const url = window.location.search;
const orderId = new URLSearchParams(url).get("");
document.getElementById('orderId').textContent = orderId;