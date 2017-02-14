If you don't have time to set up your local db, you could use the staging db, which is a cloud db.

To do that, go to

> `/config/mongo-config.js`,

and uncomment the code below `//For Staging DB:`

Note: Please make sure that you should comment out the prior db setup if you want to change it.

## Basic Functionalities

This api has 4 functions. It can see all the registered users, login, register, and verify user.

(It's recommended to use Postman for testing the routes.)

To make them work, first you have to install >`nodemon` and do >`npm install`.

Then to run it, type in (in the root directory):

>`nodemon app.js`

Assuming you're using localhost, you could access the api via:

>`localhost:8180/api/v1/*`

where * = custom routes.

### Getting all users (GET: users):

Assuming you're using a Postman, type in:

> `localhost:8180/api/v1/users`

and set the route to >`GET`. What you'd expect to see is either:

>`[]` or >`[{random objects...}]`

### Register user (POST: users/register):

Type in `localhost:8180/api/v1/users/register` and set the route to `POST`.

Then in the body, set the radio button to `x-www-form-urlencoded` and fill in the blank fields using the ff. format:

email = `(Your email here)`

password = `(Your Password here)`


And after that, what you'd expect to see is:

> `
{
  "message": "User Registered!"
}
`

And to fully verify if your account has been registered, try to get all users, and you'd see your email in there.

### Logging in user (POST: users/login):

Type in

> `localhost:8180/api/v1/users/login`

and set the route to `POST`.

Then in the body, set the radio button to `x-www-form-urlencoded` and fill in the blank fields using the ff. format:
email = `Your email here`
password = `Your Password here`

And after that, what you'd expect to see is:
>`
{
  "status_code": 500,
  "message": "User Not Verified"
}
`

And that is because you haven't confirmed your email yet. And to do that:

### Verifying user: (POST: users/confirm_email):

Type in

>`localhost:8180/api/v1/users/confirm_email`

and set the route to >`POST`.

Then in the body, set the radio button to `x-www-form-urlencoded` and fill in the blank fields using the ff. format:
email = `Your email here`

And after that, what you'd expect to see is:
> `
{
  "message": "User is now verified!"
}
`

Congratulations! You are now verified! Now try logging in again, and you'd see:

> `
{
  "message": "User now Logged In!"
}
`

(More routes + functionalities to follow.)
