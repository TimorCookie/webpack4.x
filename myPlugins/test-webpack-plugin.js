class TestWebpackPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync("TestWebpackPlugin", (compilation, cb) => {
      console.log(this.options)
      compilation.assets["test.txt"] = {
        source: () => this.options.name,
        size: () => 20,
      }
      cb()
    })
  }
}
module.exports = TestWebpackPlugin