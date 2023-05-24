

 import {  rgbToHex,XYtoIndex } from './conversion.js';



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


