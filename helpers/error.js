const temps = require('./templ')

module.exports = (err, res) => {
  let code = err.code
  let mseg = err.mseg
  let head = err.head
  let erro = err.error

  if (code != 404) {
    console.error(`Error ${code}: ${mseg}`)
    let display = {
      headText: head || 'An error has occured',
      underText: err.code,
      error: erro === undefined ? true : false,
      detail: err.mseg
    }
    res.render('display', { temps, display })
    return
  } else {
    let display = {
      headText: "This page doesn't exist",
      underText: 404,
      error: true,
      detail: "The page you were looking for doesn't exist."
    }
    res.render('display', { temps, display })
    return
  }
}
