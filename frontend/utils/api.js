const API = {};
API.water_closets = function() {
	return window.fetch("/api/water-closets")
		.then(res => res.json())
		.catch(console.log)
};

API.add = function({ name, review, wc_location }){
	return window.fetch('/api/add', {
		method: "post", 
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			name, review, latitude: wc_location.lat, longitude: wc_location.lng
		})
	})
};

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
};

API.find = function(latitude, longitude){
	return window.fetch(`/api/find`, {
		method: "post", 
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ latitude, longitude }),
	})
	.then(res => res.json())
	.catch(console.log)
};

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
};
