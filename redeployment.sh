#! /bin/bash

echo "version: $2";
echo "environment: $3";
echo "port: $1";


podman pull ghcr.io/rahxam-org/cap-bestpractices:$2
podman stop KISS_$3
podman system prune -f
podman run -d --restart unless-stopped -p 4004:${1}4004 -p 5000:${1}5000 --name=KISS_$3 ghcr.io/rahxam-org/cap-bestpractices:$2
