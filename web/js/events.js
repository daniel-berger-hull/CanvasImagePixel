
import { alterimage , findContour, setPixelColor, getPixelColor , stretchBox}  from './colorProcessing.js';   


const canvas = document.getElementById("my-canvas");
const context = canvas.getContext("2d");


// This handlers find where the click on the canvas happens, and locate the right location in the data of image to draw a black dot...
const canvasClickHanlder = (e) => {

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const xClick = e.clientX - canvas.offsetLeft;
    const yClick = e.clientY - canvas.offsetTop;
    const hexColor = getPixelColor(canvas,imageData.data,xClick,yClick);
    
    stretchBox(canvas,imageData,xClick,yClick);

    // console.log("Clicked!  [" + yClick + "," + yClick + "] --> and color is " + hexColor);
    document.getElementById("color-sample-view").style.backgroundColor = hexColor;

    context.putImageData(imageData, 0, 0);
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


// This method setup all the event handlers required by the HTML page.
export const registerHandlers = () => {

    
    const recolorButton     = document.getElementById('colorChangebutton');
    const findcontourButton = document.getElementById('findcontourbutton');

    canvas.addEventListener("click", canvasClickHanlder );
    recolorButton.addEventListener('click', colorChangeButtonClickHandler );
    findcontourButton.addEventListener('click', findCountourButtonClickHandler );


     const img = new Image()
    img.src = "./usa2.png";
    //img.src = "./test.png";

    img.onload = () => {
        
        context.drawImage(img, 0, 0);
    }
}


