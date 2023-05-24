
import { alterimage , findContour, setPixelColor, getPixelColor , stretchBox}  from './colorProcessing.js';   



const WORKER_IDLE      = 0;
const WORKER_INVOKED   = 1;
const WORKER_DONE      = 2;



const canvas = document.getElementById("my-canvas");
const context = canvas.getContext("2d");


let workerInfo = {
    currentState: WORKER_IDLE
}

let webWorker;
let animate;




// This handlers find where the click on the canvas happens, and locate the right location in the data of image to draw a black dot...
const canvasClickHanlder = (e) => {

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const xClick = e.clientX - canvas.offsetLeft;
    const yClick = e.clientY - canvas.offsetTop;
    const hexColor = getPixelColor(canvas,imageData.data,xClick,yClick);
    
     stretchBox(canvas,imageData,xClick,yClick);


    // const midWidth  =  Math.round(canvas.width/2);
    // const midHeight  =  Math.round(canvas.height/2);
    // const color =  {  red: 255, green: 255, blue: 0};
    // const color2 = {  red: 0, green: 0, blue: 0};
    

    // for (let i=0;i<25;i++){
    //     const xRandDel  =  Math.round(  Math.random()*midWidth - midWidth/2);
    //     const yRandDel  =  Math.round( Math.random()*midHeight - midHeight/2);
        
    //     const xRandom = midWidth + xRandDel;
    //     const yRandom = midHeight +yRandDel;
    //     //console.log(i + " ["+ xRandom + "," + yRandom + "]");

    //     //stretchBox(canvas,imageData,xRandom,yRandom);
    //     setPixelColor(canvas,imageData.data,xRandom,yRandom,color2);

    // }


     console.log("Clicked!  [" + yClick + "," + yClick + "] --> and color is " + hexColor);
    document.getElementById("color-sample-view").style.backgroundColor = hexColor;
    
     context.putImageData(imageData, 0, 0);




   const params = {  
                    // canvas:  canvas,
                    canvasWidth: canvas.width,
                    canvasHeight: canvas.height,
                    dataBuffer: imageData.data,
                    x:  xClick,
                    y:  yClick };
//////////////////////////////////////////////////
   
//    webWorker.postMessage( 'Please start the work!' ); 
    workerInfo.currentState = WORKER_IDLE;
    console.log("Worker State: " + workerInfo.currentState);
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




const  webWorkerMessageHandler = (e) => {

    //console.log("Event.js received message: " + e.data);
    console.log(`Event.js received message: [${e.data.x},${e.data.y}`);
    
    

        const imageData  = context.getImageData(0, 0, canvas.width, canvas.height);
        
        
        const rgb = {red:255, green:255, blue: 0};

       
        setPixelColor(canvas,imageData.data,e.data.x,e.data.y,rgb);   /// tHIS ONE WORKS!!!

        const midWidth  =  Math.round(canvas.width/2);
        const midHeight  =  Math.round(canvas.height/2);


        e.data.dots.forEach(nextDot => {

             setPixelColor(canvas,imageData.data,nextDot.x,nextDot.y,rgb);
            
        });


        context.putImageData(imageData, 0, 0);

        workerInfo.currentState = WORKER_DONE;

        console.log("Worker State: " + workerInfo.currentState);


}
// This method setup all the event handlers required by the HTML page.
export const registerHandlers = () => {

    
    const recolorButton      = document.getElementById('colorChangebutton');
    const findcontourButton  = document.getElementById('findcontourbutton');




    canvas.addEventListener("click", canvasClickHanlder );
    recolorButton.addEventListener('click', colorChangeButtonClickHandler );
    findcontourButton.addEventListener('click', findCountourButtonClickHandler );
    

    //webWorker = new Worker('./js/worker.js');
    webWorker = new Worker('./js/worker.js', { type: "module" });
               
    webWorker.addEventListener('message', webWorkerMessageHandler );

   
    
     const img = new Image()
    img.src = "./usa2.png";
    //img.src = "./test.png";

    img.onload = () => {
        
        context.drawImage(img, 0, 0);
        // animate = window.setInterval(timerRedrawHandler,500);
    }
}


