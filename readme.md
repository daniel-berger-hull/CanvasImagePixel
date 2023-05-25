***************************************************************************************************************************
	
	This project is an experiment about color identification in the data of a bitmap image, and its goal is to find
	an heuristic that can identify regions of similar color (output can be squares or rectangles)

***************************************************************************************************************************

May 23, 2023
============

  Removed the Web Worker from the project, and replaced with a simple Javascript interval handler.
  Did split the pixel oriented functions from the colorProcessing.js

May 22, 2023
============
Fixed some rendering problem as the imageData and imageData.data were not used correctly (which made the  context.putImageData failing and not rendering)
Also, the web worker is now instanciated as module, which makes possible to use imports...

To DO:
  Ready now to retry a thread (Web Worker) that is using a ColorBox (and not a ColorBox that is using internally a thread)
  Make sure to respect this Thread-Using-Colorbox design!

May 19, 2023
============

  The import does not work in this worker.js file, not sure why...
  Maybe is is because it is accessed or given as param to a Web Worker?

  To DO:
     Investigate why import is not working in worker.js


May 18, 2023
============

  Tryied to create a class to delegate the processing of the Inflate box (ColorBox.js), using HTML/JS Web worker.
  But it appears that the update on the rendering is not done anymore (needs a call to a context.putImageData(...)),
  and the context is lost or something of that sort...

  Will go back, and try to use the  main thread to process the inflate box, very bad design, but just to see if it works, so I can later try again with the Web Worker thread...


May 17, 2023
============

   Simple page created, and an image of the US election of 2016 is loaded and displayed.
   A button been added, that calls a method who can identify the color in the bitmap.


 To DO:
   First experiment would be to try to eleminate the numbers present in the image (which is the electoral count for a state)



Create an inflate box
  start with a point
  then a larger box iteratively x,y --> x-1,y-1 to x+1,y+1 --> x+2,y+2