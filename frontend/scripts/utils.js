const API = {}
API.get_water_closets = function() {
	return window.fetch("/api/water-closets")
		.then(res => res.json())
		.catch(console.log)
}

API.add_wc = function({ name, review, location }){
	return window.fetch('/api/add', {
		method: "post", 
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			name, review, latitude: location.lat, longitude: location.lng
		})
	})
}

API.find = function({lat, lng}){
	return window.fetch(`/api/find?longitude=${lng}&latitude=${lat}`)
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
	const content = `<div class="new-wc"> <input class="name", required, type="text" style="width: 300px;" placeholder="Name"> <textarea class="review" rows="5", style="width: 100%;" placeholder="Review"></textarea> <button class="test">Submit</button></div>`
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
