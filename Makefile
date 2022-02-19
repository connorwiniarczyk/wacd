

load: data/
	cat data/reviews.csv | bin/data.py load reviews 
	cat data/locations.csv | bin/data.py load locations

save: data/
	bin/data.py save reviews > data/reviews.csv
	bin/data.py save locations > data/locations.csv

data:/
	mkdir -p data
