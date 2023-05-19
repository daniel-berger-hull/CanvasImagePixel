// import { codeToRGB,rgbToHex,
//     XYtoIndex,
//     isDark } from './conversion.js';


// import {  getPixelCode, getPixelColor } from './colorProcessing.js';



const XYtoIndex = (canvasWidth, canvasHeight,x,y) => {
    return ((canvasWidth * y) + x) * 4;
}

const setPixelColor = (canvasWidth,canvasHeight,dataBuffer,x,y,rgb) => {

    const index = XYtoIndex( canvasWidth, canvasHeight, x ,y);

    dataBuffer[index]   = rgb.red;
    dataBuffer[index+1] = rgb.green
    dataBuffer[index+2] = rgb.blue;

    console.log("Worked setPixelColor Clicked!  [" + x + "," + y + "] --> " + index );
}  

self.addEventListener('message', function(e) {
 
    // const params = { canvas:  e.data.canvas,
    //                  imageData: e.data.imageData ,
    //                  xCenter:  e.xCenter,
    //                  yCenter: e.yCenter };

    const params = e.data;
    console.log("Web Worker received message: " + e.data );
    // self.postMessage("Message From Web Worker to the main caller");		
    // self.close();
   

    findBox(params);

    postMessage("Message From Web Worker to the main caller");
    close();
 });




 const findBox = (params) => {

    console.log("Starting the research of color box..");


    const index = XYtoIndex( params.canvasWidth, 
                             params.canvasHeight,
                            params.xCenter, 
                            params.yCenter );


    const color = {  red:  255,  green: 255, blue: 255 };

    setPixelColor(params.canvasWidth, params.canvasHeight,
                  params.imageData.data,
                  params.xCenter,params.yCenter,
                  color);


    // const code = getPixelCode(canvas,imageData.data,x,y);


    console.log(`Worked index = ${index}, for click at [${params.xCenter},${params.yCenter}]`);
    
    // const xClick = e.clientX - canvas.offsetLeft;
    // const yClick = e.clientY - canvas.offsetTop;
    // const hexColor = getPixelColor(canvas,imageData.data,xClick,yClick);

 }