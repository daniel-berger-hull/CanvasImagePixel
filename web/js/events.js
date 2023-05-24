
import { getPixelColor }  from './pixelFunctions.js';   
import { alterimage , findContour, stretchBox}  from './colorProcessing.js'


const canvas = document.getElementById("my-canvas");
const context = canvas.getContext("2d");




// This handlers find where the click on the canvas happens, and set a timer function to process the inflate box
const canvasClickHanlder = (e) => {

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const xClick = e.clientX - canvas.offsetLeft;
    const yClick = e.clientY - canvas.offsetTop;
    const hexColor = getPixelColor(canvas,imageData.data,xClick,yClick);
    

     const canvasParam = {width: canvas.width, height: canvas.height};

     const timerParams = { ctx:   context,
                           canvas: canvasParam,
                           imageData, imageData,
                           x: xClick, y: yClick};

     const myTimeout = setTimeout( timerHandler, 200, timerParams );
    


    console.log("Clicked!  [" + xClick + "," + yClick + "] --> and color is " + hexColor);
    document.getElementById("color-sample-view").style.backgroundColor = hexColor;
    
}

const  colorChangeButtonClickHandler = () => {

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    alterimage(imageData);
    
    context.putImageData(imageData, 0, 0)
}

const  findCountourButtonClickHandler = () => {

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
       
        findContour(imageData);
            
        context.putImageData(imageData, 0, 0);
}

const moveMouseHandler = (e) => {


    const xClick = e.clientX - canvas.offsetLeft;
    const yClick = e.clientY - canvas.offsetTop;
    document.getElementById("coords").innerHTML = `${xClick},${yClick}`;
}

 const timerHandler = (params) => {

    console.log("Timer handlers v2: [" + params.x + "," + params.y + "]");


    let colorBoxes = [];
    let boxParams = {...params};


    // for (let i=0;i<15;i++) {

    //     const xPos = Math.round( Math.random() *  params.canvas.width );
    //     const yPos = Math.round( Math.random() *  params.canvas.height );

    //     boxParams.x = xPos;
    //     boxParams.y = yPos;


    //     const boxPos = stretchBox(  boxParams.ctx,
    //                                 boxParams.canvas,
    //                                 boxParams.imageData,
    //                                 boxParams.x ,boxParams.y );
    //     colorBoxes.push(boxPos);
    // }

    const boxPos = stretchBox(  boxParams.ctx,
        boxParams.canvas,
        boxParams.imageData,
        boxParams.x ,boxParams.y );

    // console.log(`%c Found Inflating Boxes:`, "color:red");
    // colorBoxes.forEach( (box,i) => {
    //     console.log(`${i} -> [${box.topLeft.x},${box.topLeft.y}] * [${box.bottomRight.x},${box.bottomRight.y}]`);
    // });

    params.ctx.putImageData(params.imageData, 0, 0);
}




// This method setup all the event handlers required by the HTML page.
export const registerHandlers = () => {

    
    const recolorButton      = document.getElementById('colorChangebutton');
    const findcontourButton  = document.getElementById('findcontourbutton');

    canvas.addEventListener("click", canvasClickHanlder );
    canvas.addEventListener("mousemove", moveMouseHandler );


    
    recolorButton.addEventListener('click', colorChangeButtonClickHandler );
    findcontourButton.addEventListener('click', findCountourButtonClickHandler );
    
    const img = new Image()
    img.src = "./usa2.png";
    
    img.onload = () => {
        
        context.drawImage(img, 0, 0);
    }
}


