
var has_data = false;
var data;
var setosa_length=0;
var versicolor_length=0;
var virginica_length=0;
var setosa_avgs=[];
var versicolor_avgs=[];
var virginica_avgs=[];


function set_data(lines) {
    data = lines;
    has_data = true;
    calculate_avgs();
}
//calculate the average of the data
function calculate_avgs()
{
   //initial values
    setosa_length=0;
    versicolor_length=0;
    virginica_length=0;
    setosa_avgs=[];
    versicolor_avgs=[];
    virginica_avgs=[];
    
    //draw all bars
    for(var i=0;i<data.length;i++)
    {
	if(data[i][0]==="setosa")
	    {
		setosa_length++;
	    }
	else if(data[i][0]==="versicolor")
	{
	    versicolor_length++;
	}
	else if(data[i][0]==="virginica")
	{
	    virginica_length++;
	}
	for(var j=0;j<data[i].length;j++)
	{
	    if(i==0)
	    {
		tmp = 0;
		setosa_avgs.push(tmp);
		versicolor_avgs.push(tmp);
		virginica_avgs.push(tmp);
	    }
	    
	    if(data[i][0]==="setosa"&&j!=0){
		
		setosa_avgs[j]+=Number(data[i][j]);	    
	    }else if(data[i][0]==="versicolor"&&j!=0){
		versicolor_avgs[j]+=Number(data[i][j]);
	    }
	    else if(data[i][0]==="virginica"&&j!=0){
		virginica_avgs[j]+=Number(data[i][j]);
	    }
	}
    }
    for(var j=0; j<data[0].length;j++)
    {
	//calculate averages for each array
	setosa_avgs[j]=setosa_avgs[j]/setosa_length; 
	versicolor_avgs[j]=versicolor_avgs[j]/versicolor_length;
	virginica_avgs[j]=virginica_avgs[j]/virginica_length;
    }
}
function csv_draw_bars(species) {
   
    var avgs;
    if(species==="setosa")
    {
	avgs=[setosa_avgs];
    }else if(species==="versicolor")
    {
	avgs=[versicolor_avgs];
    }else if(species==="virginica")
    {
	avgs=[virginica_avgs];
    }
    else if(species==="all")
    {
	avgs=[setosa_avgs,versicolor_avgs,virginica_avgs];
    }
    
    
    createAllVerticies(avgs);
    
}

