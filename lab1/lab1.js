
    var gl;
    var shaderProgram;
    var draw_type=2;
    

//////////// Init OpenGL Context etc. ///////////////

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }


    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////


    
    var squareVertexPositionBuffer;
    var squareVertexIndexBuffer;
    var squareVertexColorBuffer;    

    var vertices = []; 
    var indices = [];
    var color=[];
    var num_vertices; 
    var num_indices;
    var num_color;

    var red_bar=[1.0,0.0,0.0,1.0,
		 1.0,0.0,0.0,1.0,
                 1.0,0.0,0.0,1.0,
		 1.0,0.0,0.0,1.0];
    var blue_bar=[0.0,0.0,1.0,1.0,
	          0.0,0.0,1.0,1.0,
		  0.0,0.0,1.0,1.0,
		  0.0,0.0,1.0,1.0];
    var green_bar=[0.0,1.0,0.0,1.0,
		   0.0,1.0,0.0,1.0,
		   0.0,1.0,0.0,1.0,
		   0.0,1.0,0.0,1.0];
    var yellow_bar=[0.0,1.0,1.0,1.0,
		   0.0,1.0,1.0,1.0,
		   0.0,1.0,1.0,1.0,
		   0.0,1.0,1.0,1.0];
    function createAllVerticies(avgs)
    {
	vertices=[];
	indices=[];
	color=[];
	var num_bars = avgs.length*5;
	num_vertices = num_bars*4;
	num_indices = num_bars*6;
	num_colors=num_bars*4;
	var min, max;
	var width; 
	min = Number(avgs[0][0]);  max = Number(avgs[0][0]); 
       // find min and max 
	for (var i=0; i<avgs.length; i++) {
	    for(var j=0;j<avgs[i].length;j++){
	    	if (Number(avgs[i][j]) < min) min = Number(avgs[i][j]);
	    	if (Number(avgs[i][j]) > max) max = Number(avgs[i][j]); 
	    }
	} 
	width = max-min; //the hight of each bar
	
	var v_margin = 0.25; 
	var h = 2/(num_bars*3+1); //the width of each bar
	var index=0;//the index of bar
	for (var i =0; i<avgs.length; i++) {
	    //assign color to each bar
	    color=color.concat(red_bar);
	    color=color.concat(yellow_bar);
	    color=color.concat(blue_bar);
	    color=color.concat(green_bar);
	    color=color.concat(red_bar);
	    console.log(color);
	    
	for(var j=0;j<avgs[i].length;j++){
	    //push verticies position by 3(x,y,z)
            vertices.push(-1+(2*index+1)*h); vertices.push(-1+  v_margin); vertices.push(0.0);
	    vertices.push(-1+(2*index+3)*h); vertices.push(-1+  v_margin); vertices.push(0.0);
	    vertices.push(-1+(2*index+3)*h); vertices.push(-1+v_margin+(2-2*v_margin)*(avgs[i][j]-min)/width); vertices.push(0.0);
	    vertices.push(-1+(2*index+1)*h); vertices.push(-1+v_margin+(2-2*v_margin)*(avgs[i][j]-min)/width); vertices.push(0.0);
	    //push index by point 0,1,2 0,2,3, which are two triangles.
	    indices.push(0+4*index);  indices.push(1+4*index);  indices.push(2+4*index);
	    indices.push(0+4*index);  indices.push(2+4*index);  indices.push(3+4*index);
	    
	    //get index plused
	    index++;
	    }
		 	    
	}

        initBuffers(); 

        drawScene();
	

    }


   ////////////////    Initialize VBO  ////////////////////////

    function initBuffers() {
	//inital position buffer
        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = num_vertices;
	//initial color buffer
	squareVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
        squareVertexColorBuffer.itemSize = 4;
        squareVertexColorBuffer.numItems = num_colors;	
	//initial indices buffer
	squareVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);  
        squareVertexIndexBuffer.itemsize = 1;
        squareVertexIndexBuffer.numItems = num_indices; 
    }


///////////////////////////////////////////////////////////////////////

    function drawScene() {

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);


	// draw elementary arrays - triangle indices 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 
	
	
	
	gl.drawElements(gl.TRIANGLES, num_indices, gl.UNSIGNED_SHORT, 0);
	
    }
    
	var colorLocation 
    ///////////////////////////////////////////////////////////////

    function webGLStart() {
        var canvas = document.getElementById("code05-canvas");
        initGL(canvas);
        initShaders();
	//get position vertex
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	//get color vertex
	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
	//initial with white color
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

    }



   



