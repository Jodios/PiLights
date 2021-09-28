# Step 1
FROM node:14 as build-step

RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn install
COPY . /app
RUN yarn build

# Stage 2
FROM nginx:stable
COPY --from=build-step /app/server.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /app/build /usr/share/nginx/html

