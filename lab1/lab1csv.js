
var has_data = false;
var data;
var has_avgs = false;
var avgs = [];


function set_data(lines) {
    data = lines;
    has_data = true;
}
function csv_draw_bar(species)
{
    var species_length=0;
    for(var i=0;i<data.length;i++)
    {
	
	    if(data[i][0]===species)
	    {
		species_length++;
	    }
	    for(var j=0;j<data[i].length;j++)
	    {
		if(i==0)
		{
		    tmp = 0;
		    avgs.push(tmp);
		}
		
		if(data[i][0]===species&&j!=0){
		    
		    avgs[j]+=Number(data[i][j]);
		    
		    
		    
		}
	    }
	    
	
    }
    
    for(var j=0; j<data[0].length;j++)
    {
	avgs[j]=avgs[j]/species_length;
	console.log(" column "+j+" Avg = "+avgs[j]); 
    }
    has_avg=true;
    console.log("length="+species_length);
    createBarVertices(avgs);
}


function csv_draw_bars() {
    
    for (var i=0; i<data.length; i++) {
	for (var j=0; j<data[i].length; j++) {
	    if (i==0) { tmp = 0; avgs.push(tmp); }
	    else {
		if (j==0) avgs[j] = 0; 
		else avgs[j]+=Number(data[i][j]); 
	    }
	}
    }
    for (var j = 0; j <data[0].length; j++) {
	avgs[j] = avgs[j]/(data.length-1); 
	console.log(" column "+j+" Avg = "+avgs[j]); 

    }

    has_avgs = true;

    createBarVertices(avgs); 
    
}

