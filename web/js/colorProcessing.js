const WARM_WHITE     = 16316922;
const DEMOCRAT_BLUE  =  15759459;
const REPUBLICAN_RED =  6917830;

const RED   = 255;
const GREEN = 65280;
const BLUE   = 16711680;

 import { codeToRGB,rgbToHex,
          XYtoIndex,
          isDark } from './conversion.js';



// This method will do a total of all the occurence of a specific color code in the image...

export const analyseColors = (rgbArray) => {


    const colorCodeMap = new Map();
    console.log(`Total Pixels ${rgbArray.length}`);

    rgbArray.forEach(element => {
        
        const count = colorCodeMap.get(element);
        if (count === undefined) {
            colorCodeMap.set(element,1);
        } else {
            const newTotal = count+1;
            colorCodeMap.set(element,newTotal);
        }
    });


    const totalColors = colorCodeMap.size;
    console.log("Total number of color is " + totalColors);
    const iterator1 = colorCodeMap.entries();
    for (const nextColor of iterator1) {

        if (nextColor[1] > 1000)
             console.log( nextColor[0] + "  ["  + codeToHex(nextColor[0]) + "] --> " + nextColor[1] );
        
         const rgb = codeToRGB(nextColor[0]);

         if ( isDark(rgb) ) 
             console.log( nextColor[0] + "  ["  + codeToHex(nextColor[0]) + "] --> " + nextColor[1] );


      }

}


// This function is only a demo to show how to access and modify the color of an image date (context.getImageData)
export const alterimage = (imageData) => {

    console.log("imageData.data.length is " + imageData.data.length);

    const rgbValues = [];

    const total = imageData.data.length;
    let lastMajorColor;


    let countWhite = 0;
    let countRedOrBlue = 0;
    

    for (let i = 0; i < imageData.data.length; i += 4) {
        
        const value = (imageData.data[i] << 16) + (imageData.data[i + 1] << 8) + imageData.data[i + 2];

        switch(value) {
            case WARM_WHITE:
                    imageData.data[i]   = 255;
                    imageData.data[i+1] = 255;
                    imageData.data[i+2] = 255;
                    lastMajorColor = WARM_WHITE;
                break;
            
            case DEMOCRAT_BLUE:
                    imageData.data[i] = 255;
                    imageData.data[i+1] = 0;
                    imageData.data[i+2] = 0;
                    // lastMajorColor = DEMOCRAT_BLUE;
                    lastMajorColor = BLUE;
                break;

            
           case REPUBLICAN_RED:
                    imageData.data[i]   = 0;
                    imageData.data[i+1] = 0;
                    imageData.data[i+2] = 255;
                    // lastMajorColor = REPUBLICAN_RED;
                    lastMajorColor = RED;
                break;
        
            default:

                // *** The code below is very bad, as it us IF statement into a switch case block!! Replace it as soon as you can...
                const rgb = codeToRGB(value);
                if ( isDark(rgb) ) {
                    //console.log( nextColor[0] + "  ["  + codeToHex(nextColor[0]) + "] --> " + nextColor[1] );

                    if (lastMajorColor === DEMOCRAT_BLUE || lastMajorColor === REPUBLICAN_RED) {
                        countRedOrBlue++;                    
                    } else
                        countWhite++;

                    const maskingColor  = codeToRGB(lastMajorColor);
                    imageData.data[i]   = maskingColor.red;
                    imageData.data[i+1] = maskingColor.green;
                    imageData.data[i+2] = maskingColor.blue;
                
                }

        }
    }

    console.log("Final Count is White = " + countWhite + " Red/Blue = " + countRedOrBlue);
}



