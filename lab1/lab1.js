
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


    function pushColor(r,g,b)
    {
	for(var i=0;i<4;i++){
	    color.push(r);color.push(g);color.push(b);color.push(1.0);
	}

    }
    var squareVertexPositionBuffer;
    var squareVertexIndexBuffer;
    var squareVertexColorBuffer;    

    var vertices = []; 
    var indices = [];
    var color=[];
    var num_vertices; 
    var num_indices;
    var num_color;

    function createBarVertices(avgs) {
	
	var num_bars = avgs.length;
	num_vertices = num_bars*4;
	num_indices = num_bars*6;
	num_colors=num_bars*4;

	var min, max;
	var width; 
	min = Number(avgs[0]);  max = Number(avgs[0]); 
       // find min and max 
	for (var i=0; i<num_bars; i++) {
	    console.log( "val = " + avgs[i]); 
	    if (Number(avgs[i]) < min) min = Number(avgs[i]);
	    if (Number(avgs[i]) > max) max = Number(avgs[i]); 
	} 
	width = max-min; 
	console.log("min = "+min+" max = "+max);
	
	var v_margin = 0.25; 
	var h = 2/(3*num_bars+1); 
	for (var i =0; i<num_bars; i++) {

            vertices.push(-1+(3*i+1)*h); vertices.push(-1+  v_margin); vertices.push(0.0);
	    vertices.push(-1+(3*i+3)*h); vertices.push(-1+  v_margin); vertices.push(0.0);
	    vertices.push(-1+(3*i+3)*h); vertices.push(-1+v_margin+(2-2*v_margin)*(avgs[i]-min)/width); vertices.push(0.0);
	    vertices.push(-1+(3*i+1)*h); vertices.push(-1+v_margin+(2-2*v_margin)*(avgs[i]-min)/width); vertices.push(0.0);
	    
	    indices.push(0+4*i);  indices.push(1+4*i);  indices.push(2+4*i);
	    indices.push(0+4*i);  indices.push(2+4*i);  indices.push(3+4*i);
	    
	    pushColor(Math.random(), Math.random(), Math.random());
	    
		 	    
	}

        initBuffers(); 

            drawScene();
	
    } 

   ////////////////    Initialize VBO  ////////////////////////

    function initBuffers() {
	
        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = num_vertices;

	squareVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
        squareVertexColorBuffer.itemSize = 4;
        squareVertexColorBuffer.numItems = num_colors;	

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

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);



	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

    }

function BG(red, green, blue) {

    gl.clearColor(red, green, blue, 1.0);
    drawScene(); 

} 

   



