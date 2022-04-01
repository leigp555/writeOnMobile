<template>
  <canvas ref="inputCanvas" id="inputCanvas"></canvas>
  <canvas ref="outerCanvas" id="outerCanvas"></canvas>
  <button @click="printImg">打印</button>
  <img src="" alt="" ref="img">
  <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleFile"/>

</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
// import transApi from "./util/transImg";
const paint=(canvas:HTMLElement,)=>{
  //@ts-ignore
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.strokeStyle = "none";
  ctx.lineWidth=4
  ctx.lineCap="round"
  function drawline(x1:number,y1:number,x2:number,y2:number){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();}
  let painting = false;
  let last:number[]
  const isTouchDevice = "ontouchstart" in document.documentElement;
  if (isTouchDevice) {
    canvas.ontouchstart=(c)=>{
      let x = c.touches[0].clientX;
      let y = c.touches[0].clientY;
      last=[x,y]
    }
    canvas.ontouchmove = (c) => {
      let x = c.touches[0].clientX;
      let y = c.touches[0].clientY;
      // console.log(last)
      drawline(last[0],last[1],x,y)
      last=[x,y]
    };
  } else {
    canvas.onmousedown = (e) => {
      painting = true;
      last=[e.clientX,e.clientY]
    };


  }
  canvas.onmousemove = (e) => {
    if (painting) {
      drawline(last[0],last[1],e.clientX,e.clientY)
      last=[e.clientX,e.clientY]
    }
  };
  canvas.onmouseup =()=>{
    painting=false
  }
}

const transApi=()=>{
  return {
    //将input数据读取成img标签
    fileToImg: (file: Blob) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        const URL = window.webkitURL || window.URL;
        if (URL) {
          const url = URL.createObjectURL(file);
          image.onload = function () {
            resolve(image);
            URL.revokeObjectURL(url);
          }
          image.onerror = function (err) {
            reject(err);
            URL.revokeObjectURL(url);
          }
          image.src = url;
        } else {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onerror = function (err) {
            reject(err)
          }
          reader.onload = function () {
            image.src = reader.result as string
            image.onload = function () {
              resolve(image);
            }
          }
        }
      })
    },
    //将url转成图片，返回值为img标签
    urlToImg: (url: string) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = () => {
          resolve(image)
        }
        image.onerror = (err) => {
          reject(err)
        }
      })
    },
    //将input读取的文件转变成base64字符串
    fileToUrl: (file: Blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onerror = function (err) {
          reject(err)
        }
        reader.onload = function () {
          resolve(reader.result as string)
        }
      })
    },
    //将img标签用canvas来绘制返回一个canvas标签
    imageToCanvas: (img:CanvasImageSource, width=100, height=100) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d');
      canvas.width = 50;
      canvas.height = 50;
      //@ts-ignore
      ctx!.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, width, height);
      return canvas;
    },
    //canvas内容转化成url
    canvasToUrl:(canvas:HTMLElement, quality:number, type:string) =>{
      //@ts-ignore
      return canvas.toDataURL(type || 'image', quality || 1.0);
    },
    //创建一个新的canvas标签
  }
}




const transImg=transApi()
const img = ref<HTMLElement>()
const inputCanvas = ref<HTMLCanvasElement>()
const outerCanvas = ref<HTMLCanvasElement>()

onMounted(() => {
  inputCanvas.value!.width = 100
  inputCanvas.value!.height = 100
  paint(inputCanvas.value!)
  outerCanvas.value!.width = document.body.clientWidth;
  outerCanvas.value!.height = 300;
})


const x = ref<number>(-30)
const y = ref<number>(0)

const printImg = async () => {
  x.value += 30
  const ctx = inputCanvas.value!.getContext("2d");
  const url=transImg.canvasToUrl(inputCanvas.value! ,1, "image") as string
  const img = await transImg.urlToImg(url) as HTMLImageElement
  ctx!.clearRect(0, 0, 100, 100);                         //记得设置
  const ctxOut = outerCanvas.value!.getContext('2d');
  ctxOut!.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x.value, 0, 20, 20);
}

const handleFile = async (e: Event) => {
  const el = e.target as HTMLInputElement
  const file = el.files!.length ? el.files![0] : null  as Blob|null
  let imgRead: HTMLElement
  try {
    imgRead = await transImg.fileToImg(file!) as HTMLElement
    document.body.append(imgRead)
  } catch (err) {
    console.log(err)
  }
  // await transImg.fileToUrl(file)
  // await transImg.urlToImg('')
  // transImg.imageToCanvas(await transImg.fileToImg(file))
}




</script>

<style lang="scss" scoped>
#inputCanvas {
  border: 1px solid red;
  display: block;
}

#outerCanvas {
  border: 2px solid red;
}
</style>
