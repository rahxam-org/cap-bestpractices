#!/usr/bin/env bash
# Stop script immediately in case of a failure and show the the result in realtime
set -ex

npm install -g @sap/cds-dk mbt yo standard sqlite3
npm i

# Istall and initialize pre commit
pip install pre-commit
pre-commit install
pre-commit

# Configure the GIT merge strategy
git config --global pull.rebase false
