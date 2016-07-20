var nodes = [];
var graphs = [];
var lastNode = null;
var statusOpts = {
		unconnected: "u",
		connected: "c",
		selected: "s"
};

//graphic variables
var radius = 20;
var connectedColor = '#52BAFF';   //blue
var selectedColor = '#F4FA58';	  //yellow
var unconnectedColor = '#FFFFFF'; //white

//initialize canvas and draw the background
var cvs = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var div = document.getElementById("container");
var header = document.getElementById("header");
var headerHeight = header.offsetHeight;
var headerMargin = parseInt(window.getComputedStyle(header).marginTop) * 2;
div.style.height = (window.innerHeight - headerHeight - headerMargin) + "px";
cvs.width = parseInt(window.getComputedStyle(div).width) - 400;
cvs.height = div.offsetHeight - 30;
document.getElementById('textarea').style.height = cvs.height + 'px';
drawGrid();

///////////////////
///CANVAS//////////
///////////////////
function redrawAll() {
	clearAll();
	drawGrid();

        //loop
	for(node in nodes) {
		nodes[node].drawNode();
                nodes[node].drawText();
	}
}

function clearAll() {
	ctx.clearRect (0,0,cvs.width,cvs.height);
}

function drawGrid() {
	ctx.beginPath();
	ctx.lineWidth = 1;

	for(var i = 2*radius, w = cvs.width; i <= w; i += 2*radius) {
		for(var c  = 2*radius, h = cvs.height; c <= h; c += 2*radius) {
			ctx.rect(i,c,1,1);
		}
	}

/*
function drawNodes(nodes) {}

function drawConnections(graphs)
*/
	ctx.stroke();
	ctx.closePath();
}

////////////////////
//NODE DEFINITION///
////////////////////
var Node = function(xPixel,yPixel) {
  	this.xPixel = xPixel;
 		this.yPixel = yPixel;
  	this.status = statusOpts.unconnected; //new nodes start white by default
  	this.neighbors = new Array();
  	this.visited = false;
}

Node.prototype.equalTo = function(someNode) {
	if(this.xPixel == someNode.xPixel && this.yPixel == someNode.yPixel) {
		 return true;
	}

	else return false;
}

Node.prototype.addNeighbor = function(someNode) {
        this.neighbors.push(someNode);
}

Node.prototype.removeNeighbor = function(someNode) {
	var i = this.neighbors.indexOf(someNode);
        return i != -1 ? this.neighbors.splice(i,1) : false;
}

Node.prototype.isNeighbor = function(someNode) {
	return this.neighbors.indexOf(someNode) == -1 ? false : true;
}

/*
Node.prototype.drawNode = function() {
	ctx.beginPath();
     	ctx.arc(this.xPixel, this.yPixel, radius, 0, 2 * Math.PI, false);
     	ctx.fillStyle = this.color;
      	ctx.fill();
      	ctx.setLineDash([]);
      	ctx.lineWidth = 2;
      	ctx.strokeStyle = '#000000';
	ctx.stroke();
	ctx.closePath();
}*//*

Node.prototype.drawText = function() {
        ctx.fillStyle = "#111111";
        ctx.font = "bold 11px Arial";
				if(this.distance[0] != 10000) {
        	var str = (Math.round(this.distance[0])).toString();
        	ctx.fillText(str, this.xPixel - 5, this.yPixel + 5);
				}
}
*/
////////////////////
//GRAPH DEFINITION//
////////////////////
var Graph = function() {
		this.nodePairs = [];
}

Graph.prototype.addPair = function(node1, node2) {
		if(!this.containsPair(node1, node2)){
			var distance = distFrom(node1.xCoord, node1.yCoord, node2.xCoord, node2.yCoord);
			this.nodePairs.push({pair: [node1, node2], final: false, dist: distance});
	  }
}

Graph.prototype.containsPair = function(node1, node2) {
	for(index in this.nodePairs) {
			var thisNode1 = this.nodePairs[index].pair[0];
			var thisNode2 = this.nodePairs[index].pair[1];

			if(thisNode1.equals(node1) && thisNode2.equals(node2) ||
			   thisNode1.equals(node2) && thisNode2.equals(node1)) {
					return true;
			}
	}
	return false;
}

Graph.prototype.containsNode = function(node) {
	for(index in this.nodePairs) {
			if(this.nodePairs[i].pair[0].equals(node) || this.nodePairs[i].pair[1].equals(node)) {
					return true;
			}
	}
	return false;
}

