export const paint=(canvas:HTMLElement,fillColor:string,lineWidth:number)=>{
    //@ts-ignore
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = fillColor;
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
