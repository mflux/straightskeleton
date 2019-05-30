const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '18px arial';

function stroke(c, w=1){
	ctx.strokeStyle = c;
  ctx.lineWidth = w;
}

function fill(c){
  if(c==='none'){
    c = 'transparent';
  }
  ctx.fillStyle = c;
}

function drawCircle(x, y, r=4){
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);

  if(ctx.fillStyle !== 'transparent')
    ctx.fill();

  if(ctx.strokeStyle!=='transparent')
    ctx.stroke();
}

function drawLine(sx,sy,ex,ey){
	ctx.beginPath();
  ctx.moveTo(sx,sy);
  ctx.lineTo(ex,ey);
  ctx.stroke();
}

function drawPath(path){
  stroke('rgba(0,0,0,0.5)');
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for(let i=1; i<path.length; i++){
    const vertex = path[i];
    ctx.lineTo(vertex.x, vertex.y);
  }
  ctx.lineTo(path[0].x, path[0].y);
  ctx.stroke();

  fill('black');
  stroke('none');
  path.forEach((vertex)=>{
    drawCircle(vertex.x, vertex.y, 2);
  });
}

function drawLAVVertices(lav){
  if(lav.vertices.length<=0){
    return;
  }
  stroke('black');
  ctx.beginPath();
  ctx.moveTo(lav.vertices[0].x, lav.vertices[0].y);
  for(let i=1; i<lav.vertices.length; i++){
    const vertex = lav.vertices[i];
    ctx.lineTo(vertex.x, vertex.y);
  }
  ctx.lineTo(lav.vertices[0].x, lav.vertices[0].y);
  ctx.stroke();

  fill('black');
  stroke('none');
  lav.vertices.forEach((vertex, index)=>{
    drawCircle(vertex.x, vertex.y, 2);
    // ctx.fillText(index.toString(), vertex.x-12, vertex.y+12);
  });
}

const bisectorDrawDistance = 1000;
function drawBisectors(lav){
  stroke('green');
  ctx.setLineDash([2,4]);
  lav.vertices.forEach((vertex)=>{
    if(vertex.active===false){
      return;
    }
    drawLine(vertex.x, vertex.y, vertex.x + vertex.bisector.x * bisectorDrawDistance, vertex.y + vertex.bisector.y * bisectorDrawDistance);
  });
  ctx.setLineDash([]);
}

function drawQueue(lav){
  stroke('blue');
  fill('none');

  lav.queue.forEach((intersection, index)=>{
    if(index===0){
      stroke('blue', 2);
    }
    else{
      stroke('rgba(0,0,255,0.5)');
    }
    drawCircle(intersection.x, intersection.y, 4);
  });

  stroke('none');
  fill('blue');
  //ctx.font = '18px';
  lav.queue.forEach((intersection,index)=>{
    if(index!==0){
      return;
    }
    ctx.fillText('next', intersection.x-8, intersection.y-8);
  });
}

function drawSkeleton(lav){
  stroke('blue',2);
  lav.skeleton.forEach(([a,b])=>{
    drawLine(a.x,a.y,b.x,b.y);
  });
}

function drawStepIntersection(intersection){
  fill('red');
  stroke('none');
  drawCircle(intersection.x, intersection.y, 4);

  const originA = intersection.origins[0];
  const originB = intersection.origins[1];
  stroke('red',3);
  drawLine(originA.x, originA.y, originB.x, originB.y);



  fill('red');
  stroke('none');
  ctx.fillText('va', originA.x-8, originA.y-8);
  ctx.fillText('vb', originB.x-8, originB.y-8);
}

function drawStepVertex(vertex){

  stroke('green',3);
  drawCircle(vertex.x, vertex.y, 6);
  stroke('orange');
  ctx.setLineDash([2,4]);
  drawLine(vertex.x, vertex.y, vertex.x + vertex.bisector.x * bisectorDrawDistance, vertex.y + vertex.bisector.y * bisectorDrawDistance);
  ctx.setLineDash([]);

  stroke('orange', 2);
  drawLine(vertex.prevEdge[0].x, vertex.prevEdge[0].y, vertex.prevEdge[1].x, vertex.prevEdge[1].y);
  drawLine(vertex.nextEdge[0].x, vertex.nextEdge[0].y, vertex.nextEdge[1].x, vertex.nextEdge[1].y);
}

function drawNewIntersection(intersection){
  fill('none');
  stroke('brown');
  drawCircle(intersection.x, intersection.y, 6);
}