export const findContour = (imageData) => {

    console.log("Find contour imageData.data.length is " + imageData.data.length);
    const rgbValues = [];

    const total = imageData.data.length;
    let lastMajorColor;


    let countWhite = 0;
    let countRedOrBlue = 0;

    const canvasWidth  = imageData.width;
    const canvasHeight = imageData.height;
    

    for (let i = 0; i < imageData.data.length; i += 4) {
        
        const value = (imageData.data[i] << 16) + (imageData.data[i + 1] << 8) + imageData.data[i + 2];

        switch(value) {
            case WARM_WHITE:
                    imageData.data[i]   = 255;
                    imageData.data[i+1] = 255;
                    imageData.data[i+2] = 255;
                    lastMajorColor = WARM_WHITE;
                break;
            
            case DEMOCRAT_BLUE:
                    imageData.data[i] = 255;
                    imageData.data[i+1] = 0;
                    imageData.data[i+2] = 0;
                    // lastMajorColor = DEMOCRAT_BLUE;
                    lastMajorColor = BLUE;
                break;

            
           case REPUBLICAN_RED:
                    imageData.data[i]   = 0;
                    imageData.data[i+1] = 0;
                    imageData.data[i+2] = 255;
                    // lastMajorColor = REPUBLICAN_RED;
                    lastMajorColor = RED;
                break;
        
            default:

                // *** The code below is very bad, as it us IF statement into a switch case block!! Replace it as soon as you can...
                const rgb = codeToRGB(value);
                if ( isDark(rgb) ) {
                    //console.log( nextColor[0] + "  ["  + codeToHex(nextColor[0]) + "] --> " + nextColor[1] );

                    if (lastMajorColor === DEMOCRAT_BLUE || lastMajorColor === REPUBLICAN_RED) {
                        countRedOrBlue++;                    
                    } else
                        countWhite++;

    
                    const maskingColor  = codeToRGB(lastMajorColor);
                    imageData.data[i]   = maskingColor.red;
                    imageData.data[i+1] = maskingColor.green;
                    imageData.data[i+2] = maskingColor.blue;
                
                }

        }
     
        
    }

    console.log("Final Count is White = " + countWhite + " Red/Blue = " + countRedOrBlue);
}





export const setPixelColor = (canvas,dataBuffer,x,y,rgb) => {

    const index = XYtoIndex( x ,y, canvas.width, canvas.height);

    dataBuffer[index]   = rgb.red;
    dataBuffer[index+1] = rgb.green
    dataBuffer[index+2] = rgb.blue;
}  

export const getPixelCode = (canvas,dataBuffer,x,y) => {

    const index = XYtoIndex( x ,y, canvas.width, canvas.height);

    let red = dataBuffer[index];
    let green = dataBuffer[index+1];
    let blue = dataBuffer[index+2];

    red   = red << 16;
    green = green << 8;
   
    

    const value = (dataBuffer[index] << 16) + (dataBuffer[index + 1] << 8) + dataBuffer[index + 2];

    return value;
}

export const getPixelColor = (canvas,dataBuffer,x,y) => {

    const index = XYtoIndex( x ,y, canvas.width, canvas.height);

    return rgbToHex(dataBuffer[index],dataBuffer[index+1],dataBuffer[index+2]);
}  
// We only draw otho line here (horizontal or vertical)
export const drawLine = (canvas,dataBuffer,x1,y1, x2,y2, rgb) => {

    if (y1 === y2 ){
        for (let x = x1; x< x2; x++ )  setPixelColor(canvas,dataBuffer,x,y1,rgb);
    }
    else if (x1 === x2 ){
        for (let y = y1; y< y2; y++ )  setPixelColor(canvas,dataBuffer,x1,y,rgb);
    }
    

}

export const stretchBox = (canvas,imageData,x,y) => {


    //const color = {  red: 255, green: 255, blue: 255};


    let colorBox = new ColorBox(canvas,imageData,x,y);
    const delta = colorBox.process();
    colorBox.drawBox();

   
    //context.putImageData(imageData, 0, 0);
    //   console.log("Main Delta ended at " + delta);

    // setPixelColor(canvas,imageData.data,x,y,color);
//    console.log("[x,y] -> " + x + "," + y + " is " + code);
    // console.log("Stretch Box!");

}


class ColorBox {

