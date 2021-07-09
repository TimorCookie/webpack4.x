import "./index.less"
import pic from "./images/big.jpg"
console.log("hello, webpack4.x")
// 图片测试
const img = new Image()
img.src = pic
document.getElementsByClassName("img")[0].append(img)
