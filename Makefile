service-init:
	sudo cp deployment/redis /etc/rc.d
	sudo cp deployment/wacd /etc/rc.d

service-deinit: down
	sudo rm /etc/rc.d/wacd
	sudo rm /etc/rc.d/redis

up: service-init
	service wacd start
	service redis start

down:
	service wacd stop
	service redis stop


load: data/
	cat data/reviews.csv | bin/data.py load reviews 
	cat data/locations.csv | bin/data.py load locations

save: data/
	bin/data.py save reviews > data/reviews.csv
	bin/data.py save locations > data/locations.csv

data:/
	mkdir -p data
