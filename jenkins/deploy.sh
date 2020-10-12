#!/bin/bash

# Use a Docker container to build and deploy a new SDK build to the S3 bucket
# used for distribution (publish to npm happens separately).
#
# Required environment variables:
#   BUCKET - The S3 bucket to push the built SDK file.
#   VERSION - The new SDK version being published.
#   AWS_ACCESS_KEY_ID - AWS Access Key ID with permission to put to the bucket.
#   AWS_SECRET_ACCESS_KEY - AWS Secret Key ID corresponding to the AWS_ACCESS_KEY_ID.
#   NPM_TOKEN - NPM token for evt-master to pull private npm dependencies.

docker build \
  --build-arg NPM_TOKEN=$NPM_TOKEN \
  -t digital-link-js-deploy \
  .

docker run \
  -e "BUCKET=$BUCKET" \
  -e "VERSION=$VERSION" \
  -e "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" \
  -e "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" \
  digital-link-js-deploy
