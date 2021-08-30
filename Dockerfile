FROM node:12-alpine

ARG NPM_TOKEN

WORKDIR /srv
COPY . /srv

# Install dependencues
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
RUN apk add --no-cache python3
RUN pip3 install awscli --upgrade --user
RUN npm ci

# Build
RUN npm run build

# Deploy
CMD ["sh", "-c", "~/.local/bin/aws s3 cp /srv/dist/digital-link.js.browser.js s3://$BUCKET/js/digital-link.js/$VERSION/digital-link.js-$VERSION.js --acl public-read"]
