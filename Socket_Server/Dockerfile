FROM node:14

#create directory
RUN mkdir -p /usr
WORKDIR /usr/

COPY package.json ./
RUN yarn install
COPY . ./
RUN ls src

EXPOSE 8080
CMD ["yarn", "start"] 