//////////////////
//EVENT HANDLERS//
//////////////////
function keyEvent(event) {
        dijkstra(nodes[0]);
        redrawAll();
}

function moveNode(i,event,edgesToMove) {
        var coords = canvas.relMouseCoords(event);
        moved = true;
        makingPath = false;
}

function moveNode(i,event,edgesToMove) {
        var coords = canvas.relMouseCoords(event);
        moved = true;
        makingPath = false;
        if(lastNode && lastNode.neighbors.length > 0) {
                lastNode.color = connectedColor;
        }
        else if(lastNode) {
                lastNode.color = unconnectedColor;
        }
        lastNode = null;

        nodes[i].xPixel = coords.x;
        nodes[i].yPixel = coords.y;

        for(edge in edgesToMove) {
                if(edgesToMove[edge][1] == 0) {
                	edgesToMove[edge][0].x1 = coords.x;
                        edgesToMove[edge][0].y1 = coords.y;
                }
                else {
                        edgesToMove[edge][0].x2 = coords.x;
                        edgesToMove[edge][0].y2 = coords.y;
                }
        }

redrawAll();
}

function mouseDown(event) {
        var coords = canvas.relMouseCoords(event);
        var loop = true;
        var i = 0;
        if(nodes.length > 0) {
		//loop through all nodes and see if any were clicked
                while(loop && i < nodes.length) {
		        var dist = distFrom(coords.x,coords.y,nodes[i].xPixel,nodes[i].yPixel);
                        //true if click was in node
			if(dist < radius) {
                                var edgesToMove = new Array();
				//loop through edges and push any that connect to clicked node
                                for(connect in edges) {
                                        var theIndex = edges[connect].nodesArr.indexOf(nodes[i]);
                                        if(theIndex == 0) {
                                                edgesToMove.push([edges[connect],0]);
                                        }
                                        else if(theIndex == 1) {
                                                edgesToMove.push([edges[connect],1]);
                                        }
                                }
				//attach mousemove listener to redraw node if dragged
                                cvs.onmousemove = function(event){moveNode(i,event,edgesToMove);};
                        loop = false;
                        }
                        else i++;
                }
        }
}

function mouseUp(event) {
        if(!moved) {

        moved = false;
        cvs.onmousemove = null;
        	var coords = canvas.relMouseCoords(event);

            	if(nodes.length == 0) {
		        var newNode = new Node(coords.x,coords.y);
		        nodes.push(newNode);
		        redrawAll();
		        return true;
	        }

	        else {
		        //check each existing node to make sure new node doesn't overlap
		        for(node in nodes) {
			        var dist = distFrom(coords.x,coords.y,nodes[node].xPixel,nodes[node].yPixel);

			        //if click is inside a node, fill the node
			        if(dist < radius) {
					//connects two nodes if one is currently selected && they arent already neighbors &&
				        //click isnt inside lastNode
					if(makingPath && !nodes[node].isNeighbor(lastNode) && !nodes[node].equalTo(lastNode)) {
					        var newConnect = new Connection(lastNode,nodes[node]);
					        edges.push(newConnect);
				        }
					//otherwise we are making path
				        else {
					        makingPath = true;
				        }

					//change color of last node if it was selected
					//TODO store status of each node in node maybe instead of color
				        if(lastNode) {
					        lastNode.color = connectedColor;
				        }

					//selected node clicked on
				        if(lastNode && nodes[node].equalTo(lastNode)) {
					        lastNode = null;
					        makingPath = false;
					        if(nodes[node].neighbors.length == 0) {
						        nodes[node].color = unconnectedColor;
					        }
					        redrawAll();
					        return 0;
				        }
				        else {
					        lastNode = nodes[node];
					        nodes[node].color = selectedColor;
					        redrawAll();
		          			return 0;
		          		}
		          	}

		          	//if new node would overlap
		          	else if(dist > radius && dist < 2 * radius) {
		          		makingPath = false;
		          		if(lastNode) {
		          			lastNode.color = connectedColor;
		          		}
		          		lastNode = null;
				        redrawAll();
		          		return 0;
		          	}
		        }

		        if(!makingPath) {
			        var newNode = new Node(coords.x,coords.y);
			        nodes.push(newNode);
			        newNode.color = unconnectedColor;
			        redrawAll();
			        return 1;
		        }
		        else {
			        makingPath = false;
			        if(lastNode != null) {
		          		lastNode.color = connectedColor;
		          	}
			        lastNode = null;
			        redrawAll();
			        return 0;
		        }
	        }
        }

        moved = false;
        cvs.onmousemove = null;
}

