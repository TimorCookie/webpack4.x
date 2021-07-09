const fs = require("fs")
const path = require("path")
class AresWebpackPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    const { version, group, name } = this.options
    compiler.hooks.afterEmit.tapAsync(
      "ares-webpack-plugin",
      (compilation, cb) => {
        fs.mkdirSync(`${compiler.outputPath}/module`)
        const content = {
          group,
          name,
          version,
        }
        fs.writeFileSync(
          `${compiler.outputPath}/module/ares.json`,
          JSON.stringify(content),
          (err) => {
            console.log(err)
          }
        )
        cb()
      }
    )
  }
}

module.exports = AresWebpackPlugin
