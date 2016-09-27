
var gl;
var shaderProgram;
var draw_type=2;
var v_margin = 0.25;
var index;

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
var black=[0.0,0.0,0.0,1.0,
	   0.0,0.0,0.0,1.0,
	   0.0,0.0,0.0,1.0,
	   0.0,0.0,0.0,1.0]
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
var cyan_bar=[0.0,1.0,1.0,1.0,
	      0.0,1.0,1.0,1.0,
	      0.0,1.0,1.0,1.0,
	      0.0,1.0,1.0,1.0];
var color_array=[black,cyan_bar,blue_bar,green_bar,red_bar];
var num_axis=2;
var num_graduation=10;
var num_legend=4;
var num_arrow=2;
function createAllVerticies(avgs)
{
    vertices=[];
    indices=[];
    color=[];
    var num_bars = avgs.length*5;
    var total_num_bars=num_bars+num_axis+num_graduation+num_legend+num_arrow;//plus 2 for axis for x,y and some graduations.
    num_vertices = total_num_bars*4;
    num_indices = total_num_bars*6;
    num_colors=total_num_bars*4;
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
    
    var h = 2/(num_bars*3+1); //the width of each bar
    index=0;//the index of bar
    for (var i =0; i<avgs.length; i++) {
	
	
	for(var j=0;j<avgs[i].length;j++){
	    //push verticies position by 3(x,y,z)
	    var x_left=-1+(2*index+1)*h;
	    var x_right=-1+(2*index+3)*h;
	    var y_bottom=-1+  v_margin;
	    var y_top=-1+v_margin+(2-2*v_margin)*(avgs[i][j]-min)/width;
	    var new_bar=[x_left,y_bottom,0.0,
		 	 x_right,y_bottom,0.0,
			 x_right,y_top,0.0,
			 x_left,y_top,0.0];
            addBar(new_bar,color_array[j]);
	}
	
    }
    
    
    addAxis();
    addLegend();
    //init buffers and draw
    initBuffers(); 
    
    drawScene();
    
    
}
//add the axis
function addAxis()
{
    //create x_axis
    var new_x_axis=[-0.9,-1+v_margin-0.01,0.0,
		    0.5,-1+v_margin-0.01,0.0,
		    0.5,-1+v_margin,0.0,
		    -0.9,-1+v_margin,0.0];
    addBar(new_x_axis,black);
    
	var new_y_axis=[-0.91,-1+v_margin-0.01,0.0,
			-0.9,-1+v_margin-0.01,0.0,
			-0.9,0.9,0.0,
			-0.91,0.9,0.0];
    addBar(new_y_axis,black);
    //push y-axis
    
    var height =0.18;
    
	//push graduation on the y-axis
    for(var i=0;i<10;i++)
    {
	var y_begin=(i+1)*height+v_margin-1;
	var new_graduation=[ -0.9,y_begin,0.0,
			     -0.85,y_begin,0.0,
			     -0.85,y_begin+0.01,0.0,
			     -0.9,y_begin+0.01,0.0];
	addBar(new_graduation,black);
	
	
    }
    //add arrow on x_axis
    var new_x_arrow=[0.5,-1+v_margin-0.01,0.0,
		     0.55,-1+v_margin-0.01,0.0,
		     0.5,-1+v_margin+0.05,0.0,
		     0.5,-1+v_margin-0.05,0.0
		    ];
    addBar(new_x_arrow,black);
    
    //add arrow on x_axis
    var new_y_arrow=[-0.9,0.9,0.0,
		     -0.9,0.95,0.0,
		     -0.95,0.9,0.0,
		     -0.85,0.9,0.0
		    ];
    addBar(new_y_arrow,black);
    
}
//add legend for the graph
function addLegend()
{
    for(var i=0;i<4;i++)
    {
	var x_left=0.7;
	var x_right=0.75;
	var y_bottom=x_left-0.1*i;
	var y_top=x_right-0.1*i;
	var new_vertices=[x_left,y_bottom,0.0,
			  x_right,y_bottom,0.0,
			  x_right,y_top,0.0,
			  x_left,y_top,0.0];
	addBar(new_vertices,color_array[i+1]);
	
    }
    
    
}

//add a bar, requires a new vertices and color of the bar.
function addBar(new_bar_vertices,new_color)
{
    vertices=vertices.concat(new_bar_vertices);
    indices.push(0+4*index);  indices.push(1+4*index);  indices.push(2+4*index);
    indices.push(0+4*index);  indices.push(2+4*index);  indices.push(3+4*index);
    index++;
    color=color.concat(new_color);
    
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


   



