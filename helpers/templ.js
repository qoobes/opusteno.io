const title = "opusteno.io"

const inputValue = `
<form method="post">
  <br>
 <div class="col-12">
  <input id="email" name="email" type="email" required placeholder="E-Mail">
 </div>
   <br>
 <br>
   <button formaction="auth" class="basicButton">POSALJI MAIL</button>
</form>
`

const emailInput = email => {
  return `
<form method="post">
  <br>
 <div class="col-12">
  <input class="disabled" id="email" name="email" type="email" value="${email}">
 </div>
   <br>
 <br>
   <button formaction="auth" class="basicButton">NASTAVI DALJE</button>
</form>
`
}

const constructBody = body => {
  return `
    <h3>Type: ${body.type}</h3>
    <h3>Ugency: ${body.urgency}</h3>
    <br>
    <h2>${body.subject}</h2>
    <br>
    <p>${body.body}</p>
  `
}

const head = `
    <head>
        <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="author" content="qoobes">
      <meta name="description" content="A website to improve communication between students and schools">
      <meta property="og:title" content="Opusteno - talking solves problems">
      <meta name="theme-color" content="#6dc75a">
      <meta name="twitter:description" content="Leading student-school communication forward">
      <meta name="twitter:card" content="summary_medium_image">
      <meta name="twitter:image" content="/img/handshake.png">
      <meta name="twitter:author" content="qoobes#0904">

      <title> ${title} </title>
      <link rel="icon" href="img/handshake.png">
      <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css">
      <link href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" rel="stylesheet" type="text/css">
      <link rel="stylesheet" href="css/base.css">
      <link rel="stylesheet" href="css/addition.min.css">
      </head>
`

const navbar = `
    <nav class="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top" id="mainNav">
        <div class="container">
        <a class="navbar-brand js-scroll-trigger" href="/">${title}</a>
        <button class="navbar-toggler navbar-toggler-right text-uppercase font-weight-bold bg-secondary text-white rounded"
          type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive"
          aria-expanded="false" aria-label="Toggle navigation">
           <img src="img/bar-light.png" alt="" width="20px">
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item mx-0 mx-lg-1">
              <a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" href="/">Pocetna</a>
            </li>
            <li class="nav-item mx-0 mx-lg-1">
              <a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" href="about">O Projektu</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
const footer = `
    <div class="container">
     <small>Copyright &copy; Second gimnasium of Sarajevo • ibmyp</small>
    </div>
  `
module.exports = {
  title,
  inputValue,
  head,
  navbar,
  footer,
  emailInput,
  constructBody
  // The entire head section of the site
}
