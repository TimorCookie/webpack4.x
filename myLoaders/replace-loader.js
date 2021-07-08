module.exports = function (source) {
  const content = source.replace("hello", this.query.str)
  this.callback(null, content)
  return
}
