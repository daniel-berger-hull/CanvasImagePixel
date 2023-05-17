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



const analyseColors = (rgbArray) => {


    const colorCodeMap = new Map();
    console.log(`Total Pixels ${rgbArray.length}`);



    rgbArray.forEach(element => {
        
        const count = colorCodeMap.get(element);
        if (count === undefined) {
            colorCodeMap.set(element,0);
        } else {
            const newTotal = count+1;
            colorCodeMap.set(element,newTotal);
        }
    });

    const iterator1 = colorCodeMap.entries();
    for (const nextColor of iterator1) {

        if (nextColor[1] > 100)
             console.log( nextColor[0] + "  ["  + codeToHex(nextColor[0]) + "] --> " + nextColor[1] );
      }

}

const codeToHex = (colorCode) => {

    const red  =  (colorCode & 16711680) >> 16;;
    const green = (colorCode & 65280) >> 8;
    const blue  = colorCode & 255;


    //return `#${red}${green}${blue}`;
    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
    
}




    
const canvas = document.getElementById("my-canvas");
const context = canvas.getContext("2d");
const img = new Image()
img.src = "./usa.png"
img.onload = () => {
    
    console.log("getImageData");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);


   

    // const rgbData = buildRgbCode(imageData);

    // analyseColors(rgbData);

    // const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    
     console.log("imageData.data.length is " + imageData.data.length);

    // for (let i = 0; i < imageData.data.length; i += 4) {
    //     imageData.data[i] = 255
    // }

    // context.putImageData(imageData, 0, 0)
    // console.log(" Conversion done and putImageData called... ");


    context.drawImage(img, 0, 0);
}


const testButton = document.getElementById('testbutton');


testButton.addEventListener('click', () => {

    //testColorChange();
   const imgData = context.getImageData(0, 0, canvas.width, canvas.height);

   for (let i = 300000; i < 300000+100; i += 4) {
    console.log(`${i} - [${imgData.data[i]},${imgData.data[i+1]},${imgData.data[i+2]},${imgData.data[0]}]`)
    }




   for (let i = 0; i < imgData.data.length; i += 4) {
     imgData.data[i] = 0
   }

   

//    13012585
//     6519024

//    #698EC6 // blue  13012585    105, 142, 198

//    #F07863  // red   6519024  6519024    240, 120, 99
   context.putImageData(imgData, 0, 0)
})



const testColorChange = () => {
    console.log("testColorChange");''
}