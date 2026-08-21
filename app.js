function updateLowStock(item, value) {
	if (item) item.classList.toggle("low-stock", value <= 1);
}

function changeQty(id, amount) {
	const qty = document.getElementById(id);
	if (!qty) return;
	let value = parseInt(qty.innerText, 10) || 0;
	value = Math.max(0, value + amount);
	qty.innerText = value;
	localStorage.setItem("stock_" + id, value);
	const item = qty.closest(".stock-item");
	if (item) {
		const name = item.querySelector("span:first-child");
		if (name) localStorage.setItem("stock_name_" + id, name.innerText.trim());
		updateLowStock(item, value);
	}
}

function loadStock() {
	document.querySelectorAll(".stock-item .qty").forEach(qty => {
		const id = qty.id;
		if (!id) return;
		const item = qty.closest(".stock-item");
		const name = item && item.querySelector("span:first-child");
		if (name) localStorage.setItem("stock_name_" + id, name.innerText.trim());
		const saved = localStorage.getItem("stock_" + id);
		if (saved !== null) qty.innerText = saved;
		updateLowStock(item, parseInt(qty.innerText, 10) || 0);
	});
}

function getExtras(type) {
	try { return JSON.parse(localStorage.getItem(type + "_extras")) || []; }
	catch (_) { return []; }
}

function addExtra(type) {
	const description = prompt("Enter item description:");
	if (!description || !description.trim()) return;
	let quantity = parseInt(prompt("Enter quantity:", "1"), 10);
	if (isNaN(quantity) || quantity < 0) quantity = 0;
	getExtras(type).push({ id: type + "_" + Date.now(), description: description.trim(), quantity });
	localStorage.setItem(type + "_extras", JSON.stringify(getExtras(type)));
	displayExtras(type);
}

function displayExtras(type) {
	const area = document.getElementById(type + "-extras");
	if (!area) return;
	area.innerHTML = "";
	getExtras(type).forEach(extra => {
		const item = document.createElement("div"); item.className = "stock-item";
		if (extra.photo) {
			const photo = document.createElement("img");
			Object.assign(photo, { src: extra.photo, alt: extra.description });
			photo.style.cssText = "width:80px;height:80px;object-fit:cover;border-radius:8px;margin-right:10px;cursor:pointer";
			 const viewers = {
    hinges: "showHingePhoto",
    handles: "showHandlePhoto",
   "window-locks": "showWindowLockPhoto",
"euro-cylinders": "showEuroCylinderPhoto",
"door-handles": "showDoorHandlePhoto"
};
			photo.onclick = () => { if (viewers[type] && typeof window[viewers[type]] === "function") window[viewers[type]](extra.photo); };
			item.appendChild(photo);
		}
		const name = document.createElement("span"); name.innerText = extra.description; item.appendChild(name);
		const minus = document.createElement("button"); minus.innerText = "-"; minus.onclick = () => changeExtraQty(type, extra.id, -1); item.appendChild(minus);
		const qty = document.createElement("span"); qty.className = "qty"; qty.id = extra.id; qty.innerText = extra.quantity; item.appendChild(qty);
		const plus = document.createElement("button"); plus.innerText = "+"; plus.onclick = () => changeExtraQty(type, extra.id, 1); item.appendChild(plus);
		const del = document.createElement("button"); del.className = "delete-extra"; del.innerText = "×"; del.onclick = () => deleteExtra(type, extra.id); item.appendChild(del);
		area.appendChild(item); updateLowStock(item, extra.quantity);
	});
}

function changeExtraQty(type, id, amount) {
	const extras = getExtras(type), extra = extras.find(x => x.id === id);
	if (!extra) return;
	extra.quantity = Math.max(0, extra.quantity + amount);
	localStorage.setItem(type + "_extras", JSON.stringify(extras)); displayExtras(type);
}

function deleteExtra(type, id) {
	if (!confirm("Remove this extra item?")) return;
	localStorage.setItem(type + "_extras", JSON.stringify(getExtras(type).filter(x => x.id !== id)));
	displayExtras(type);
}

function compressHingePhoto(dataUrl, callback) {
	const image = new Image();
	image.onload = () => {
		const max = 1000, scale = Math.min(1, max / Math.max(image.width, image.height));
		const canvas = document.createElement("canvas"); canvas.width = image.width * scale; canvas.height = image.height * scale;
		canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height); callback(canvas.toDataURL("image/jpeg", .7));
	};
	image.onerror = () => callback(""); image.src = dataUrl;
}

function saveHingeWithPhoto(description, quantity, photo) {
	const save = image => saveHingeItem("hinges_" + Date.now(), description, quantity, image);
	photo ? compressHingePhoto(photo, save) : save("");
}

function saveHingeItem(id, description, quantity, photo) {
	const extras = getExtras("hinges"); extras.push({ id, description: description.trim(), quantity, photo });
	try { localStorage.setItem("hinges_extras", JSON.stringify(extras)); }
	catch (_) { alert("The photo is too large to save. Please try another photo."); return; }
	displayExtras("hinges");
}

document.addEventListener("DOMContentLoaded", () => {
	loadStock();
	document.querySelectorAll("[id$='-extras']").forEach(area => displayExtras(area.id.replace("-extras", "")));
});