//////////////////
//HELPER METHODS//
//////////////////
makeNeighbors = function(node1,node2) {
	node1.addNeighbor(node2);
        node2.addNeighbor(node1);
}

distFrom = function(x1,y1,x2,y2) {
	return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
}

//capture event coordinates within canvas
function relMouseCoords(event){
    	var totalOffsetX = 0;
    	var totalOffsetY = 0;
    	var canvasX = 0;
    	var canvasY = 0;
    	var currentElement = this;

    	do{
        	totalOffsetX += currentElement.offsetLeft;
        	totalOffsetY += currentElement.offsetTop;
    	}

    	while(currentElement = currentElement.offsetParent)

    	canvasX = event.pageX - totalOffsetX;
    	canvasY = event.pageY - totalOffsetY;
    	return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

//TODO
//function reset() {
        //for(node in nodes) {

	//}
//}

//////////////
//ALGORITHMS//
//////////////

function dijkstra(aNode) {
        var finalVertices = new Array();
        var finaledgesToMove = new Array();
        var done = false;
        var sourceNode = aNode;

        sourceNode.distance = [0,null];
        finalVertices.push(sourceNode);
        while(!done) {

                var minNode = null;
		//cycle trough current node's neighbors
                for(node in sourceNode.neighbors) {
			//if neighbor node has already been finalized
                        if(finalVertices.indexOf(sourceNode.neighbors[node]) != -1) {
                                continue;
                        }


                        tmpDist = sourceNode.distance[0] + distFrom(sourceNode.xPixel,sourceNode.yPixel,
                                                                sourceNode.neighbors[node].xPixel,sourceNode.neighbors[node].yPixel);

			//if ditance to neighbor is shorter than its current shortest distance, replace it
                        if(tmpDist < sourceNode.neighbors[node].distance[0]) {
                                sourceNode.neighbors[node].distance = [tmpDist,sourceNode];
                        }

			//executes if this is not first neighbor checked
                        if(minNode) {
                                if(tmpDist < minNode.distance[0]) {
                                        minNode = sourceNode.neighbors[node];
                                }
                        }
			//if this is first neighbor checked, mark it minimum node(shortest distance)
                        else {
                                minNode = sourceNode.neighbors[node];
                        }
                }

		//
                if(minNode) {
			//cycle through all edges and find the one that connects minimum node with source node
                        for(connect in edges) {
                                index1 = edges[connect].nodesArr.indexOf(minNode);
                                index2 = edges[connect].nodesArr.indexOf(minNode.distance[1]);
                                if(index1 != -1 && index2 != -1) {
                                        edges[connect].lineDash = []; //make these a "status" attribute
                                        edges[connect].lineWidth = 2;
                                }
                        }
                }

								//if all nodes have been finalized
                if(finalVertices.length >= nodes.length) {
                        done = true;
                }

                if(minNode) {
                        finalVertices.push(minNode);
                        for(node in minNode.neighbors) {
                            tmpDist = minNode.distance[0] + distFrom(minNode.xPixel,minNode.yPixel,
                                                                minNode.neighbors[node].xPixel,minNode.neighbors[node].yPixel);
                                if(tmpDist < minNode.neighbors[node].distance[0]) {
                                        minNode.neighbors[node].distance = [tmpDist,minNode];
                                }
                        }
                        minNode.color = "#FFFFFF";
                        minNode = null;
                }
                for(node in nodes) {
                        var index = finalVertices.indexOf(nodes[node]);

                        if(!minNode && index == -1) {
                                minNode = nodes[node];
                        }
                        if(index == -1) {
                                if(nodes[node].distance[0] < minNode.distance[0]) {
                                       minNode = nodes[node];
                                }
                        }

                }


                if(minNode) {
                        finalVertices.push(minNode);
                        minNode.color = "#FFFFFF";
                        sourceNode = minNode;
                }
                if(finalVertices.length >= nodes.length) {
                        done = true;
                }
                if(minNode) {
                        for(connect in edges) {
                                index1 = edges[connect].nodesArr.indexOf(minNode);
                                index2 = edges[connect].nodesArr.indexOf(minNode.distance[1]);
                                if(index1 != -1 && index2 != -1) {
                                        edges[connect].lineDash = [];
                                        edges[connect].lineWidth = 2;
                                }
                        }
                }
                redrawAll();
        }
} 
