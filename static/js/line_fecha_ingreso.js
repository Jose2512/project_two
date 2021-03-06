//new

function renderGraph(dataset){

  var svgWidth = document.getElementById('mainLinechart').offsetWidth;
  var svgHeight = 450;
  
  var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  
  var svgArea = d3.select("#mainLinechart").select("svg");

  if (!svgArea.empty()) {
      svgArea.remove();
  }
  
  var svg = d3
    .select("#mainLinechart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "svg_line");
  
  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Initial Params
  var chosenYAxis = "CASOS_TOTALES";
  var linegraph   ="no"
  
  // function used for updating x-scale var upon click on axis label
  function xScale(ingData) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(ingData, d => d.FECHA) * 0.8,
        d3.max(ingData, d => d.FECHA * 1.2)
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }
  
  //  yLinearScale = yScale(ingData, chosenYAxis);
  
  function yScale(ingData, chosenYAxis) {
     // var chosenYAxis = "CASOS_TOTALES";
  
  
     if (chosenYAxis !=="CASOS_TOTALES") {
      // create scales
     var yLinearScale = d3.scaleLinear()
       .domain([d3.min(ingData, d => d[chosenYAxis]) * 0.8,
         d3.max(ingData, d => d[chosenYAxis]) 
       ])
        .range([height, 0]);
  
        
    
      } else {
          var yLinearScale = d3.scaleLinear()
       .domain([d3.min(ingData, d => d[chosenYAxis]) * 0.8,
         d3.max(ingData, d => d[chosenYAxis]) 
       ])
        .range([height, 0]);
        // console.log("d3.min(ingData,",d3.min(ingData, d => d[chosenYAxis]))
        // console.log("d3.min(ingData 2,",d3.max(ingData, d => d[chosenYAxis]))
        // console.log("ysacle",chosenYAxis)
  
      }
  
  
  
      return yLinearScale;
    
    }
  
  
  
  
  
  
   
  
  function xtScale(ingData) {
  
   var xTimeScale = d3.scaleTime()
   .domain(d3.extent(ingData, d => d.FECHA))
   .range([0, width]);
  
   return xTimeScale
  
  }
  
  
  
  //xAxis = renderAxes(xLinearScale, xAxis);
  // function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  
  
  // function used for updating xAxis var upon click on axis label
  function yrenderAxes(newYScale, yAxis) {
  
  
     // var bottomAxis = d3.axisBottom(newXScale);
      var leftAxis = d3.axisLeft(newYScale);
    
      yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
      return yAxis;
    }
    
  
  
  
  
  // function used for updating circles group with a transition to
  // new circles
  //circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
  
  function renderCircles(circlesGroup, newXScale, chosenYAxis ,vl_color) {
  
    if (vl_color == "pink") {
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newXScale(d[chosenYAxis]))
      .attr("fill", vl_color)
      //.attr("opacity", ".") 
    } else {
  
      circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newXScale(d[chosenYAxis]))
      .attr("fill", vl_color)
      .attr("opacity", ".6") 
  
  
    }
  
  
    return circlesGroup;
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenYAxis, circlesGroup) {
  
  
    
    var label;
  
    if (chosenYAxis === "CASOS_MUJERES") {
      label = "CASOS_MUJERES:";
    }
    else {
      label = "CASOS_HOMBRES:";
    }
  
   
     // date formatter to display dates nicely
  var dateFormatter = d3.timeFormat("%d-%b");
  
  // Step 1: Append tooltip div
    var toolclear = d3.select("div").select("tooltip")

    if (!toolclear.empty()) {
      toolclear.remove();
  }

  var toolTip = d3.select("body")
  .append("div")
  .classed("tooltip", true);
  
  
     // Step 2: Create "mouseover" event listener to display tooltip
     circlesGroup.on("mouseover", function(d) {
      //toolTip.style("display", "block")
      toolTip.transition()
      .duration(100)
      .style("opacity", 0.9);
       toolTip.html( `<strong>Fech: ${dateFormatter(d.FECHA)}` + `<hr> Pacientes: ${d[chosenYAxis]}`)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
    })
      // Step 3: Create "mouseout" event listener to hide tooltip
     .on("mouseout", function() {
       //toolTip.style("display", "none");
  
       toolTip.transition()
       .duration(100)
       .style("opacity", 0);
  
      }); // mouseover 
    
  
  
    return circlesGroup;
  }
  
  // pick the circle color for each option
  
  
  function  select_color(value) {
    switch(value) {
      case "CASOS_HOMBRES":
        vl_color = "blue";
        break;
      
       case "CASOS_MUJERES":
        vl_color = "#f781bf";
       
        break;
      default:
        vl_color = "black";
    }
    return vl_color
  }
  
  
  // creates the line
  function line_mot(chartGroup,ingData, xLinearScale,yLinearScale,chosenYAxis) //,bottomAxis,leftAxis)
  
  //chosenYAxis
  // .attr("cy", d => newXScale(d[chosenXAxis]))
   {
  
  // console.log("enter motion",chosenYAxis)
   
  // Line generators for each line
      var line1 = d3.line()
      .x(d => xLinearScale(d.FECHA))
      .y(d => yLinearScale(d[chosenYAxis]));
  
  
  
    // Append a path for line1
    var lpath =  chartGroup.append("path")
      .data([ingData])
      .attr("d", line1)
      //.attr("class", "line01")
      .attr("id","line01")
      .attr("stroke" , "black")
      .attr("stroke-width" , 2)
      .attr("fill", "none")
      .attr("opacity", ".7")
      .attr("stroke-dasharray", ("3, 3"));
      // console.log("line3")
  
  var totalLength = lpath.node().getTotalLength();
  
  lpath.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(10000)
      .ease(d3.easeLinear)  // check more options https://bl.ocks.org/d3noob/39e8263efd3db34c3bde486f9067a961
      .attr("stroke-dashoffset", 0);
  
      return lpath
  
  }
  
  var vl_measures12 = []
  
  function labelx_group(chartGroup, vl_measures) {
  
    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
      //  .attr("transform", `translate(${width/1.7 }, ${height  +20 })`);
  
      labelsGroup .append('rect')
       // .attr('class', "line green")
        .attr("id" ,"r1")
        .style("fill","blue")
        .attr("opacity", ".7")
        .attr('x', 3) //(w / 2) - (margin.middle * 3))
        .attr('y', 9)
        .attr('width', 12)
        .attr('height', 12); 
  
  
  
    var hLabel = labelsGroup.append("text")
      .attr("x", 18)
      .attr("y", 20)
      .attr("value", "CASOS_HOMBRES") // value to grab for event listener
      .classed("active", true)
      .text("Hombres");
  
      labelsGroup .append('rect')
     
       .attr("id" ,"r1")
       .style("fill","pink")
       .attr('x', 90) //(w / 2) - (margin.middle * 3))
       .attr('y', 9)
       .attr('width', 12)
       .attr('height', 12); 
  
  
    var mLabel = labelsGroup.append("text")
      .attr("x", 105)
      .attr("y", 20)
      .attr("value", "CASOS_MUJERES") // value to grab for event listener
      .classed("inactive", true)
      .text("Mujeres");
  
  
   
      labelsGroup .append('rect')
   
       .attr("id" ,"r1")
       .style("fill","black")
       .attr("opacity", ".7")
       .attr('x', 170) //(w / 2) - (margin.middle * 3))
       .attr('y', 9)
       .attr('width', 12)
       .attr('height', 12); 
  
  
      var totLabel = labelsGroup.append("text")
      .attr("x",185)
      .attr("y", 20)
      .attr("value", "CASOS_TOTALES") // value to grab for event listener
      .classed("inactive", true)
      .text("Acumulado");
  
 /*
      labelsGroup .append('rect')
   
       .attr("id" ,"r1")
       .style("fill","red")
       .attr("opacity", ".7")
       .attr('x', 3)//(w / 2) - (margin.middle * 3))
       .attr('y', 380)
       .attr('width', 12)
       .attr('height', 12); 
  
  
      var graphLabel = labelsGroup.append("text")
      .attr("x",30)
      .attr("y", 390)
      //.attr("value", "yes") // value to grab for event listener
      .classed("inactive", true)
      .text("Total Casos");
  */

  
  
    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height /1.5))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Casos por dia");
  
     var newlabelsGroup = chartGroup.append("g")
    /*  newlabelsGroup .append('rect')
      // .attr('class', "line green")
       .attr("id" ,"r1")
       .style("fill","blue")
       .attr("opacity", ".4")
       .attr('x', 65) //(w / 2) - (margin.middle * 3))
       .attr('y', 210)
       .attr('width', 100)
       .attr('height', 55); */


