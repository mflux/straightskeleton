class IntersectionPoint{
  constructor(position, origins, distanceToEdge){
    this.position = position;
    this.origins = origins;
    this.distanceToEdge = distanceToEdge;
  }

  get x() {
  	return this.position.x;
  }

  get y() {
  	return this.position.y;
  }
}


function findIntersection(vertex){

  const {prevVertex, nextVertex} = vertex;
  const {prevEdge, nextEdge} = vertex;
  const prevISectVertex = prevEdge[1];
  const nextISectVertex = nextEdge[1];

  let intersectionPrev;
  let intersectionPrevDistToEdge;
  const intersectionPrevPoint = intersectRay(vertex, vertex.bisector, prevISectVertex, prevISectVertex.bisector);

  if(intersectionPrevPoint!==undefined){
    intersectionPrevDistToEdge = distToSegment(intersectionPrevPoint, vertex, nextVertex);
    intersectionPrev = new IntersectionPoint(intersectionPrevPoint, [prevISectVertex, vertex], intersectionPrevDistToEdge);
  }


  let intersectionNext;
  let intersectionNextDistToEdge;
  const intersectionNextPoint = intersectRay(vertex, vertex.bisector, nextISectVertex, nextISectVertex.bisector);
  if(intersectionNextPoint!==undefined){
    intersectionNextDistToEdge = distToSegment(intersectionNextPoint, vertex, nextVertex);
    intersectionNext = new IntersectionPoint(intersectionNextPoint, [vertex, nextISectVertex], intersectionNextDistToEdge);
  }

  if(intersectionPrev===undefined){
    return intersectionNext;
  }
  else if(intersectionNext===undefined){
    return intersectionPrev;
  }

  if(intersectionPrevDistToEdge < intersectionNextDistToEdge){
    return intersectionPrev;
  }
  else{
    return intersectionNext;
  }
}


function intersectRay(as, ad, bs, bd){
  const u = (as.y*bd.x + bd.y*bs.x - bs.y*bd.x - bd.y*as.x ) / (ad.x*bd.y - ad.y*bd.x);
  const v = (as.x + ad.x * u - bs.x) / bd.x;

  if(u<0 || v<0){
    return undefined;
  }

  const ix = as.x + ad.x * u;
  const iy = as.y + ad.y * u;

  return new Vector(ix, iy);
}

function sqr(x) {
  return x * x
}

function dist2(v, w) {
  return sqr(v.x - w.x) + sqr(v.y - w.y)
}

function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);

  if (l2 == 0) return dist2(p, v);

  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);

  return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}

function distToSegment(p, v, w) {
  return Math.sqrt(distToSegmentSquared(p, v, w));
}

function closestPointOnSegment( p, a, b ) {

  var atob = { x: b.x - a.x, y: b.y - a.y };
  var atop = { x: p.x - a.x, y: p.y - a.y };
  var len = atob.x * atob.x + atob.y * atob.y;
  var dot = atop.x * atob.x + atop.y * atob.y;
  var t = Math.min( 1, Math.max( 0, dot / len ) );

  dot = ( b.x - a.x ) * ( p.y - a.y ) - ( b.y - a.y ) * ( p.x - a.x );

  return {
      point: {
          x: a.x + atob.x * t,
          y: a.y + atob.y * t
      },
      left: dot < 1,
      dot: dot,
      t: t
  };
}