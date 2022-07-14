FROM node:12-alpine

ARG NPM_TOKEN

WORKDIR /srv

# Linux dependencies layer
RUN apk add --no-cache python3 py3-pip
RUN pip3 install awscli --upgrade --user

# npm dependencies layer
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
COPY package* /srv/
RUN npm ci

# Build library layer
COPY . /srv
RUN npm run build

# Deploy
CMD ["sh", "-c", "~/.local/bin/aws s3 cp /srv/dist/digital-link.js.browser.js s3://$BUCKET/js/digital-link.js/$VERSION/digital-link.js-$VERSION.js --acl public-read"]
