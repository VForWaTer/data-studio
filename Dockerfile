FROM node:18.12.1-buster

# create the tool input structure
RUN mkdir /in
COPY ./in /in
RUN mkdir /out
RUN mkdir /src
COPY ./src /src

# install dependencies:  js2args
WORKDIR /src
RUN npm install js2args@v0.3.0
RUN npm install glob@8.0.3
RUN npm install shelljs@0.8.5
RUN npm install fs-extra@10.1.0

# install the dependencies of the data studio application
WORKDIR /src/data-studio
RUN npm install

# run command
WORKDIR /src
CMD ["node", "run.js"]