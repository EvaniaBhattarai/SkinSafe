"use strict";

function MakeProduct({
    name = "Unknown Product Name",
    img = "pics/none.png",
    category = "N/A",
    price = "10.00"
} = {}) {

    let product = {name:name, price:price};
    const productDiv = document.createElement("div");

    productDiv.innerHTML = `
        <h3>Name: <span class="nameDisplay">${product.name}</span></h3>
        <p>Img: <img src='${img}'></p>
        <p>Category: ${category}</p>
        <p>Price: <span class="priceDisplay">${product.price}</span></p>
        <label>Price Change (+/-): <input class="priceChangeInput" type="number"></label>
        <button class="updatePriceBtn">Change Price</button><br>
        <label> Product Name: <input class="productNameInput" type="text"></label>
    `;

    productDiv.classList.add("product");

    const updatePriceBtn = productDiv.querySelector(".updatePriceBtn");
    const priceChangeInput = productDiv.querySelector(".priceChangeInput");
    const priceDisplay = productDiv.querySelector(".priceDisplay");
    

    updatePriceBtn.onclick = () => {
        const priceChange = Number(priceChangeInput.value);
        if (!isNaN(priceChange) && priceChange !== 0) {
            product.price = Number(product.price) + priceChange; // update price variable
            display();
        } else {
            alert("Please enter a valid number.");
        }
        priceChangeInput.value = ""; // clear input
    };

    const nameDisplay = productDiv.querySelector(".nameDisplay");
    function display() {
        priceDisplay.textContent = product.price;
        nameDisplay.textContent = product.name;
    }
    const productNameInput = productDiv.querySelector(".productNameInput");
    productNameInput.onchange = () => {
        console.log("The new value is: " + productNameInput.value);
        product.name = productNameInput.value;
        display();
    };


    return productDiv;
}

/*function MakeProduct({ name = "La Roche-Posay Effaclar Duo", img = "https://laroche-posay.us/images/effaclar.jpg", category = "skincare", rating = "5",})
{
    const productDiv = document.createElement("div");
    productDiv.classList.add("obj"); // adds styling to ele - see obj.css rules for ".obj"

    // create h2 tag. Will be styled by rules (in obj.css) for ".obj h2"
    var myHeading = document.createElement("h2");
    myHeading.innerHTML = name;
    productDiv.appendChild(myHeading);

    myHeading.onclick= function() {
        alert("You'll love "+title + "!!");
    };

    // create img tag. Will be styled by rules (in obj.css) for ".obj img"
    var myImage = document.createElement("img");
    myImage.src = imgFile;
    ele.appendChild(myImage);

    // create p (paragraph) tag. Will be styled by rules (in obj.css) for ".obj p"
    var myPara = document.createElement("p");
    myPara.innerHTML = text;
    ele.appendChild(myPara);

    return ele;
}*/