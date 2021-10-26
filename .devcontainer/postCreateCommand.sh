#!/usr/bin/env bash

set -ex

npm i
pip install pre-commit
pre-commit install
pre-commit
