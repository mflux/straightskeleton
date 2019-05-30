class Vertex{
  constructor(x, y){
    this.position = new Vector(x,y);
    this.active = true;
    this.bisector = undefined;
    this.prevVertex = undefined;
    this.nextVertex = undefined;
    this.prevEdge = undefined;
    this.nextEdge = undefined;
  }

  get x(){
  	return this.position.x;
  }

  get y(){
  	return this.position.y;
  }
}

function computeBisector(vertex){
  const {prevEdge, nextEdge} = vertex;
  const prevEdgeNorm = new Vector(prevEdge[1].x - prevEdge[0].x, prevEdge[1].y - prevEdge[0].y).normalize();
  const nextEdgeNorm = new Vector(nextEdge[1].x - nextEdge[0].x, nextEdge[1].y - nextEdge[0].y).normalize();
  return (new Vector(prevEdgeNorm.x + nextEdgeNorm.x, prevEdgeNorm.y + nextEdgeNorm.y)).normalize();
}