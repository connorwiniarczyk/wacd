
let MAP = {};

//UI functions bound to specific user actions
const UI = {};

// this function executes when the "find" button is clicked
UI.find_button = async function() {
	//change the display state of the button deck
	document.querySelector(".button-deck").setAttribute("data-state", "find")	

	 // wait for the next time the user clicks on the map, when they do, store the
	 // event in nextclick
	const nextclick = await new Promise((resolve, reject) => MAP.once('click', resolve))
	const {lat, lng} = nextclick.latlng;

	display_nearby(lat, lng);

	// set back
	document.querySelector(".button-deck").setAttribute("data-state", "default");
}

// this function executes when the "add" button is clicked
UI.add_button = async function() {

	//change the display state of the button deck
	document.querySelector(".button-deck").setAttribute("data-state", "add");

	nextclick = await new Promise((resolve, reject) => MAP.once('click', resolve));
	popup.new_wc(nextclick.latlng).openOn(MAP);
	await new Promise((resolve, reject) => document.querySelector(".new-wc input.enter").onclick = resolve)

	// extranew-wc ct data from form
	name = document.querySelector(".new-wc input.name").value
	review = document.querySelector(".new-wc textarea.review").value
	const wc_location = nextclick.latlng

	document.querySelector(".button-deck").setAttribute("data-state", "default")	

	if (name == "") { console.log("name cannot be empty"); return }

	await API.add_wc({name, review, wc_location})

	window.location = `/wc/${encodeURIComponent(name)}`;
}


async function display_nearby(latitude, longitude) {
	const nearby = await API.find(latitude, longitude);
	const list = nearby
		.filter((_, i) => i < 8)
		.map(x => resolve_template("#template--nearby-restrooms-element", {
			rating: star_string(4),
			distance: x.distance.toFixed(2),
			name: x.name,
		}))
		.join("")

	L.popup()
		.setLatLng({lat: latitude, lng: longitude})
		.setContent(resolve_template("#template--nearby-restrooms", {table: `<table>${list}</table>`}))
		.openOn(MAP);

	document.querySelector(".input--urgency").oninput = i => console.log(i.target.value)

}


function star_string(amount) {
	const empty_star = "\u2606";
	const full_star = "\u2605";
	// const half_star = "\u2be8"; // supposed to be a half star but doesn't appear to be supported yet

	return Array(5)
		.fill("")
		.map((_, i) => i + 1 > amount ? empty_star : full_star)
		.join("")
}


// Add information about a watercloset to the map as a popup
function add_wc_popup(map, wc) {
	L.marker([wc.latitude, wc.longitude])
		.bindPopup(resolve_template("#template--wc-popup", { rating: star_string(3), ...wc }))
		.addTo(map)
}

function get_position() {
	return new Promise(function(resolve, reject){
		if(!window.navigator.geolocation) reject("no access to location data")
		window.navigator.geolocation.getCurrentPosition(success => resolve(success.coords), reject)
	})
}

function get_default_view() {
	// some generic views of cities to use as defaults
	// the first two numbers are the latitude and longitude of the view,
	// the third number is a zoom level 
	const views = {
		nyc: [[40.7236, -73.98982], 13],  // Manhattan
		boston: [[42.3611, -71.057], 13], // Boston
	}

	// TODO: for testing delete this line in production
	return views.nyc

	return get_position()
		.then(position => [[position.latitude, position.longitude], 13])
		.catch(error => {console.log(`could not get position: ${error}`); return views.nyc})
}

window.onload = async function(){

	const default_view = await get_default_view();

	// Create the map and set the default view
	// const mymap = L.map('mapid').setView(...views.nyc);
	MAP = L.map('mapid').setView(...default_view);

	// Download map data from OpenStreetMap and add it to the map
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox/streets-v11',
	    tileSize: 512,
	    zoomOffset: -1,
	    accessToken: 'pk.eyJ1IjoiY29ubm9yd2luaWFyY3p5ayIsImEiOiJja3Y1Y2Q4eGwxOHN1Mndubmlza2pzdDh1In0.xwVVCo4ihm82PjVnnEMtRA'
	}).addTo(MAP);

	// Download Water Closet data from the API and add them to the map as popups
	const water_closets = await API.water_closets()
	water_closets.forEach(wc => add_wc_popup(MAP, wc))

	// register click events for the two buttons
	document.getElementById("add").onclick = () => UI.add_button();
	document.getElementById("find").onclick = () => UI.find_button();

	console.log([1,2,3,4,5].map(star_string))

	const [position, zoom] = default_view;
	display_nearby(position[0], position[1]);
}

