# specify the node base image with your desired version node:<version>
FROM node:14

# Create app directory
WORKDIR /cap-bestpractices

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Bundle app source
COPY . .
RUN npm run install:all
RUN npm run build:apps



# your application's default port
EXPOSE 4004
EXPOSE 5000

CMD ["npm", "run", "start:container"]
