FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm ci 

RUN npm run compile

ENV NODE_ENV production
ENV DATABASE_URL "file:./dev.db"
ENV JWT_SECRET asdji7h723r83ghefjw3ty574s8j547nt36nmgfh5642cxnmgh567y42n5grhmf7qay6rexgfm7q34fxerga90zrhg8a8e5gha8e7uzghyr67fg8aE$WorfhW94w

RUN npx prisma generate
RUN npx prisma db push
RUN npx prisma db seed

EXPOSE 3000

CMD [ "npm", "run", "start" ]