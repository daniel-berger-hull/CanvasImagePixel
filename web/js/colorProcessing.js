const WARM_WHITE     = 16316922;
const DEMOCRAT_BLUE  =  15759459;
const REPUBLICAN_RED =  6917830;

const RED    =      255;
const GREEN  =    65280;
const BLUE   = 16711680;

 import { codeToRGB,rgbToHex, isDark } from './conversion.js';

// import {setPixelColor, 
//         getPixelCode,getPixelColor,
//         drawLine }  from './pixelFunctions.js';

import { ColorBox , ColorRectangle } from './ColorBox.js';

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



export const stretchBox = (ctx,canvas,imageData,x,y) => {

    let rectangleBox = new ColorRectangle(canvas,imageData,x,y);


    
    const delta2 = rectangleBox.process();
    
    rectangleBox.drawBox();


    rectangleBox.edgesDetected.forEach(edge => {
        
        console.log(`${edge.direction} step# ${edge.step} `); 
    });


    
    return rectangleBox.getBox();

}