///Measures ====


     var rec_td =  newlabelsGroup .append('rect')
  
       .attr("id" ,"mr1")
       .style("fill","orange")
       .attr("opacity", ".4")
       .attr('x', 3) 
       .attr('y', 40)
       .attr('width', 12)
       .attr('height', 12); 

       var txt_td = newlabelsGroup.append("text")
       .attr("x", 20)
       .attr("y", 50)
       .html(`Total de Dias: ${vl_measures.totdays}`);

       var rec_tc =  newlabelsGroup .append('rect')
  
       .attr("id" ,"mr1")
       .style("fill","black")
       .attr("opacity", ".6")
       .attr('x', 20) 
       .attr('y', 88)
       .attr('width', 200)
       .attr('height', 12); 

       var txt_td = newlabelsGroup.append("text")
       .attr("x", 20)
       .attr("y", 80)
       .html(`Total de Casos: ${vl_measures.totc}`);


       var lwm =  (vl_measures.perm/100)* 200
       var rec_rm =  newlabelsGroup .append('rect')
       .attr("id" ,"mr1")
       .style("fill","pink")
       .attr("opacity", ".7")
       .attr('x', 20) 
       .attr('y', 104)
       .attr('width', lwm)
       .attr('height', 12); 

       var txt_pm = newlabelsGroup.append("text")
       .attr("x", 135)
       .attr("y", 114)
       .html(`%${vl_measures.perm}`);

       var txt_tm = newlabelsGroup.append("text")
       .attr("x", 180)
       .attr("y", 113)
       .html(`C:${vl_measures.totm}`);

       var txt_avgm = newlabelsGroup.append("text")
       .attr("x", 255)
       .attr("y", 113)
       .html(`P:${vl_measures.avgm}`);


       var lwh =  (vl_measures.perh/100)* 200
       var rec_rh =  newlabelsGroup .append('rect')
       .attr("id" ,"mr1")
       .style("fill","blue")
       .attr("opacity", ".7")
       .attr('x', 20) 
       .attr('y', 120)
       .attr('width', lwh)
       .attr('height', 12); 

       var txt_ph = newlabelsGroup.append("text")
       .attr("x", 135 )
       .attr("y", 134)
       .html(`%${vl_measures.perh}`);

       var txt_th = newlabelsGroup.append("text")
       .attr("x", 180 )
       .attr("y", 134)
       .html(`C:${vl_measures.toth}`);

       var txt_avgh = newlabelsGroup.append("text")
       .attr("x", 255)
       .attr("y", 134)
       .html(`P:${vl_measures.avgh}`);



  
  
  return labelsGroup
  
  } // labelx_group
  
 var vl_measures1 = []
  
  
  //get the maruse lines info
  function measures_info(ingData) {

    var  vl_tot_ch =0
    var  vl_tot_cm =0
    var  vl_tot_ct =0
    var vl_measures =[]
      for(let i = 0; i < ingData.length; i++)
      
      { 
       

  
      vl_tot_ch  += ingData[i].CASOS_HOMBRES
      vl_tot_cm  += ingData[i].CASOS_MUJERES
      vl_tot_ct  += ingData[i].CASOS_TOTALES
  
    }
  
    // console.log("Casos H tot", vl_tot_ch); // 6
    // console.log("Casos M tot", vl_tot_cm); // 6
    // console.log("Casos T tot", vl_tot_ct); // 6
  
  
  
  vl_perh = Math.round((vl_tot_ch/vl_tot_ct) * 100)
  // console.log("Per hombres",vl_perh);
  vl_perm = Math.round((vl_tot_cm/vl_tot_ct) * 100)
  // console.log("Per Mujeres",vl_perm);
  vl_tot_days =ingData.length
  // console.log("Tot_days",vl_tot_days);
  vl_avgh = Math.round ((vl_tot_ch/vl_tot_days) )
  // console.log("Avg h",vl_avgh );
  vl_avgm =Math.round ( (vl_tot_cm/vl_tot_days) )
  // console.log("Avg h",vl_avgm );
  
  vl_measures = {
  perh : vl_perh,
  perm : vl_perm ,
  totdays : vl_tot_days,
  avgh : vl_avgh,
  avgm : vl_avgm,
  totc :vl_tot_ct,
  toth :vl_tot_ch,
  totm :vl_tot_cm, 
  };
  
  vl_measures12 = vl_measures
  return vl_measures
   
  } //end measures_info
    
  



  
  
  
  // Retrieve data from the CSV file and execute everything below

  
    // Create a function to parse date and time
    var parseTime = d3.timeParse("%Y-%m-%d");
    // parse data
    // dataset1.forEach(function(data) {
    //   data.CASOS_HOMBRES = +data.CASOS_HOMBRES;
    //   data.CASOS_MUJERES = +data.CASOS_MUJERES;
    //   data.CASOS_TOTALES =+data.CASOS_TOTALES;
    //   // data.FECHA = parseTime(data.FECHA);
  
    // });
  
    // xLinearScale function above csv import
   // var xLinearScale = xScale(ingData, chosenXAxis);
  
   vl_measures =  measures_info(dataset1)
  
  var xTimeScale = xtScale(dataset1)
  var xLinearScale = xTimeScale
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(dataset1, d => d.CASOS_TOTALES)])
      .range([height, 0]);
      
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y-%m-%d"));
    var leftAxis = d3.axisLeft(yLinearScale);
  
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
     
  
      var yAxis = chartGroup.append("g")
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(dataset1)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.FECHA))
      .attr("cy", d => yLinearScale(d.CASOS_TOTALES )) //casos totales
      .attr("r", 4)
      .attr("fill", "black")
      .attr("opacity", ".7");
  
     // create the x labels
    var labelsGroup = labelx_group(chartGroup, vl_measures12)
  
  
  
    // updateToolTip function above csv import
   
    var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
    vl_graph = "1"
  
  // draw the line
   //var lpath = line_mot(chartGroup,ingData, xLinearScale,yLinearScale,chosenYAxis)
   
   var old_value = chosenYAxis
    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        
        var new_value = value
        
        // console.log("old value", old_value)
        // console.log("new value", new_value)
        old_value = new_value
        // console.log("old value===", old_value)
  
        if (value !== chosenYAxis) {
  
  
  
         // remove the line graph
         chartGroup.select("#line01").remove()
         // d3.select("#p2").style("color", "green");
  
        
           d3.selectAll(".tooltip")
          .style("visibility", "hidden")
  
          // replaces chosenXAxis with value  
          chosenYAxis = value;
         
  
          var  vl_color =  select_color(value);
    
      
  
          // functions here found above csv import
          // updates x scale for new data
         
  
          yLinearScale = yScale(dataset1, chosenYAxis);
  
  
          // updates x axis with transition
  
  
          yAxis = yrenderAxes(yLinearScale, yAxis);
  
  
  
  
  
          // updates circles with new x values
        
          circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis,vl_color);
  
  
          // updates tooltips with new info
          //circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
          circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
  
          
          
          var lpath = line_mot(chartGroup,dataset1, xLinearScale,yLinearScale,chosenYAxis)
      
  
  
        }  //end if
      });  // listener  labels group  */
  
  
    }
  
 

var dataset1= []



function loadgraphData(){
  var exampleData = d3.json("/case_date").then(function(data){
    var parseTime = d3.timeParse("%Y-%m-%d")
    dataset1=data;
    dataset1.forEach(function(data) {
      data.CASOS_HOMBRES = +data.CASOS_HOMBRES;
      data.CASOS_MUJERES = +data.CASOS_MUJERES;
      data.CASOS_TOTALES =+data.CASOS_TOTALES;
      data.FECHA = parseTime(data.FECHA);
      });  
      
      renderGraph(dataset1)
  })
}
  
loadgraphData();