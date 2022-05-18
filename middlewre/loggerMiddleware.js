const logger = (req, res, next) => {
  // todas las peticiones van a pasar por aca por que no le agregue path
  console.log(req.method)
  console.log(req.path)
  console.log(req.body)
  console.log('--------')
  next()
}

module.exports = logger // common js
