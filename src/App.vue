<template>
  <button @click="printImg">打印</button>
  <canvas ref="inputCanvas" id="inputCanvas"></canvas>
  <div class="xx">
    <canvas ref="outerCanvas" id="outerCanvas"></canvas>
  </div>

  <img src="" alt="" ref="img">
  <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleFile"/>
  <label name="颜色">
    <input type="color" v-model="fillColor"/>
    <button type="submit" @click="colorSubmit">颜色</button>
  </label>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {transImg} from "./util/transApi";
import {paint } from "./util/inputCavans"
const img = ref<HTMLElement>()
const inputCanvas = ref<HTMLCanvasElement>()
const outerCanvas = ref<HTMLCanvasElement>()
const fillColor=ref<string>("#FFFFFF")
const colorSubmit=()=>{
  paint(inputCanvas.value!,fillColor.value)
}



onMounted(() => {
  inputCanvas.value!.width = 200
  inputCanvas.value!.height = 200
  paint(inputCanvas.value!,fillColor.value)
  outerCanvas.value!.width = 1500;
  outerCanvas.value!.height =1500;
  document.body.addEventListener('scroll', function (e) {
    e.preventDefault();
  })

 document.addEventListener("DOMMouseScroll",(e)=>{
   e.preventDefault()
   e.stopPropagation()
 })
  document.addEventListener("mousewheel",(e)=>{
    e.preventDefault()
    e.stopPropagation()
  })
  document.addEventListener("scroll",(e)=>{
    e.preventDefault()
    e.stopPropagation()
  })
  document.body.addEventListener('touchmove', function(e){
    e.preventDefault();
  }, { passive: false })
})


const x = ref<number>(-80)
const y = ref<number>(0)

const printImg = async () => {
  x.value += 80
  if(x.value>1500){
    x.value=0
    y.value+=80
  }
  const ctx = inputCanvas.value!.getContext("2d");
  const url=transImg.canvasToUrl(inputCanvas.value! ,0.99, "image") as string
  const img = await transImg.urlToImg(url) as HTMLImageElement
  ctx!.clearRect(0, 0, 200, 200);                         //记得设置
  const ctxOut = outerCanvas.value!.getContext('2d');
  ctxOut!.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x.value, y.value, 150, 150);
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
  background: red;
}

#outerCanvas {
  border: 2px solid red;
  background-image: url("./assets/xx.jpg");
  zoom: 0.25;
}
</style>
