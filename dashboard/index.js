/**
 * Automatically puts user in, still authenticates the teacherid
 *
 * @param id
*/


function enter(id, res) {
  // Check if id is in authed teachers list

  // if so, enter the user
  // otherwise send an error with next middleware
}

/**
 * Displays normal auth screen
 *
 * @param req - the request object, shows us the user session as well as other useful information
 * @param res - used to send a response
*/
function init(req, res) {
  res.render('./index')
}

function auth(user, pass, session) {

}
