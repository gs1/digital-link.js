#!/bin/bash

# Test the SDK using the unit tests in Docker.
#   NPM_TOKEN - NPM token for evt-master to pull private npm dependencies.

docker build \
  --build-arg NPM_TOKEN=$NPM_TOKEN \
  -t digital-link-js-test \
  -f Dockerfile.test \
  .

docker run digital-link-js-test
