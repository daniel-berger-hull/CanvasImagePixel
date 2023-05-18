const WARM_WHITE     = 16316922;
const DEMOCRAT_BLUE  =  15759459;
const REPUBLICAN_RED =  6917830;

const RED   = 255;
const GREEN = 65280;
const BLUE   = 16711680;




const buildRgb = (imageData) => {
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

const buildRgbCode = (imageData) => {
    const rgbValues = [];

    const total = imageData.data.length;

    for (let i = 0; i < imageData.data.length; i += 4) {
        
        const value = (imageData.data[i] << 16) + (imageData.data[i + 1] << 8) + imageData.data[i + 2];
        rgbValues.push(value);
    }
    return rgbValues;
};

const codeToRGB = (code) => {


    // const red1 =  code >> 16;
    // const green1 = code >> 8;
    // const green1 = code >> 8;
    
    return { red:   (code >> 16) & 255,
             green: (code >> 8) & 255,
             blue:  code & 255
            };

}

const isDark = (rgb) => {
    if (rgb.red > 20)    return false;
    if (rgb.green > 20)  return false;
    if (rgb.blue > 20)   return false;

    return true;
}

// This method will do a total of all the occurence of a specific color code in the image...

const analyseColors = (rgbArray) => {


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



const codeToHex = (colorCode) => {

    const red  =  (colorCode & 16711680) >> 16;;
    const green = (colorCode & 65280) >> 8;
    const blue  = colorCode & 255;

    // return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`; 
    return rgbToHex(red,green,blue);
}

const rgbToHex = (red,green,blue) => {

    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`; 
}

const indexToXY = (index, canvasWidth, canvasHeight) => {

}


const XYtoIndex = (x,y, canvasWidth, canvasHeight) => {
    return ((canvasWidth * y) + x) * 4;
}

const alterimage = (imageData) => {

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



const findContour = (imageData) => {

    console.log("AlterImages 2");
    const rgbValues = [];

    const total = imageData.data.length;
    let lastMajorColor;


    let countWhite = 0;
    let countRedOrBlue = 0;

    const canvasWidth  = imageData.width;
    const canvasHeight = imageData.height;
    
    // const indexToXY = (index, canvasWidth, canvasHeight) => {

    // }
    

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



    
const canvas = document.getElementById("my-canvas");
const context = canvas.getContext("2d");
const img = new Image()
 img.src = "./usa2.png";
//img.src = "./test.png";

img.onload = () => {
    
    console.log("getImageData");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    context.drawImage(img, 0, 0);
}



// alterimage

const recolorButton = document.getElementById('recolorbutton');
const findcontourButton = document.getElementById('findcontourbutton');

const colorSampleView = document.getElementById('color-sample-view');


canvas.addEventListener("click", func = (e) =>{



    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);


    const xClick = e.clientX - canvas.offsetLeft;
    const yClick = e.clientY - canvas.offsetTop;
    

    const index = XYtoIndex( xClick ,yClick, canvas.width, canvas.height);
    const hexColor = rgbToHex(imageData.data[index],imageData.data[index+1],imageData.data[index+2]);



    imageData.data[index]   = 0;
    imageData.data[index+1] = 0;
    imageData.data[index+2] = 0;

    //const value = (imageData.data[index] << 16) + (imageData.data[index + 1] << 8) + imageData.data[index + 2];

    console.log("Clicked!  [" + yClick + "," + yClick + "] --> " + index + " and color is " + hexColor);

  
//    document.getElementById("color-sample-view").style.backgroundColor = "lightblue"; 
    document.getElementById("color-sample-view").style.backgroundColor = hexColor;

    

    context.putImageData(imageData, 0, 0);

    //colorSampleView

    // imageData.data[i]   = maskingColor.red;
    // imageData.data[i+1] = maskingColor.green;
    // imageData.data[i+2] = maskingColor.blue;
    // printf( "click: screen(%.1f|%.1f) client(%.1f|%.1f) click count = %d",
    //         e.screenX, e.screenY,
    //         ,
    //         e.click_count );
  });





recolorButton.addEventListener('click', () => {

   const imageData = context.getImageData(0, 0, canvas.width, canvas.height);


    alterimage(imageData);
    console.log("imageData.data.length is " + imageData.data.length);

   context.putImageData(imageData, 0, 0)
})


findcontourButton.addEventListener('click', () => {

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
 
     // const rgbData = buildRgbCode(imageData);
     // analyseColors(rgbData);
 
     findContour(imageData);
 
     console.log("imageData.data.length is " + imageData.data.length);
 
 
 //    for (let i = 300000; i < 300000+100; i += 4) {
 //     console.log(`${i} - [${imageData.data[i]},${imageData.data[i+1]},${imageData.data[i+2]},${imageData.data[0]}]`)
 //     }
 
    context.putImageData(imageData, 0, 0);
 })



const testColorChange = () => {
    console.log("testColorChange");''
}