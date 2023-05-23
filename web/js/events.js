
import { alterimage , findContour, setPixelColor, getPixelColor , stretchBox}  from './colorProcessing.js';   


const canvas = document.getElementById("my-canvas");
const context = canvas.getContext("2d");


let webWorker;


const testMethod = () => {
    return  Math.round(  Math.random()*100);
}


// This handlers find where the click on the canvas happens, and locate the right location in the data of image to draw a black dot...
const canvasClickHanlder = (e) => {

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const xClick = e.clientX - canvas.offsetLeft;
    const yClick = e.clientY - canvas.offsetTop;
    const hexColor = getPixelColor(canvas,imageData.data,xClick,yClick);
    
    // stretchBox(canvas,imageData,xClick,yClick);


    const midWidth  =  Math.round(canvas.width/2);
    const midHeight  =  Math.round(canvas.height/2);
    const color =  {  red: 255, green: 255, blue: 0};
    const color2 = {  red: 0, green: 0, blue: 0};
    

    for (let i=0;i<25;i++){
        const xRandDel  =  Math.round(  Math.random()*midWidth - midWidth/2);
        const yRandDel  =  Math.round( Math.random()*midHeight - midHeight/2);
        
        const xRandom = midWidth + xRandDel;
        const yRandom = midHeight +yRandDel;
        //console.log(i + " ["+ xRandom + "," + yRandom + "]");

        //stretchBox(canvas,imageData,xRandom,yRandom);
        setPixelColor(canvas,imageData.data,xRandom,yRandom,color2);

    }

    const a = testMethod(), b = testMethod(), c = testMethod();

    console.log( `a = ${a}, b = ${b}, c = ${c}` );

    // for (let i=0;i<5;i++){

    //     console.log( testMethod() );
    // }
    


    // console.log("Clicked!  [" + yClick + "," + yClick + "] --> and color is " + hexColor);
    document.getElementById("color-sample-view").style.backgroundColor = hexColor;

    context.putImageData(imageData, 0, 0);


//////////////////////////////////////////////////

   const params = {  
                    // canvas:  canvas,
                    canvasWidth: canvas.width,
                    canvasHeight: canvas.height,
                    dataBuffer: imageData.data,
                    x:  xClick,
                    y: yClick };

    webWorker = new Worker('./js/worker.js');
    webWorker.addEventListener('message', function(e) {
        console.log("Event.js received message: " + e.data);

        const data = context.getImageData(0, 0, canvas.width, canvas.height);
        
        
        const rgb = {red:255, green:0, blue: 0};
        setPixelColor(canvas,imageData.data,200,200,rgb);
        context.putImageData(data, 0, 0);



    });

//    webWorker.postMessage( 'Please start the work!' ); 
    webWorker.postMessage( params ); 

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


