// import "@babel/polyfill"
import "./index.css"
import "./index.scss"
import "./index.less"
import counter from "./counter"
import number from "./number"
// import pic from "./images/golf.webp"
import pic from "./images/big.jpg"

console.log("hello, webpack4.x")

// 图片测试
const img = new Image()
img.src = pic
document.getElementsByClassName("img")[0].append(img)

// css HMR
var btn = document.createElement("button")
btn.innerHTML = "新增"
document.body.appendChild(btn)
btn.onclick = function () {
  var div = document.createElement("div")
  div.innerHTML = "item"
  document.body.appendChild(div)
}

counter()
number()

if (module.hot) {
  module.hot.accept("./number.js", function () {
    document.body.removeChild(document.getElementById("number"))
    number()
  })
}

const arr = [new Promise(() => {}), new Promise(() => {})]
arr.map((item) => {
  console.log(item)
})

// 配置react开发

// import React, { Component } from "react"
// import ReactDom from "react-dom"
// class App extends Component {
//   render() {
//     return <div>hello world</div>
//   }
// }
// ReactDom.render(<App />, document.getElementById("app"))
