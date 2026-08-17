// ================================
// NORMAL STOCK
// ================================

function changeQty(id, amount) {

    const qty = document.getElementById(id);

    if (!qty) return;

    let value = parseInt(qty.innerText);

    if (isNaN(value)) value = 0;

    value += amount;

    if (value < 0) value = 0;

    qty.innerText = value;

    localStorage.setItem("stock_" + id, value);

    const stockItem = qty.closest(".stock-item");

    if (stockItem) {

        const name = stockItem.querySelector("span:first-child");

        if (name) {
            localStorage.setItem(
                "stock_name_" + id,
                name.innerText.trim()
            );
        }

        updateLowStock(stockItem, value);
    }
}


// ================================
// LOW STOCK
// ================================

function updateLowStock(stockItem, value) {

    if (!stockItem) return;

    if (value <= 1) {
        stockItem.classList.add("low-stock");
    } else {
        stockItem.classList.remove("low-stock");
    }
}


// ================================
// LOAD NORMAL STOCK
// ================================

function loadStock() {

    const quantities =
        document.querySelectorAll(".stock-item .qty");

    quantities.forEach(function(qty) {

        const id = qty.id;

        if (!id) return;

        const stockItem =
            qty.closest(".stock-item");

        if (stockItem) {

            const name =
                stockItem.querySelector(
                    "span:first-child"
                );

            if (name) {

                localStorage.setItem(
                    "stock_name_" + id,
                    name.innerText.trim()
                );
            }
        }

        const saved =
            localStorage.getItem(
                "stock_" + id
            );

        if (saved !== null) {
            qty.innerText = saved;
        }

        const value =
            parseInt(qty.innerText) || 0;

        updateLowStock(
            stockItem,
            value
        );
    });
}


// ================================
// EXTRA STOCK
// ================================

function addExtra(type) {

    const description =
        prompt("Enter item description:");

    if (!description ||
        description.trim() === "") {
        return;
    }

    let quantity =
        prompt("Enter quantity:", "1");

    quantity = parseInt(quantity);

    if (isNaN(quantity) ||
        quantity < 0) {
        quantity = 0;
    }

    const id =
        type + "_" + Date.now();

    const extra = {
        id: id,
        description: description.trim(),
        quantity: quantity
    };

    let extras =
        JSON.parse(
            localStorage.getItem(
                type + "_extras"
            )
        ) || [];

    extras.push(extra);

    localStorage.setItem(
        type + "_extras",
        JSON.stringify(extras)
    );

    displayExtras(type);
}


// ================================
// DISPLAY EXTRA STOCK
// ================================

function displayExtras(type) {

    const area =
        document.getElementById(
            type + "-extras"
        );

    if (!area) return;

    area.innerHTML = "";

    let extras =
        JSON.parse(
            localStorage.getItem(
                type + "_extras"
            )
        ) || [];

    extras.forEach(function(extra) {

        const item =
            document.createElement("div");

        item.className =
            "stock-item";


        // PHOTO

        if (extra.photo) {

            const photo =
                document.createElement("img");

            photo.src =
                extra.photo;

            photo.alt =
                extra.description;

            photo.style.width = "80px";
            photo.style.height = "80px";
            photo.style.objectFit = "cover";
            photo.style.borderRadius = "8px";
            photo.style.marginRight = "10px";
            photo.style.cursor = "pointer";


            photo.onclick = function() {

                if (
                    typeof showHingePhoto ===
                    "function"
                ) {

                    showHingePhoto(
                        extra.photo
                    );

                }

            };


            item.appendChild(photo);
        }


        // NAME

        const name =
            document.createElement("span");

        name.innerText =
            extra.description;

        item.appendChild(name);


        // MINUS

        const minus =
            document.createElement("button");

        minus.innerText = "-";

        minus.onclick = function() {

            changeExtraQty(
                type,
                extra.id,
                -1
            );

        };

        item.appendChild(minus);


        // QUANTITY

        const quantity =
            document.createElement("span");

        quantity.className = "qty";

        quantity.id =
            extra.id;

        quantity.innerText =
            extra.quantity;

        item.appendChild(quantity);


        // PLUS

        const plus =
            document.createElement("button");

        plus.innerText = "+";

        plus.onclick = function() {

            changeExtraQty(
                type,
                extra.id,
                1
            );

        };

        item.appendChild(plus);


        // DELETE

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-extra";

        deleteButton.innerText =
            "×";

        deleteButton.onclick =
            function() {

                deleteExtra(
                    type,
                    extra.id
                );

            };

        item.appendChild(
            deleteButton
        );


        area.appendChild(item);


        updateLowStock(
            item,
            extra.quantity
        );

    });
}


