//node and graph variables
var nodes = [];
var graph = new Graph();
var selectedNode = null;
var dragged = false;
var statusOpts = {
		unselected: '#52BAFF',
		selected: '#003366'
};

//graphic variables
var radius = 20;

//initialize and size elements
var cvs = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var div = document.getElementById("container");
var header = document.getElementById("header");
var textarea = document.getElementById('textarea');

var headerHeight = header.offsetHeight;
var headerMargin = parseInt(window.getComputedStyle(header).marginTop) * 2;

div.style.height = (window.innerHeight - headerHeight - headerMargin) + "px";
cvs.width = parseInt(window.getComputedStyle(div).width) - 350;
cvs.height = div.offsetHeight - 30;
textarea.style.height = cvs.height + 'px';

drawGrid();

///////////////////
///CANVAS//////////
///////////////////
function redrawAll() {
	clearAll();
	drawGrid();
	drawConnections();
	drawNodes();
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

function drawNodes() {
	for(node in nodes) {
		ctx.beginPath();
		ctx.arc(nodes[node].xPixel, nodes[node].yPixel, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = nodes[node].status;
		ctx.shadowColor = '#999';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
		ctx.fill();
		ctx.setLineDash([]);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#000000';
		ctx.stroke();
		ctx.closePath();
	}
}

function drawConnections() {
	for(graph in graphs) {
		for(pair in graphs[graph].nodePairs) {

			if(graphs[graph].nodePairs[pair].final) {
				ctx.setLineDash([]);
			}

			else {
				ctx.setLineDash([10,15]);
			}

			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#000000';
			ctx.moveTo(graphs[graph].nodePairs[pair].pair[0].xPixel,
									graphs[graph].nodePairs[pair].pair[0].yPixel);
			ctx.lineTo(graphs[graph].nodePairs[pair].pair[1].xPixel,
									graphs[graph].nodePairs[pair].pair[1].yPixel)
			ctx.stroke();
			ctx.shadowColor = '#999';
			ctx.shadowBlur = 20;
			ctx.shadowOffsetX = 5;
			ctx.shadowOffsetY = 5;
			ctx.fill();
			ctx.closePath();
		}
	}
}

////////////////////
//NODE DEFINITION///
////////////////////
var Node = function(xPixel,yPixel) {
  	this.xPixel = xPixel;
 		this.yPixel = yPixel;
  	this.status = statusOpts.unselected; //new nodes start white by default
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
			makeNeighbors(node1, node2);
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
			if(this.nodePairs[i].pair[0].equals(node) ||
			   this.nodePairs[i].pair[1].equals(node)) {
					return true;
			}
	}
	return false;
}

Graph.prototype.getNeighbors(node) {
	var result = [];
	for(index in nodePairs) {
		if(nodePairs[index].pair[0].equals(node) ||
			 nodePairs[index].pair[0].equals(node)) {
					result.push(nodePairs[index]);
		}
	}
	
	return result;
}

//////////////////
//EVENT HANDLERS//
//////////////////
function keyEvent(event) {

}

function mouseDown(event) {
  var coords = canvas.relMouseCoords(event);
  var loop = true;
  var i = 0;
	while(loop && i < nodes.length) {
	   var dist = distFrom(coords.x,coords.y,nodes[i].xPixel,nodes[i].yPixel);
	   //true if click was in node
		 if(dist < radius) {
        selected.status = statusOpts.unselected;
        selected = nodes[i];
        selected.status = statusOpts.selected;
	      cvs.onmousemove = function(event){moveNode(i,event);};
	      loop = false;
	   }
	   else i++;
	}
}

function moveNode(node,event) {
  var coords = canvas.relMouseCoords(event);
  dragged = true;

  nodes[i].xPixel = coords.x;
  nodes[i].yPixel = coords.y;

  redrawAll();
}

function mouseUp(event) {
        if(!dragged) {
        	dragged = false;
        	cvs.onmousemove = null;
        	var coords = canvas.relMouseCoords(event);

        	if(nodes.length == 0) {
		      	var newNode = new Node(coords.x,coords.y);
		      	nodes.push(newNode);
		      	redrawAll();
	      	}

	      	else {
		      //check each existing node to make sure new node doesn't overlap
		      	for(node in nodes) {
			    		var dist = distFrom(coords.x,coords.y,nodes[node].xPixel,nodes[node].yPixel);

			    		//if click is inside a node, fill the node
			    		if(dist < radius) {
                if(selected) {
                  graph.addPair(selected, nodes[node]);
                  selected.status = statusOpts.unselected;
                }
                selected = nodes[node];
                selected.status = statusOpts.selected;
                break;
		          }

		          	//if new node would overlap
		          else if(dist > radius && dist < 2 * radius) {
		          	if(selected) {
		          		selected.status = statusOpts.unselected;
		          	}
		          	selected = null;
		          }
		        }

		        if(!selected) {
			        var newNode = new Node(coords.x,coords.y);
			        nodes.push(newNode);
		        }

		        else {
              selected.status = statusOpts.unselected;
			        selected = null;
		        }
	        }
        }

        dragged = false;
        cvs.onmousemove = null;
        redrawAll();
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
/*
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
} */
