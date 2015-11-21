# PeppyPossums

In app.js file, please insert your own google maps API key on line 18

If you would like to use the Locu API, please insert your own Locu API key on line 26 of menu.js

URL for our firebase database
https://rooftopapp.firebaseio.com/ 


Fixes: 
At this point, the database adds duplicate users upon signup(), there are some helpful comments to debug

After a user logs in, there is a bug where the search feature does not put the correct points on the map. This 
error does not occur when a user is not logged in. 

Register.js could be refactored in the promises.