// ================================
// CHANGE EXTRA QUANTITY
// ================================

function changeExtraQty(
    type,
    id,
    amount
) {

    let extras =
        JSON.parse(
            localStorage.getItem(
                type + "_extras"
            )
        ) || [];

    const extra =
        extras.find(
            function(item) {
                return item.id === id;
            }
        );

    if (!extra) return;

    extra.quantity += amount;

    if (extra.quantity < 0) {
        extra.quantity = 0;
    }

    localStorage.setItem(
        type + "_extras",
        JSON.stringify(extras)
    );

    displayExtras(type);
}


// ================================
// DELETE EXTRA
// ================================

function deleteExtra(
    type,
    id
) {

    if (
        !confirm(
            "Remove this extra item?"
        )
    ) {
        return;
    }

    let extras =
        JSON.parse(
            localStorage.getItem(
                type + "_extras"
            )
        ) || [];

    extras =
        extras.filter(
            function(item) {
                return item.id !== id;
            }
        );

    localStorage.setItem(
        type + "_extras",
        JSON.stringify(extras)
    );

    displayExtras(type);
}


// ================================
// ADDITIONAL HINGE PHOTO
// ================================

function saveHingeWithPhoto(
    description,
    quantity,
    photo
) {

    const id =
        "hinges_" + Date.now();


    if (photo) {

        compressHingePhoto(
            photo,
            function(compressedPhoto) {

                saveHingeItem(
                    id,
                    description,
                    quantity,
                    compressedPhoto
                );

            }
        );

    } else {

        saveHingeItem(
            id,
            description,
            quantity,
            ""
        );

    }
}


// ================================
// SAVE HINGE
// ================================

function saveHingeItem(
    id,
    description,
    quantity,
    photo
) {

    const extra = {

        id: id,

        description:
            description.trim(),

        quantity:
            quantity,

        photo:
            photo

    };


    let extras =
        JSON.parse(
            localStorage.getItem(
                "hinges_extras"
            )
        ) || [];


    extras.push(extra);


    try {

        localStorage.setItem(
            "hinges_extras",
            JSON.stringify(extras)
        );

    } catch (error) {

        alert(
            "The photo is too large to save. Please try another photo."
        );

        return;
    }


    displayExtras(
        "hinges"
    );
}


// ================================
// COMPRESS PHOTO
// ================================

function compressHingePhoto(
    dataUrl,
    callback
) {

    const image =
        new Image();


    image.onload =
        function() {

            const maxSize =
                1000;

            let width =
                image.width;

            let height =
                image.height;


            if (width > height) {

                if (width > maxSize) {

                    height =
                        height *
                        (maxSize / width);

                    width =
                        maxSize;
                }

            } else {

                if (height > maxSize) {

                    width =
                        width *
                        (maxSize / height);

                    height =
                        maxSize;
                }
            }


            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                width;

            canvas.height =
                height;


            const context =
                canvas.getContext(
                    "2d"
                );


            context.drawImage(
                image,
                0,
                0,
                width,
                height
            );


            const compressed =
                canvas.toDataURL(
                    "image/jpeg",
                    0.70
                );


            callback(
                compressed
            );

        };


    image.onerror =
        function() {

            callback("");

        };


    image.src =
        dataUrl;
}


// ================================
// PAGE START
// ================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadStock();

        const extraAreas =
            document.querySelectorAll(
                "[id$='-extras']"
            );

        extraAreas.forEach(
            function(area) {

                const type =
                    area.id.replace(
                        "-extras",
                        ""
                    );

                displayExtras(type);

            }
        );

    }
);