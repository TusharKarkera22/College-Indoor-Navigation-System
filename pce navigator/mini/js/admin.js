$(document).ready(function(){
	var c = 1;
	var fixArch = "A";
	var varArch = 1;
	var consideredId = 0;
	var consideredArchId = 0;
	var background, vis, drag;
	var px, py, dx, dy;
	var dijkstra;
	var startpath, endpath;

	vis = d3.select('svg');

	background = vis.append('rect').attr('class', 'background').attr('width', vis.attr('width')).attr('height', vis.attr('height'));

	/* Initialize db */
	var graph = {
      node: [],
      arch: []
	};

	graph.node = TAFFY();
	graph.arch = TAFFY();

	function ArchFindStart(gra, asd) {
		var as = [];

		for (var i = 0; i < gra.arch({start: asd}).get(0).length; i++) {
			as[i] = gra.arch({start: asd}).get(0)[i].id;
		}
		return as;
	}

	function ArchFindEnd(gra, asd) {
		var ae = [];

		for (var i = 0; i < gra.arch({end: asd}).get(0).length; i++) {
			ae[i] = gra.arch({end: asd}).get(0)[i].id;
		}
		return ae;
	}

	function Map (gra) {
		
		var road;
		var nameConsNode, start, end;
		
		road = "{";
		for (var i = 0; i < gra.node().get(0).length; i++) {

			nameConsNode = gra.node().get()[i].label;
			start = ArchFindStart(gra, nameConsNode);
			end = ArchFindEnd(gra, nameConsNode);

			road = road + gra.node().get()[i].label + ":{"; 
			
			for (var j = 0; j < start.length; j++ ) {
				if ( j != start.length - 1) {
					road = road + gra.arch({id: start[j]}).first().end + ": " + gra.arch({id: start[j]}).first().len + ", ";
				} else {
					road = road + gra.arch({id: start[j]}).first().end + ": " + gra.arch({id: start[j]}).first().len;
				}
			}
			if (start.length != 0 && end.length != 0) {
				road = road + ", ";
			}
			for (var j = 0; j < end.length; j++ ) {
				if (j != end.length - 1) {
					road = road + gra.arch({id: end[j]}).first().start + ": " + gra.arch({id: end[j]}).first().len + ", ";
				} else {
					road = road + gra.arch({id: end[j]}).first().start + ": " + gra.arch({id: end[j]}).first().len
				}
			}
			road = road + "}";
			if (i != gra.node().get(0).length - 1) {
				road = road + ","
			}
		}

		road = road + "}";

		road = JSON.stringify(eval("("+ road +")"));

		var arrayroad = JSON.parse(road);
		return arrayroad;
	}

	function lenXY (a, b) {
		var f;
		if (a >= b) {
			f = a - b;
		} else {
			f = b - a;
		}
		return f;
	}

	function ArchLength (px, py, dx, dy) {
		var l, lx, ly;
		// Take the max and min for x and y
		lx = lenXY(px, dx);
		ly = lenXY(py, dy);
		var sum = Math.pow(lx, 2) + Math.pow(ly, 2);
		l = Math.sqrt(sum);
		return parseInt(l);
	}

	/* On click of Manage Node*/
	$("#node").click(function() {
		$('#create').css("display", "none");
		$('#menagenode').css("display", "block");
	});

	/* On click of Admin Interface */
	$("#admininterface").click(function(){
		$('#create').css("display", "block");
		$("#SelInterface").css("display", "none");
	});

	$("#choiseinterface").click(function(){
		$('#create').css("display", "none");
		$("#SelInterface").css("display", "block");
	});

	/* On click of New Node*/
	$("#newnode").click(function(){
		$('#menagenode').css("display", "none");
		$('#createnode').css("display", "block");
		
		drag = d3.behavior.drag().on('drag', function() {
			$('#x').val(parseInt(d3.event.x));
			$('#y').val(parseInt(d3.event.y));
	    	/* move the circle */      
	    	return d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
	 	});
	    vis.append('circle').attr('id', c).attr('class', 'created').attr('r', 10).attr('cx', 50).attr('cy', 40).style("fill", "red").call(drag);
	    $('#assignedId').val(c);
	    $('#x').val("50");
	    $('#y').val("40");
	    $('#label').val("N" + c);
		$('#note').val("");
	});

	/* On click of Save Node */
	$("#savenode").click(function(){
		$('#createnode').css("display", "none");
		$('#create').css("display", "block");
		var id = $('#assignedId').val();
		var x = $('#x').val();
		var y = $('#y').val();
		var label = $('#label').val();
		var note = $('#note').val();

		var nodeDel = vis.select(".created");
		nodeDel.remove();

		graph.node.insert({id: id, label: label, x: x, y: y, note: note});

		vis.append('circle').attr('id', c).attr('class', 'point').attr('r', 10).attr('cx', x).attr('cy', y);

		//graph.node().each(function (r) {console.log(r)});
		c++;

		$('#assignedId').val("");
		$('#x').val("");
		$('#y').val("");
		$('#label').val("");
		$('#note').val("");
	});

	/* On click of Cancel on New Node */
	$('#goBackNewNode').click(function(){
		$('#createnode').css("display", "none");
		$('#create').css("display", "block");

		var nodeDel = vis.select(".created");
		nodeDel.remove();

		$('#assignedId').val("");
		$('#x').val("");
		$('#y').val("");
		$('#label').val("");
		$('#note').val("");
	});

	/* On click of Modify Node*/
	$("#modnode").click(function(){
		if(graph.node().distinct("id").length >= 1) {
			$('#menagenode').css("display", "none");
			$('#modifynode').css("display", "block");

			$('.point').css("fill", "green");

			var allCircles = vis.selectAll('circle');
	       
			$(allCircles[0]).bind('click', function(){
				consideredId = this.id;
				$('#assignedIdOnMod').val(this.id);
				$('#xOnMod').val(graph.node({id: this.id}).first().x);
				$('#yOnMod').val(graph.node({id: this.id}).first().y);
				$('#labelOnMod').val(graph.node({id: this.id}).first().label);
				$('#noteOnMod').val(graph.node({id: this.id}).first().note);
				drag = d3.behavior.drag().on('drag', function() {
					$('#xOnMod').val(parseInt(d3.event.x));
					$('#yOnMod').val(parseInt(d3.event.y));
		    		/* move the circle */      
		    		return d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
		 		});
				d3.select(this).style("fill", "red").attr("class", "selected").call(drag);
				$('.point').css("fill", "blue");
				$(allCircles[0]).unbind('click');
			});
		} else {
			alert("You have to create at least one node for modifying nodes")
		}
	});

	/* On click of Save Node of Modify */
	$('#modifySelNode').click(function(){
		$('#modifynode').css("display", "none");
		$('#create').css("display", "block");

		var idOM = $('#assignedIdOnMod').val();
		var xOM = $('#xOnMod').val();
		var yOM = $('#yOnMod').val();
		var labelOM = $('#labelOnMod').val();
		var noteOM = $('#noteOnMod').val();

		var modifynode = vis.select('.selected');
		modifynode.remove();

		
		graph.node({id: idOM}).remove();
		graph.node.insert({id: idOM, label: labelOM, x: xOM, y: yOM, note: noteOM});

		vis.append('circle').attr('id', idOM).attr('class', 'point').attr('r', 10).attr('cx', xOM).attr('cy', yOM);
		$('.point').css("fill", "blue");

		$('#assignedIdOnMod').val("");
		$('#xOnMod').val("");
		$('#yOnMod').val("");
		$('#labelOnMod').val("");
		$('#noteOnMod').val("");

		graph.node().each(function (r) {console.log(r)});
	});


	/* On click of Delete Node of Modify */
	$('#deleteSelNode').click(function(){
		$('#modifynode').css("display", "none");
		$('#create').css("display", "block");

		var deletenode = vis.select('.selected');
		var idOM = $('#assignedIdOnMod').val();
			
		var DelArchS = graph.arch({start:graph.node({id: idOM}).first().label}).get();
		var DelArchE = graph.arch({end:graph.node({id: idOM}).first().label}).get();
			
		for(var i=0; i<graph.arch({start:graph.node({id: idOM}).first().label}).count();i++){
			element = document.getElementById(DelArchS[i].id);
			if(element)element.parentNode.removeChild(element);
		}

		for(var i=0; i<graph.arch({end:graph.node({id: idOM}).first().label}).count();i++){
			element = document.getElementById(DelArchE[i].id);
			if(element)element.parentNode.removeChild(element);
		}

		graph.arch({start:graph.node({id: this.id}).first().label}).remove();
		graph.arch({end:graph.node({id: this.id}).first().label}).remove();

		deletenode.remove();
		graph.node({id: idOM}).remove();

		$('#assignedIdOnMod').val("");
		$('#xOnMod').val("");
		$('#yOnMod').val("");
		$('#labelOnMod').val("");
		$('#noteOnMod').val("");
				
		//graph.node().each(function (r) {console.log(r)});
	});

	/* On click of Cancel */
	$('#goBack').click(function(){
		$('#modifynode').css("display", "none");
		$('#menagenode').css("display", "block");

		$('.point').css("fill", "blue");

		if (consideredId != 0){
			var backposition = vis.select('.selected');
			backposition.remove();

			vis.append('circle').attr('id', consideredId)
								.attr('class', 'point')
								.attr('r', 10)
								.attr('cx', graph.node({id: consideredId}).first().x)
								.attr('cy', graph.node({id: consideredId}).first().y);
 		}

 		consideredId = 0;

 		$('#assignedIdOnMod').val("");
		$('#xOnMod').val("");
		$('#yOnMod').val("");
		$('#labelOnMod').val("");
		$('#noteOnMod').val("");
	});

	/* On click on Cancel Manage Node */
	$("#BackToGraphN").click(function(){
		$('#menagenode').css("display", "none");
		$('#create').css("display", "block");

	});


	/* On click of Manage Arch*/
	$("#arch").click(function() {
		$('#create').css("display", "none");
		$('#menagearch').css("display", "block");


	});

	/* On click of New Arch*/
	$("#newarch").click(function() {
		if (graph.node().distinct("id").length > 1) {
			$('#menagearch').css("display", "none");
			$('#addingArch').css("display", "block");

			$('#archId').val(fixArch + varArch);

			$("#selStaNode").unbind('click');
			$("#selStaNode").click(function(){
				var allCircles = vis.selectAll('circle');

				$('.point').css("fill", "green");

				$(allCircles[0]).bind('click', function(){
					px = parseInt(graph.node({id: this.id}).first().x);
					py = parseInt(graph.node({id: this.id}).first().y);
					$("#startnode").val(graph.node({id: this.id}).first().label);
					$(allCircles[0]).unbind('click');
					$('.point').css("fill", "blue");
				});
			});

			$("#selEndNode").unbind('click');
			$("#selEndNode").click(function(){
				var allCircles = vis.selectAll('circle');

				$('.point').css("fill", "green");

				$(allCircles[0]).bind('click', function(){
					dx = parseInt(graph.node({id: this.id}).first().x);
					dy = parseInt(graph.node({id: this.id}).first().y);
					$("#endnode").val(graph.node({id: this.id}).first().label);
					$(allCircles[0]).unbind('click');
					$('.point').css("fill", "blue");
				});
			});

			$("#calLength").unbind('click');
			$("#calLength").click(function(){
				if (($("#startnode").val() != "No node") && ($("#endnode").val() != "No node")) {
					$("#length").val(ArchLength (px, py, dx, dy));

					vis.append("line").attr('id', $('#archId').val())
									  .attr('class', 'createArch')
									  .attr('x1', px)
									  .attr('y1', py)
									  .attr('x2', dx)
									  .attr('y2', dy)
									  .attr('stroke', 'black');
				} else {
					alert("You have to set the strarting and the endig nodes to calculate the lenght of link")
				}
			});


		} else {
			alert("You have to create at least two nodes to create an link");
		}
	});

	/* On click of Save Node in Create New Link */
	$('#savearch').click(function(){
		if (($("#startnode").val() != "No node") && ($("#endnode").val() != "No node") && ($("#length").val() != "Select connected nodes")) {
			$('#addingArch').css("display", "none");
			$('#create').css("display", "block");

			var arId = $('#archId').val();
			var start = $("#startnode").val();
			var end = $("#endnode").val();
			var len = $("#length").val();
			var Anote = $("#notearchs").val();

			vis.select(".createArch").remove();
			vis.append("line").attr('id', arId)
							.attr('class', 'allLine')
							.attr('x1', px)
							.attr('y1', py)
							.attr('x2', dx)
							.attr('y2', dy)
							.attr('stroke', 'black');

			graph.arch.insert({id: arId, start: start, end: end, len: len, note: Anote});
			
			$('#archId').val("");
			$("#startnode").val("No node");
			$("#endnode").val("No node");
			$("#length").val("Select connected nodes");
			$("#notearchs").val("");
			px = 0;
			dx = 0;
			py = 0;
			dy = 0;
			varArch++;

			//graph.arch().each(function (r) {console.log(r)})
		} else {
			alert("You need to insert the connected nodes and calculate the distance between them to save the link");
		}
	});

	/* On click of Cancel on Create New Link */
	$('#goBackNewArch').click(function(){
		$('#addingArch').css("display", "none");
		$('#menagearch').css("display", "block");

		vis.select(".createArch").remove();

		$('#archId').val("");
		$("#startnode").val("No node");
		$("#endnode").val("No node");
		$("#length").val("Select connected nodes");
		$("#notearchs").val("");
		px = 0;
		dx = 0;
		py = 0;
		dy = 0;
	});

	/* On click of Menu Delete Links */
	$('#modarch').click(function(){
		if(graph.arch().distinct("id").length >= 1) {
			$('#menagearch').css("display", "none");
			$('#modifyarchs').css("display", "block");

			vis.selectAll("line").attr('stroke', 'green').attr('stroke-width', '4px');
			var allArch = vis.selectAll("line");

			$(allArch[0]).bind('click', function(){
				consideredArchId = this.id;
				$("#archIdOM").val(consideredArchId);
				$('#startnodeOM').val(graph.arch({id: this.id}).first().start);
				$('#endnodeOM').val(graph.arch({id: this.id}).first().end);
				$('#lengthOM').val(graph.arch({id: this.id}).first().len);
				$('#notearchsOM').val(graph.arch({id: this.id}).first().note);

				allArch.attr('stroke', 'black').attr('stroke-width', '1px');
				d3.select(this).attr("stroke", "red").attr('stroke-width', '3px').attr("class", "selectedArch");
				d3.selectAll('.createArch').attr('stroke', 'black').attr('stroke-width', '1px');
				$(allArch[0]).unbind('click');
			});

		} else {
			alert("There isn't any link to modify")
		}
	});

	/* On click of Effective Delete Link */
	$('#deleteSelArch').click(function(){
		$('#modifyarchs').css("display", "none");
		$('#create').css("display", "block");

		var arId = $('#archIdOM').val();
		
		graph.arch({id: arId}).remove();
		vis.select('.selectedArch').remove();
			
		$('#archIdOM').val("");
		$("#startnodeOM").val("No node");
		$("#endnodeOM").val("No node");
		$("#lengthOM").val("Select connected nodes");
		$("#notearchsOM").val("");

		consideredArchId = 0;
	});

	/* On click of Cancel on Delete Link */
	$('#goBackArch').click(function(){
		$('#modifyarchs').css("display", "none");
		$('#menagearch').css("display", "block");

		$('.allLine').attr('stroke', 'black').attr('stroke-width', '1px');

		if (consideredArchId != 0) {
			vis.select(".selectedArch").remove();
			vis.append("line").attr('id', consideredArchId)
						.attr('class', 'allLine')
						.attr('x1', graph.node({label: graph.arch({id: consideredArchId }).first().start}).first().x )
						.attr('y1', graph.node({label: graph.arch({id: consideredArchId }).first().start}).first().y )
						.attr('x2', graph.node({label: graph.arch({id: consideredArchId }).first().end}).first().x )
						.attr('y2', graph.node({label: graph.arch({id: consideredArchId }).first().end}).first().y )
						.attr('stroke', 'black');

			consideredArchId = 0;

			$('#archIdOM').val("");
			$("#startnodeOM").val("No node");
			$("#endnodeOM").val("No node");
			$("#lengthOM").val("Select connected nodes");
			$("#notearchsOM").val("");
		}
	});

	/* On click on Cancel Manage Links */
	$("#BackToGraphA").click(function(){
		$('#menagearch').css("display", "none");
		$('#create').css("display", "block");

	});

	/* On click of User Interface */
	$("#userinterface").click(function(){
		if (graph.arch().distinct("id").length >= 1) {
			$("#SelInterface").css("display", "none");
			$('#UsingMapForm').css("display", "block");

			var stringForDJ = Map(graph);
				
			dijkstra = new Graph(stringForDJ);

			//console.log(dijkstra.findShortestPath('N1', 'N2'));

			$("#USERselStaNode").unbind('click');
			$("#USERselStaNode").click(function(){
				var allCircles = vis.selectAll('circle');

				$('.point').css("fill", "green");

				$(allCircles[0]).bind('click', function(){
					startpath = graph.node({id: this.id}).first().label;
					$("#USERstartnode").val(graph.node({id: this.id}).first().label);
					$(allCircles[0]).unbind('click');
					$('.point').css("fill", "blue");
				});
			});

			$("#USERselEndNode").unbind('click');
			$("#USERselEndNode").click(function(){
				var allCircles = vis.selectAll('circle');
				$('.point').css("fill", "green");

				$(allCircles[0]).bind('click', function(){
					endpath = graph.node({id: this.id}).first().label;
					$("#USERendnode").val(graph.node({id: this.id}).first().label);
					$(allCircles[0]).unbind('click');
					$('.point').css("fill", "blue");
				});
			});
		} else {
			alert("There is no map to use, create one to enter in this interface.");
		}
	});

	/* On click of Calculate path */
	$("#calculatePath").click(function(){
		if ( $("#USERstartnode").val() != "No node" || $("#USERendnode").val() == "No node" ) {
			var allpath = dijkstra.findShortestPath(startpath, endpath);

			if (allpath != null) {
				
				var distance = 0;

				for (var i = 0; i < allpath.length - 1; i++) {
					for (var j = 0; j < graph.arch().get(0).length; j++) {
						if (((graph.arch().get(0)[j].start == allpath[i]) && (graph.arch().get(0)[j].end == allpath[i + 1])) || 
							((graph.arch().get(0)[j].start == allpath[i + 1]) && (graph.arch().get(0)[j].end == allpath[i])) )  {
							var element = document.getElementById(graph.arch().get(0)[j].id);
							distance += parseInt(graph.arch().get(0)[j].len);
							element.setAttribute("stroke", "red")
							element.setAttribute("stroke-width", "3px");
							break;
						}
					}
				}

				$("#USERlength").val(distance);

			} else {
				alert("There is no path to arrive to the selcted node");
			}
		} else {
			alert("Select the start and the end nodes to calculate the path");
		}
	});	

	/* On click of Cancel on User Div */
	$("#goBackMain").click(function (){
		$("#SelInterface").css("display", "block");
		$('#UsingMapForm').css("display", "none");

		for (var j = 0; j < graph.arch().get(0).length; j++) {
			var element = document.getElementById(graph.arch().get(0)[j].id);
			element.setAttribute("stroke", "black")
			element.setAttribute("stroke-width", "1px");
		}

		$("#USERlength").val("");
		$("#USERendnode").val("No node");
		$("#USERstartnode").val("No node");
		
	});

	/* On click of reset */
	$("#reset").click(function(){
		$("#USERlength").val("");
		$("#USERendnode").val("No node");
		$("#USERstartnode").val("No node");

		for (var j = 0; j < graph.arch().get(0).length; j++) {
			var element = document.getElementById(graph.arch().get(0)[j].id);
			element.setAttribute("stroke", "black")
			element.setAttribute("stroke-width", "1px");
		}
	});
});
