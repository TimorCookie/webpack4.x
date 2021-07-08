module.exports = function (source) {
  const callback = this.async()

  setTimeout(() => {
    const content = source.replace("hi", "halo")
    callback(null, content)
  }, 2000)
}
