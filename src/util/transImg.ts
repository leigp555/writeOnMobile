export const transImg = {
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
    canvasToUrl:(canvas:HTMLCanvasElement, quality:number, type:string) =>{
        return canvas.toDataURL(type || 'image', quality || 1.0);
     },
     //创建一个新的canvas标签
}

class CreateCanvas{
    private canvas: HTMLCanvasElement
    constructor(width:number,height:number) {
        this.canvas = document.createElement('canvas')
        //@ts-ignore
        this.canvas.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

