FROM node:18.12.1-buster

# create the tool input structure
RUN mkdir /in
COPY ./in /in
RUN mkdir /out
RUN mkdir /src
COPY ./src /src

WORKDIR /src

# install dependencies:  js2args
RUN npm install js2args@v0.3.0

# run command
CMD ["node", "run.js"]