    #canvas;
    #imageData;
    #xCenter;
    #yCenter;
    #worker;
    #boxRadius;

    
    constructor(canvas,imageData,xCenter,yCenter){

        this.#canvas = canvas;
        this.#imageData = imageData;
        this.#xCenter = xCenter;
        this.#yCenter = yCenter;

        this.#worker = new Worker('./js/worker.js');
        this.#worker.addEventListener('message', function(e) {
            console.log("Worker returned a message: " + e.data);

            const context = this.#canvas.getContext("2d");

            context.putImageData(imageData, 0, 0);
        });
    }


    // This method only works on orthogonal lines, so either on the same line (y are all the same), or on the same colum (x are all the same)
    islineSameColor(referenceColor,xStart,yStart, xEnd, yEnd) {

        //Check an horizontal line here..
        if (yStart === yEnd) {

            //We scan from left to right, permute the x if required 
            if (xStart > xEnd )  { let tmp = xEnd; xStart = xEnd; xEnd = tmp; }
            for (let x = xStart; x<=xEnd; x++){

                const nextColorCode = getPixelCode(this.#canvas, this.#imageData.data, x,yStart );
                if ( nextColorCode !== referenceColor)  return false;
            }
        } 
        // Or check an vertical line...
        else  if (xStart === xEnd) {

             //And same for the vertical line, we scan from top to bottom, permute the y if required 
             if (yStart > yEnd )  { let tmp = yEnd; yStart = yEnd; yEnd = tmp; }
             for (let y = yStart; y<=yEnd;y++){
 
                 const nextColorCode = getPixelCode(this.#canvas, this.#imageData.data, xStart,y );
                 if ( nextColorCode !== referenceColor)  return false;
             }

        }

        return true;
    }

    updateSearchBox(searchBox,delta) {

        //Let deal only with positive delta, as it is easier to undertand... 
        if (delta <= 0) return;

        searchBox.topLeft.x     =  searchBox.topLeft.x  - delta;
        searchBox.topLeft.y     =  searchBox.topLeft.y  - delta;

        searchBox.topRight.x    =  searchBox.topRight.x + delta;
        searchBox.topRight.y    =  searchBox.topRight.y - delta;

        searchBox.bottomRight.x =  searchBox.bottomRight.x + delta;
        searchBox.bottomRight.y =  searchBox.bottomRight.y + delta;

        searchBox.bottomLeft.x  =  searchBox.bottomLeft.x - delta;
        searchBox.bottomLeft.y  = searchBox.bottomLeft.y  + delta;
    }

    // Use a web worker to search in the imageData
    process()  {
       

        // Keep this, as it will be used a param later when restoring the Web Workder
        // const params = {   
        //                  imageData: this.#imageData ,
        //                  xCenter: this.#xCenter, 
        //                  yCenter: this.#yCenter ,
        //                  canvasWidth:  this.#canvas.width,
        //                  canvasHeight:  this.#canvas.height,
        //                 };
        
        //this.#worker.postMessage( params ); 

        const referenceColorCode = getPixelCode(this.#canvas, this.#imageData.data,
                                              this.#xCenter, this.#yCenter);
        const currentColorHex  = getPixelColor(this.#canvas, this.#imageData.data,
                                              this.#xCenter, this.#yCenter);
  

        let continueResearch = true;

        let searchBox = {    topLeft  : { x: this.#xCenter, y: this.#yCenter },
                             topRight  : { x: this.#xCenter, y: this.#yCenter },
                             bottomLeft  : { x: this.#xCenter, y: this.#yCenter },
                             bottomRight  : { x: this.#xCenter, y: this.#yCenter }  };
        let delta = 1;

        while (continueResearch) {
          

            this.updateSearchBox(searchBox,1);

            if  (  !this.islineSameColor(referenceColorCode, searchBox.topLeft.x, searchBox.topLeft.y, searchBox.topRight.x, searchBox.topRight.y) ||
                   !this.islineSameColor(referenceColorCode, searchBox.topRight.x, searchBox.topRight.y,searchBox.bottomRight.x, searchBox.bottomRight.y) ||
                   !this.islineSameColor(referenceColorCode, searchBox.bottomLeft.x, searchBox.bottomLeft.y,searchBox.bottomRight.x, searchBox.bottomRight.y) ||
                   !this.islineSameColor(referenceColorCode, searchBox.topLeft.x, searchBox.topLeft.y,searchBox.bottomLeft.x, searchBox.bottomLeft.y) )
            { 
                continueResearch = false; 
            }  else { delta++;
            }                   
              
            
        }
                     
        this.#boxRadius = delta;
        return delta;
    }

    drawBox() {


        const delta = this.#boxRadius;


        const color = {  red: 255, green: 255, blue: 0};
        setPixelColor(this.#canvas, 
                     this.#imageData.data,
                     this.#xCenter, this.#yCenter,
                     color);


          //Top
           drawLine(this.#canvas,  this.#imageData.data, 
                    this.#xCenter-delta, this.#yCenter-delta,
                    this.#xCenter+delta, this.#yCenter-delta,
                    color);
           //Right
           drawLine(this.#canvas,  this.#imageData.data, 
                    this.#xCenter+delta, this.#yCenter-delta,
                    this.#xCenter+delta, this.#yCenter+delta,
                    color);

            //Bottom
            drawLine(this.#canvas,  this.#imageData.data, 
                    this.#xCenter-delta, this.#yCenter+delta,
                    this.#xCenter+delta, this.#yCenter+delta,
                    color);
            
            //Left
           drawLine(this.#canvas,  this.#imageData.data, 
                    this.#xCenter-delta, this.#yCenter-delta,
                    this.#xCenter-delta, this.#yCenter+delta,
                    color);


    }
   

}

