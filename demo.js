const selectedShape = 0;

const shapes = [
  [
    [
      new Vector(118, 376),
      new Vector(252, 379),
      new Vector(440, 380),
      new Vector(330, 115),
      new Vector(35, 106),
      new Vector(25, 273),
    ]
  ],

  [
    [
      new Vector(118, 328),
      new Vector(252, 379),
      new Vector(331, 400),
      new Vector(250, 115),
      new Vector(35, 106),
      new Vector(53, 273),
    ]
  ],

  [
    [
      new Vector(118, 328),
      new Vector(252, 338),
      new Vector(331, 270),
      new Vector(250, 115),
      new Vector(35, 106),
      new Vector(53, 273),
    ]
  ],

  [
    [
      new Vector(80, 50),
      new Vector(44, 120),
      new Vector(300, 105),
      new Vector(270, 33),
    ]
  ],

  [
    [
      new Vector(80, 50),
      new Vector(44, 120),
      new Vector(300, 105),
    ]
  ],
];

const shape = shapes[selectedShape];

const slav = shape.map((path)=>{
  return new LAV(path);
});


function renderSLAV(slav){
  ctx.clearRect(0,0,500,500);
  shape.forEach((path)=>{
    drawPath(path);
  });
  slav.forEach((lav)=>{
    // drawLAVVertices(lav);
    drawBisectors(lav);
    drawQueue(lav);
    drawSkeleton(lav);
  });
}

renderSLAV(slav);


function stepSLAV(slav){
  return slav.map((lav)=>{
    return stepLAV(lav);
  })
  .filter((r)=>r!==undefined);
}

document.addEventListener('click',()=>{
  const stepResults = stepSLAV(slav);
  renderSLAV(slav);

  if(stepResults===undefined){
    return;
  }

  stepResults.forEach(({intersection, newVertex, newIntersection})=>{
    if(intersection!==undefined){
      console.log('processed intersection', intersection);
      // drawStepIntersection(intersection);
    }
    if(newVertex!==undefined){
      drawStepVertex(newVertex);
    }
    if(newIntersection!==undefined){
      console.log('found new intersection', newIntersection);
      // drawNewIntersection(newIntersection);
    }
  });
});

let mouseX = 0;
let mouseY = 0;
const interactCanvas = document.getElementById('interact');
const ictx = interactCanvas.getContext('2d');

interactCanvas.addEventListener('mousemove', (e)=>{
  mouseX = e.clientX;
  mouseY = e.clientY;

  ictx.clearRect(0,0,500,500);
  slav.forEach((lav)=>{
    lav.queue.forEach((intersection)=>{
      const dx = mouseX - intersection.x;
      const dy = mouseY - intersection.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist<4){
        debugIntersection(intersection);
      }
    });

    lav.vertices.forEach((vertex)=>{
      const dx = mouseX - vertex.x;
      const dy = mouseY - vertex.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist<12){
        debugVertex(vertex);
      }
    });
  });

});

function debugIntersection(intersection){
  ictx.strokeStyle='red';
  ictx.beginPath();
  ictx.arc(intersection.x, intersection.y, 8, 0, 2 * Math.PI);
  ictx.stroke();

  ictx.strokeStyle='orange';
  ictx.beginPath();
  ictx.arc(intersection.origins[0].x, intersection.origins[0].y, 8, 0, 2 * Math.PI);
  ictx.arc(intersection.origins[1].x, intersection.origins[1].y, 8, 0, 2 * Math.PI);
  ictx.stroke();

  ictx.font = '18px arial';
  ictx.fillText(intersection.distanceToEdge,intersection.x, intersection.y);

  ictx.beginPath();
  ictx.moveTo(intersection.x,intersection.y);
  stroke('orange');
  const {point} = closestPointOnSegment(intersection, intersection.origins[0], intersection.origins[1]);
  ictx.lineTo(point.x,point.y);
  ictx.stroke();
}

function debugVertex(vertex){
  ictx.strokeStyle='red';
  ictx.beginPath();
  ictx.arc(vertex.x, vertex.y, 8, 0, 2 * Math.PI);
  ictx.stroke();

  ictx.strokeStyle='orange';
  ictx.beginPath();
  ictx.arc(vertex.prevVertex.x, vertex.prevVertex.y, 8, 0, 2 * Math.PI);
  ictx.stroke();
  ictx.beginPath();
  ictx.arc(vertex.nextVertex.x, vertex.nextVertex.y, 8, 0, 2 * Math.PI);
  ictx.stroke();
  ictx.closePath();

  ictx.beginPath();
  ictx.moveTo(vertex.x,vertex.y);
  ictx.lineTo(vertex.prevVertex.x,vertex.prevVertex.y);
  ictx.stroke();
  ictx.closePath();

  ictx.beginPath();
  ictx.moveTo(vertex.x,vertex.y);
  ictx.lineTo(vertex.nextVertex.x,vertex.nextVertex.y);
  ictx.stroke();
  ictx.closePath();

  ictx.beginPath();
  ictx.moveTo(vertex.prevEdge[0].x,vertex.prevEdge[0].y);
  ictx.lineTo(vertex.prevEdge[1].x,vertex.prevEdge[1].y);
  ictx.stroke();
  ictx.closePath();

  ictx.beginPath();
  ictx.moveTo(vertex.nextEdge[0].x,vertex.nextEdge[0].y);
  ictx.lineTo(vertex.nextEdge[1].x,vertex.nextEdge[1].y);
  ictx.stroke();
  ictx.closePath();

  ictx.font = '18px arial';
  ictx.fillText(vertex.active ? 'active' : 'inactive', vertex.x, vertex.y);
}