// const map_click_event = new Event("map_click");
// window.addEventListener("map_click", function(e){ console.log(e) });
//

function split_list(list, keys){
	 chunksize = keys.length
	 let output = []

	 n = 0
	 while( n + chunksize <= list.length ) {
		 nextentry = {}
		 list.slice(n, n + chunksize).forEach((value, i) => nextentry[keys[i]] = value)
		 output.push(nextentry)
		 n += chunksize
	 }

	return output
}

async function goto_wc(name){
	console.log(name)
}

async function find_wc(map){
	//change the display state of the button deck
	document.querySelector(".button-deck").setAttribute("data-state", "find")	

	 //wait for the next time the user clicks on the map, when they do, store the
	 // event in nextclick
	nextclick = await new Promise((resolve, reject) => map.once('click', resolve))
	 
	 console.log(nextclick)
	lat = nextclick.latlng.lat
	lng = nextclick.latlng.lng

	let result = await window.fetch(`/api/find?long=${lng}&lat=${lat}`)
		.then(res => res.text())
		.then(text => split_list(text.split("\n"), ["name", "distance"]))

	console.log(result)

	// display the result in a popup
	list = result.map(({name, distance}) => `<li onclick="goto_wc(\'${name}\')"><strong>${name}</strong>  ${distance} km away</li>`)
	console.log(list)
		list = `<h2>Nearby Restrooms</h2><ul class="nearby-wcs">${list.join("")}</ul>`
	popup = L.popup()
		.setLatLng(nextclick.latlng)
		.setContent(list)
		.openOn(map)

	// set back
	document.querySelector(".button-deck").setAttribute("data-state", "default")	
}


// Prompts the user for the information needed to add a WAC to the Directory
async function get_new_wc_info(map){

	//change the display state of the button deck
	document.querySelector(".button-deck").setAttribute("data-state", "find")	

	nextclick = await new Promise((resolve, reject) => map.once('click', resolve))

	console.log(nextclick)
	popup = L.popup()
		.setLatLng(nextclick.latlng)
		.setContent(`<div class="new-wc"> <input class="name", required, type="text" style="width: 300px;" placeholder="Name"> <textarea class="review" rows="5", style="width: 100%;" placeholder="Review"></textarea> <button class="test">Submit</button></div>`)
		.openOn(map)

	await new Promise((resolve, reject) => document.querySelector(".new-wc button.test").onclick = resolve)

	name = document.querySelector(".new-wc input.name").value
	review = document.querySelector(".new-wc textarea.review").value
	latlng = nextclick.latlng

	// set back
	document.querySelector(".button-deck").setAttribute("data-state", "default")	

	if (name == "") return ["Name cannot be empty", null]

	return [null, {name, review, latlng}, popup]


}

async function submit_wc({ name, review, latlng }) {
	query = `/api/add?name=${name}&long=${latlng.lng}&lat=${latlng.lat}`
	query = review == "" ? query : query + `&review=${review}`

	return window.fetch(query).then(res => res.text()).then(console.log)
}

async function add_wc(map){
	[err, info, popup] = await get_new_wc_info(map)
	// if (err) console.log(err); return;
	await submit_wc(info)

}

window.onload = async function(){
		function onMapClick(e) {
			popup
				.setLatLng(e.latlng)
				.setContent("You clicked the map at <input type='text' style='width: 100%'/>" + e.latlng.toString())
				.openOn(mymap);
		}

		const mymap = L.map('mapid').setView([42.3611, -71.057], 13);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox/streets-v11',
	    tileSize: 512,
	    zoomOffset: -1,
	    accessToken: 'pk.eyJ1IjoiY29ubm9yd2luaWFyY3p5ayIsImEiOiJja3Y1Y2Q4eGwxOHN1Mndubmlza2pzdDh1In0.xwVVCo4ihm82PjVnnEMtRA'
	}).addTo(mymap);

	var marker = L.marker([51.5, -0.09]).addTo(mymap);

	locations = await load_locations()
	 // console.log("test")
	// console.log(locations)

	// locations.forEach(console.table)
	locations.forEach(({name, longitude, latitude, review}) => L.marker([latitude, longitude]).bindPopup(`<h2>${name}</h2>\n${review}`).addTo(mymap))
	// var popup = L.popup();

	document.getElementById("add").onclick = () => add_wc(mymap)
	document.getElementById("find").onclick = () => find_wc(mymap)
}


console.log(split_list(["test", "one", "two", "three"], ["first", "second"]))

async function load_locations(){
	 locations = await window.fetch("/api/getall").then(res => res.text()).catch(console.log)	

	 // console.log(locations)
	 locations = split_list(locations.split("\n"), ["name", "longitude", "latitude"])
	 console.log(locations)

	 output_with_reviews = []

	 for (info of locations) {
		  console.log(info)
		  await window.fetch(`/api/get?name=${info.name}`)
				.then(res => res.text())
				.then(review => output_with_reviews.push({review, ...info}))
	 }

	 return output_with_reviews
}
