
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

// clones a template element, populates fields
// with data from a data object, (using handlebars notation)
// ie. {{...}} and returns the new node
function resolve_template(template, data){
	// if template is a query string instead of an Element,
	// convert it to an element by querying the DOM for that
	// string
	if (typeof template === 'string'){
		template = document.querySelector(template);
	}

	// look for all strings enclosed by {{ }} 
	const regex = /{{(.*?)}}/gm;

	const template_string = template.innerHTML;
	const matches = [...template_string.matchAll(regex)];
	
	return matches.reduce((output, [string, name]) => output.replace(string, data[name]), template_string);
}
