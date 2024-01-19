# Northcoders News API

link to hosted version: <nc-news-by-amir.onrender.com>

the project: bulding a responsive api with the purpose of accessing app data. this is mainly a back-end project which can be worked on later to implement front-end features. a separate test database has been created for the testing process with data from the test-data folder. the endpoint functions have been built using TDD which tests the models and controllers and ultimately the app file. an instance of production database has been created on ElephantSQL and the api has been hosted on render.

cloning process: the repository can be cloned by runing the command <git clone https://github.com/Amir-Rsh/be-nc-news.git>

installed packages: commands for the npm packages that need to be installed are as follows
<npm install pg>
<npm install -D pg-format>
<npm install jest supertest>
<npm install --save-dev jest-sorted>

setting up databases can be done by <npm run setup-dbs>

dev database can be seeded by <npm run seed>

production database can be seeded by <npm run seed-prod>

the app test can run by using <npm test app>

the utils test can run by using <npm test utils>

for security purposes the PGDATABASE links have been created in multiple .env files that are ignored by git. in the root directory of the repository create developer environment (.env.development) containing <PGDATABASE=nc_news> and test environment (.env.test) containing <PGDATABASE=nc_news_test> with the appropriate links to databases.

the node version required for the project: "^10.13.0 || ^12.13.0 || ^14.15.0 || >=15.0.0"

pg version required: "^8.7.3"
