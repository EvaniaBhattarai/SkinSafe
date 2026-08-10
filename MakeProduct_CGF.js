"use strict";

function MakeProduct_CGF() {
    let container = document.createElement("div");
    container.classList.add("productList");
    
    const prodData = {
        name: "La Roche-Posay Effaclar Duo",
        img: "./images/larocher.webp",
        category: "skincare",
        rating: "5"
    };
    container.append(MakeProduct(prodData));
    const prod2Data = {
        name: "Maybelline Lash Sensational Mascara",
        img: "./images/mascara.jpg",
        category: "Makeup",
        price: "12"
    };
    container.append(MakeProduct(prod2Data));
    container.append(MakeProduct());
    return container;
}
