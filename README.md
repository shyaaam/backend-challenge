
# Backend coding challenge 
  
### Task 1

Question: You are given 4 tables in the tables folder (as CSV).
Write an SQL query to retrieve the following data in one result table:

YEAR - CW - USERS - VEHICLES - EVENTS - REVENUE (in Euro)

- CW = Week of the year
- Users = count of new **users**
- Vehicles = count new added **vehicles**
- Events = count of added **events**
- Revenue = calculated by sum of price column in **orders** table (it is in cents in the raw data)

Desired result example (random data):
| YEAR | CW | USERS | VEHICLES | EVENTS | REVENUE |
|------|----|-------|----------|--------|---------|
| 2019 | 34 | 5292  | 7392     | 12030  | 320.56  |

Note: The data sets can be found in the _tables_ folder of this repo.

####Answer: The solution is provided in the sql.txt file in this project

### Task 2

Question: This task is about APIs.
Write a service that offers an API endpoint but also retrieves data from an external source itself. For testing purposes we don't offer a real API endpoint for you but instead a JSON file which should be used as an online data source:

```
http://static.gapless.app/backend-coding-challenge/vins.json
```

Your service should offer an API endpoint which gets a VIN (vehicle identification number like _2C3LA53G68H110255_) as a parameter and returns the data you get from the JSON file. But only the data set that matches the sent VIN. If nothing was found your API should act and respond accordingly.

####Answer: The Api implemented is available in the src/routes.ts file

## What will we be looking at

- Attention to detail and scalability
- Code reusability, readability and maintainability
- API security, data validation etc.
- Finding the right point of abstraction in your helpers functions and APIs
- Tests, type checking, linting... are nice to have

## INSTALL DEPENDENCIES
 npm install
## RUN SERVER
npm run start
## RUN TESTS
npm run test


#####  Linter Used: Standard JS, Tests: mocha and chai
