<template>
  <canvas ref="inputCanvas" id="inputCanvas"></canvas>
  <canvas ref="outerCanvas" id="outerCanvas"></canvas>
  <button @click="printImg">打印</button>
  <img src="" alt="" ref="img">
  <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleFile"/>

</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {paint} from "./util/canvas";
import {transImg} from "./util/transImg";

const img = ref<HTMLElement>()
const inputCanvas = ref<HTMLElement>()
const outerCanvas = ref<HTMLElement>()

onMounted(() => {
  inputCanvas.value.width = 100
  inputCanvas.value.height = 100
  paint(inputCanvas.value)
  outerCanvas.value.width = document.body.clientWidth;
  outerCanvas.value.height = 300;
})


const x = ref<number>(-30)
const y = ref<number>(0)

const printImg = async () => {
  x.value += 30
  const ctx = inputCanvas.value.getContext("2d");
  const img = await transImg.urlToImg(transImg.canvasToUrl(inputCanvas.value))
  ctx.clearRect(0, 0, 100, 100);                         //记得设置
  const ctxOut = outerCanvas.value.getContext('2d');
  ctxOut.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x.value, 0, 20, 20);
}

const handleFile = async (e: Event) => {
  const el = e.target as HTMLElement
  const file = el.files.length ? el.files[0] : ""
  let imgRead: HTMLElement
  try {
    imgRead = await transImg.fileToImg(file)
  } catch (err) {
    console.log(err)
  }
  // await transImg.fileToUrl(file)
  // await transImg.urlToImg('')
  document.body.append(imgRead)
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
