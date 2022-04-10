const API = {}
API.get_water_closets = function() {
	return window.fetch("/api/water-closets")
		.then(res => res.json())
		.catch(console.log)
}

API.add_wc = function({ name, review, wc_location }){
	return window.fetch('/api/add', {
		method: "post", 
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			name, review, latitude: wc_location.lat, longitude: wc_location.lng
		})
	})
}

API.add_review = function({name, review}){
	return window.fetch('/api/add-review', {
		method: "post", 
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			name, review,
		})
	})
}

API.find = function({latitude, longitude}){
	return window.fetch(`/api/find`, {
		method: "post", 
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ latitude, longitude }),
	})
	.then(res => res.json())
	.catch(console.log)
}

API.get = function(name){
	return window.fetch(`/api/get`, {
		method: "post", 
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ name }),
	})
	.then(res => res.json())
	.catch(console.log)
}

const popup = {}

popup.nearby = function(location, list) {
	const content_list = list.map(({name, distance}) => `<li onclick="goto_wc(\'${name}\')"><strong>${name}</strong>  ${distance} km away</li>`)
	const content = `<h2>Nearby Restrooms</h2><ul class="nearby-wcs">${content_list.join("")}</ul>`
	return L.popup()
		.setLatLng(location)
		.setContent(content)
} 

popup.new_wc = function(location) {
	const content = `<form class="new-wc"> <input class="name", required, type="text" style="width: 300px;" placeholder="Name"> <textarea class="review" rows="5", style="width: 100%;" placeholder="Review"></textarea> <input class="enter" type="button" value="Submit"></form>`
	return L.popup()
		.setContent(content)
		.setLatLng(nextclick.latlng)
}

popup.marker = function(location, wc){
	return L.marker([location.lat, location.lng]).bindPopup(`<h2>${wc.name}</h2>\n${wc.review}`).addTo(map)
}

popup.default = function(location){
	const {lat, lng} = location;
	console.log(lat, lng)
	const content = `<button onclick="display_nearby(${lat}, ${lng})">FIND</button>`
	return L.popup()
		.setLatLng(location)
		.setContent(content)
}


function get_template(id) {
	const content = document.getElementById(id).innerHTML;

	return {
		resolve: function(data) {
			const regex = /{{(\w+?)}}/g;
			let new_content = content.replace(regex, (match, p1) => data[p1] || "");
			console.log(new_content)
		}
	};
}
