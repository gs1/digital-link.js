FROM node:8-alpine

WORKDIR /srv
COPY . /srv

# Install dependencues
RUN apk add --no-cache python3
RUN pip3 install awscli --upgrade --user
RUN npm i

# Build
RUN npm run build

# Deploy
CMD ["sh", "-c", "~/.local/bin/aws s3 cp /srv/dist/digital-link.js.browser.js s3://$BUCKET/js/digital-link.js/$VERSION/digital-link.js-$VERSION.js --acl public-read"]
