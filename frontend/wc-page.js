let MAP = {};

//UI functions bound to specific user actions
const UI = {};

// Add information about a watercloset to the map as a popup
function add_wc_popup(map, wc) {
	L.marker([wc.latitude, wc.longitude]).bindPopup(`<h2>${wc.name}</h2>\n${wc.review[0]}`).addTo(map)
}


function populate(info) {
	document.querySelector("#title").innerHTML = info.name;

	const reviews = info.reviews.map(review => `<p class="wc-review">${review}</p>`).join('\n')
	document.querySelector(".reviews").innerHTML = reviews;
}

function add_handlers() {
	document.querySelector(".btn-new-review").onclick = function(){
		document.querySelector(".add-review").setAttribute("data-state", "form")
	};

	document.querySelector("input.enter").onclick = async function(){
		const review = document.querySelector("form.new-review textarea").value;
		const name = decodeURI(document.querySelector("body").getAttribute("data-name"))

		console.log({name, review})
		await API.add_review({ name, review })

		document.querySelector(".add-review").setAttribute("data-state", "default")
		location.reload(true)
	};
}

window.onload = async function(){

	// get the name of the Water Closet we want to render
	const name = decodeURI(document.querySelector("body").getAttribute("data-name"));
	const info = await API.get(name);

	const view = [[info.latitude, info.longitude], 17];

	// Create the map and set the default view
	// const mymap = L.map('mapid').setView(...views.nyc);
	MAP = L.map('mapid').setView(...view);

	// Download map data from OpenStreetMap and add it to the map
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox/streets-v11',
	    tileSize: 512,
	    zoomOffset: -1,
	    accessToken: 'pk.eyJ1IjoiY29ubm9yd2luaWFyY3p5ayIsImEiOiJja3Y1Y2Q4eGwxOHN1Mndubmlza2pzdDh1In0.xwVVCo4ihm82PjVnnEMtRA'
	}).addTo(MAP);

	// add_wc_popup(MAP, info);

	// // Download Water Closet data from the API and add them to the map as popups
	const water_closets = await API.get_water_closets()
	water_closets.forEach(wc => add_wc_popup(MAP, wc))


	populate(info);
	add_handlers();
}

