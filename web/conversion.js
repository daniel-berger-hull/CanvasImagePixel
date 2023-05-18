


export const buildRgb = (imageData) => {
        const rgbValues = [];

        const total = imageData.data.length;

        for (let i = 0; i < imageData.data.length; i += 4) {
            const rgb = {
            r: imageData.data[i],
            g: imageData.data[i + 1],
            b: imageData.data[i + 2],
            };
            rgbValues.push(rgb);
        }
        return rgbValues;
};

export const buildRgbCode = (imageData) => {
    const rgbValues = [];

    const total = imageData.data.length;

    for (let i = 0; i < imageData.data.length; i += 4) {
        
        const value = (imageData.data[i] << 16) + (imageData.data[i + 1] << 8) + imageData.data[i + 2];
        rgbValues.push(value);
    }
    return rgbValues;
};

export const codeToRGB = (code) => {
    
    return { red:   (code >> 16) & 255,
             green: (code >> 8) & 255,
             blue:  code & 255
            };

}

export const isDark = (rgb) => {
    if (rgb.red > 20)    return false;
    if (rgb.green > 20)  return false;
    if (rgb.blue > 20)   return false;

    return true;
}



export const codeToHex = (colorCode) => {

    const red  =  (colorCode & 16711680) >> 16;;
    const green = (colorCode & 65280) >> 8;
    const blue  = colorCode & 255;

    return rgbToHex(red,green,blue);
}

export const rgbToHex = (red,green,blue) => {

    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`; 
}

export const indexToXY = (index, canvasWidth, canvasHeight) => {

}


export const XYtoIndex = (x,y, canvasWidth, canvasHeight) => {
    return ((canvasWidth * y) + x) * 4;
}




