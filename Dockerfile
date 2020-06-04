# rust nightly
FROM rust:1.43.1

# get project source
WORKDIR /usr/src/FRCScouter
COPY . .

RUN cargo install --path .

# 80 for http, 81 for ws
EXPOSE 80
EXPOSE 81

# run
CMD ["/usr/local/cargo/bin/frcscouter"]
