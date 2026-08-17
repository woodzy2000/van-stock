// ================================
// NORMAL STOCK
// ================================

function changeQty(id, amount) {

    const qty = document.getElementById(id);

    if (!qty) {
        return;
    }

    let value = parseInt(qty.innerText);

    if (isNaN(value)) {
        value = 0;
    }

    value += amount;

    if (value < 0) {
        value = 0;
    }

    qty.innerText = value;

    // Save quantity
    localStorage.setItem("stock_" + id, value);

    // Save item name
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

    if (!stockItem) {
        return;
    }

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

    const quantities = document.querySelectorAll(
        ".stock-item .qty"
    );

    quantities.forEach(function(qty) {

        const id = qty.id;

        if (!id) {
            return;
        }

        // Save the item's name
        const stockItem = qty.closest(".stock-item");

        if (stockItem) {

            const name = stockItem.querySelector(
                "span:first-child"
            );

            if (name) {
                localStorage.setItem(
                    "stock_name_" + id,
                    name.innerText.trim()
                );
            }
        }

        // Get saved quantity
        const saved = localStorage.getItem(
            "stock_" + id
        );

        if (saved !== null) {
            qty.innerText = saved;
        }

        const value = parseInt(qty.innerText) || 0;

        updateLowStock(stockItem, value);
    });
}


// ================================
// EXTRA STOCK
// ================================

function addExtra(type) {

    const description = prompt(
        "Enter item description:"
    );

    if (!description || description.trim() === "") {
        return;
    }

    let quantity = prompt(
        "Enter quantity:",
        "1"
    );

    quantity = parseInt(quantity);

    if (isNaN(quantity) || quantity < 0) {
        quantity = 0;
    }

    const id = type + "_" + Date.now();

    const extra = {
        id: id,
        description: description.trim(),
        quantity: quantity
    };

    let extras = JSON.parse(
        localStorage.getItem(type + "_extras")
    ) || [];

    extras.push(extra);

    localStorage.setItem(
        type + "_extras",
        JSON.stringify(extras)
    );

    displayExtras(type);
}


// ================================
// DISPLAY EXTRAS
// ================================

function displayExtras(type) {

    const area = document.getElementById(
        type + "-extras"
    );

    if (!area) {
        return;
    }

    area.innerHTML = "";

    let extras = JSON.parse(
        localStorage.getItem(type + "_extras")
    ) || [];

    extras.forEach(function(extra) {

        const item = document.createElement("div");

        item.className = "stock-item";

        item.innerHTML = `
            <span>${extra.description}</span>

            <button onclick="changeExtraQty('${type}', '${extra.id}', -1)">
                -
            </button>

            <span class="qty" id="${extra.id}">
                ${extra.quantity}
            </span>

            <button onclick="changeExtraQty('${type}', '${extra.id}', 1)">
                +
            </button>

            <button class="delete-extra"
                onclick="deleteExtra('${type}', '${extra.id}')">
                ×
            </button>
        `;

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

function changeExtraQty(type, id, amount) {

    let extras = JSON.parse(
        localStorage.getItem(type + "_extras")
    ) || [];

    const extra = extras.find(function(item) {
        return item.id === id;
    });

    if (!extra) {
        return;
    }

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

function deleteExtra(type, id) {

    if (!confirm("Remove this extra item?")) {
        return;
    }

    let extras = JSON.parse(
        localStorage.getItem(type + "_extras")
    ) || [];

    extras = extras.filter(function(item) {
        return item.id !== id;
    });

    localStorage.setItem(
        type + "_extras",
        JSON.stringify(extras)
    );

    displayExtras(type);
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

        extraAreas.forEach(function(area) {

            const type =
                area.id.replace(
                    "-extras",
                    ""
                );

            displayExtras(type);
        });

    }
);
