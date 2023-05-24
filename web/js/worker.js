//   import { codeToRGB,rgbToHex,
//       XYtoIndex,
//       isDark } from './conversion.js';


// import {  getPixelCode, getPixelColor } from './colorProcessing.js';




const randomDots = (canvasWidth,canvasHeight) => {

    const dots = [];

    const midWidth  =  Math.round(canvasWidth/2);
    const midHeight =  Math.round(canvasHeight/2);


     for (let i=0;i<25;i++){
        const xRandDel  =  Math.round(  Math.random()*midWidth - midWidth/2);
        const yRandDel  =  Math.round( Math.random()*midHeight - midHeight/2);
        
        const xRandom = midWidth + xRandDel;
        const yRandom = midHeight +yRandDel;
        console.log(i + " ["+ xRandom + "," + yRandom + "]");

        //stretchBox(canvas,imageData,xRandom,yRandom);
        // setPixelColor(canvas,imageData.data,xRandom,yRandom,color2);

        dots.push({x: xRandom, y:yRandom});

    }

    return dots;
}
   

self.addEventListener('message', function(e) {
 

    const params = e.data;


    console.log("Web Worker received message: " );
    console.log( `\canvasWidth:  ${params.canvasWidth}`);
    console.log( `\canvasHeight:  ${params.canvasHeight}`);        
    console.log( `\[x,y]:   [${params.x},${params.y}]`);
    
    // self.postMessage("Message From Web Worker to the main caller");		
    // self.close();
   
    //findBox(params);

    // const rgb = {red:255, green:255, blue: 255};
    // setPixelColor ( params.canvasWidth,params.canvasHeight,
    //                 params.dataBuffer,
    //                 params.x,params.y,
    //                 rgb);
                    


                    const results = {                         
                        x:  params.x,
                        y:  params.y ,
                        dots:  randomDots(params.canvasWidth,params.canvasHeight)
                    
                    };


//    postMessage("Message From Web Worker to the main caller");
    postMessage(results);

    



    // close();
 });

 



 const findBox = (params) => {

    console.log("Starting the research of color box..");


    const index = XYtoIndex( params.canvasWidth, 
                             params.canvasHeight,
                            params.x, 
                            params.y );


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