import {setPixelColor,
        getPixelCode,getPixelColor,
        drawLine }  from './pixelFunctions.js';




export class ColorBox {

    #canvas;
    #imageData;
    #xCenter;
    #yCenter;
    #boxRadius;

    constructor(canvas,imageData,xCenter,yCenter){

        this.#canvas = canvas;
        this.#imageData = imageData;
        this.#xCenter = xCenter;
        this.#yCenter = yCenter;
    }



    getCanvas()               {   return  this.#canvas;           };
    getImageData()            {   return  this.#imageData;        };
    getData()                 {   return  this.#imageData.data;   };
    getX()                    {   return this.#xCenter;           };
    getY()                    {   return this.#yCenter;           };
    getBoxRadius()            {   return this.#boxRadius;         };


    setBoxRadius(radius)      {   this.#boxRadius = radius;       };

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

            return true;
        }
        // Or check an vertical line...
        else  if (xStart === xEnd) {

             //And same for the vertical line, we scan from top to bottom, permute the y if required
             if (yStart > yEnd )  { let tmp = yEnd; yStart = yEnd; yEnd = tmp; }
             for (let y = yStart; y<=yEnd;y++){

                 const nextColorCode = getPixelCode(this.#canvas, this.#imageData.data, xStart,y );
                 if ( nextColorCode !== referenceColor)  return false;
             }

             return true;
        }

        return false;
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

        const referenceColorCode = getPixelCode(this.#canvas, this.#imageData.data,
                                              this.#xCenter, this.#yCenter);
        // const currentColorHex  = getPixelColor(this.#canvas, this.#imageData.data,
        //                                       this.#xCenter, this.#yCenter);


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




    getBox() {
        return {  topLeft   : { x: this.#xCenter-this.#boxRadius,
                                y: this.#yCenter-this.#boxRadius},


                  bottomRight: { x: this.#xCenter+this.#boxRadius,
                                y:  this.#yCenter+this.#boxRadius }   };
    }

}


export class ColorRectangle extends ColorBox {


    edgesDetected = [];



    //Utility functions, to validate is there is any search required, based on the status of the search in all 4 directions...
    continueResearch(permissions) {

        // if ( permissions.top    ||  permissions.right ||
        //      permissions.bottom ||  permissions.left)      return true;
        // else return false;

        return   permissions.top ||  permissions.right || permissions.bottom ||  permissions.left;
    }

    //Modified version of the ColorBox::updateSearchBox, where the rectangle is expended only in the directions that are still permitted in the search (same color still found in the line, so we continue the inflation of the rectangle in this direction)
    updateSearchBox(searchBox,delta,permissions) {

        if (delta <= 0) return;

        if (permissions.top){
            searchBox.topLeft.y     =  searchBox.topLeft.y  - delta;
            searchBox.topRight.y    =  searchBox.topRight.y - delta;
        }

        if (permissions.right){
            searchBox.topRight.x    =  searchBox.topRight.x + delta;
            searchBox.bottomRight.x =  searchBox.bottomRight.x + delta;
        }

        if (permissions.bottom){
            searchBox.bottomLeft.y  = searchBox.bottomLeft.y   + delta;
            searchBox.bottomRight.y =  searchBox.bottomRight.y + delta;
        }

        if (permissions.left){
            searchBox.topLeft.x     =  searchBox.topLeft.x  - delta;
            searchBox.bottomLeft.x  =  searchBox.bottomLeft.x - delta;
        }
    }

     // Use a web worker to search in the imageData
     process()  {



        console.log("Calling the rectangle process...");
        const referenceColorCode = getPixelCode(this.getCanvas(), this.getData(),
                                                this.getX(), this.getY());
      
        let searchBox = {    topLeft      : { x: this.getX(), y: this.getY() },
                             topRight     : { x: this.getX(), y: this.getY() },
                             bottomLeft   : { x: this.getX(), y: this.getY() },
                             bottomRight  : { x: this.getX(), y: this.getY() }  };
        let delta = 1;


        let continueSearchPermissions = { top:  true, right: true, bottom: true, left: true };



         while ( this.continueResearch(continueSearchPermissions) ) {

            this.updateSearchBox(searchBox,1,continueSearchPermissions);

            if  (  continueSearchPermissions.top && 
                   !this.islineSameColor(referenceColorCode, searchBox.topLeft.x, searchBox.topLeft.y, searchBox.topRight.x, searchBox.topRight.y) ) {
                    continueSearchPermissions.top = false;

                    this.edgesDetected.push( {direction:'top', step: delta, positions: searchBox} );

                     console.log(`top step# ${delta}  topLeft [${searchBox.topLeft.x},${searchBox.topLeft.y}]    topRight [${searchBox.topRight.x},${searchBox.topRight.y}]    bottomRight [${searchBox.bottomRight.x},${searchBox.bottomRight.y}]    bottomLeft [${searchBox.bottomLeft.x},${searchBox.bottomLeft.y}]`); 


            }

            if  (  continueSearchPermissions.right && 
                   !this.islineSameColor(referenceColorCode, searchBox.topRight.x, searchBox.topRight.y,searchBox.bottomRight.x, searchBox.bottomRight.y) ) {
                   continueSearchPermissions.right = false;
                //    this.edgesDetected.push('right');
                   this.edgesDetected.push( {direction:'right', step: delta, positions: searchBox} );
                   console.log(`right step# ${delta}  topLeft [${searchBox.topLeft.x},${searchBox.topLeft.y}]    topRight [${searchBox.topRight.x},${searchBox.topRight.y}]    bottomRight [${searchBox.bottomRight.x},${searchBox.bottomRight.y}]    bottomLeft [${searchBox.bottomLeft.x},${searchBox.bottomLeft.y}]`); 

            }

            if  (   continueSearchPermissions.bottom && 
                    !this.islineSameColor(referenceColorCode, searchBox.bottomLeft.x, searchBox.bottomLeft.y,searchBox.bottomRight.x, searchBox.bottomRight.y) ) {
                    continueSearchPermissions.bottom = false;
                    // this.edgesDetected.push('bottom');
                    this.edgesDetected.push( {direction:'bottom', step: delta, positions: searchBox} );
                    console.log(`bottom step# ${delta}  topLeft [${searchBox.topLeft.x},${searchBox.topLeft.y}]    topRight [${searchBox.topRight.x},${searchBox.topRight.y}]    bottomRight [${searchBox.bottomRight.x},${searchBox.bottomRight.y}]    bottomLeft [${searchBox.bottomLeft.x},${searchBox.bottomLeft.y}]`); 

            }

            if  (   continueSearchPermissions.left && 
                    !this.islineSameColor(referenceColorCode, searchBox.topLeft.x, searchBox.topLeft.y,searchBox.bottomLeft.x, searchBox.bottomLeft.y) ) {
                    continueSearchPermissions.left = false;
                    // this.edgesDetected.push('left');
                    this.edgesDetected.push( {direction:'left', step: delta, positions: searchBox} );
                    console.log(`left step# ${delta}  topLeft [${searchBox.topLeft.x},${searchBox.topLeft.y}]    topRight [${searchBox.topRight.x},${searchBox.topRight.y}]    bottomRight [${searchBox.bottomRight.x},${searchBox.bottomRight.y}]    bottomLeft [${searchBox.bottomLeft.x},${searchBox.bottomLeft.y}]`); 

            }
         

            //May  have an extra iteration happening at the end of the last direction...
            delta++;


        }

        this.setBoxRadius(delta);

        return delta;
    }

}
