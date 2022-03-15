# WaCD

### The Water Closet Directory

WaCD is a barely-ironic-anymore crowdsourced database of public restrooms

[http://watercloset.directory](http://watercloset.directory)

![screenshot](https://raw.githubusercontent.com/connorwiniarczyk/wacd/master/screenshot.png)

## Setting Up a Development Environment

```sh
# install rust from this url: https://rustup.rs/
# (needed to compile the webserver)
rustup default nightly
rustup update

# install the webserver serv
cargo install --git https://connorwiniarczyk/serv.git

# install redis (the database)
# this works on debian based linux distributions, if that doesn't apply, find
# some other way to install it: https://redis.io/download
sudo apt-get install redis

# run redis (do this in the background or in a different terminal window)
redis-server

# clone this repository
# use the --recursive flag to also clone the example data submodule
git clone --recursive https://github.com/connorwiniarczyk/wacd.git
cd wacd

# Write the example data into the database
make load

# Start the webserver
serv .

```

To test this installation, open a web browser and navigate to
[http://localhost:4000](http://localhost:4000)

