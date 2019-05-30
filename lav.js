class LAV {
  constructor(path){
    this.vertices = path.map((vector)=>{
      return new Vertex(vector.x, vector.y);
    });

    connectVertices(this.vertices);

    this.vertices.forEach((vertex)=>{
      vertex.bisector = computeBisector(vertex);
    });

    this.queue = this.vertices.map((vertex)=>{
      return findIntersection(vertex);
    })
    .filter((i)=>i!==undefined);

    this.sortQueue();

    this.skeleton = [];
  }

  sortQueue(){
    this.queue.sort((a,b)=>{
      return a.distanceToEdge - b.distanceToEdge;
    });
  }
}

function stepLAV(lav){
  if(lav.queue.length<=0){
    return;
  }

  const intersection = lav.queue.shift();
  const {origins} = intersection;
  const va = origins[0];
  const vb = origins[1];

  if(va.active===false && vb.active===false){
    console.log('skipping intersection');
    return {intersection};
  }

  // console.log(va, vb);

  //  Edge Event

  if(va.prevVertex === vb.nextVertex){
    lav.skeleton.push([va.position, intersection.position]);
    lav.skeleton.push([vb.position, intersection.position]);
    lav.skeleton.push([va.prevVertex.position, intersection.position]);

    //  Mark inactive??
    va.active = false;
    vb.active = false;
    va.prevVertex.active = false;
    console.log('created three arcs, roof edge');
    return {intersection};
  }


  lav.skeleton.push([va.position, intersection.position]);
  lav.skeleton.push([vb.position, intersection.position]);

  va.active = false;
  vb.active = false;

  const newVertex = new Vertex(intersection.x, intersection.y);
  newVertex.prevVertex = va.prevVertex;
  newVertex.nextVertex = vb.nextVertex;

  va.prevVertex.nextVertex = newVertex;
  vb.nextVertex.prevVertex = newVertex;

  newVertex.prevEdge = [va, va.prevVertex];
  newVertex.nextEdge = [vb, vb.nextVertex];

  lav.vertices.push(newVertex);
  //lav.vertices.splice(lav.vertices.indexOf(va),1);
  //lav.vertices.splice(lav.vertices.indexOf(vb),1);

  newVertex.bisector = computeBisector(newVertex);

  // lav.vertices.forEach((vertex)=>{
  //   vertex.bisector = computeBisector(vertex);
  // });

  const newIntersection = findIntersection(newVertex);
  if(newIntersection!==undefined){
    lav.queue.push(newIntersection);
  }

  lav.sortQueue();
  console.log('create two arcs, edge event');
  return {intersection, newVertex, newIntersection};
}

function connectVertices(vertices){
  vertices.forEach((vertex, index)=>{
    let prevIndex = index-1;
    if(prevIndex < 0){
      prevIndex = vertices.length-1;
    }
    let nextIndex = index+1;
    if(nextIndex >= vertices.length){
      nextIndex = 0;
    }

    const prevVertex = vertices[prevIndex];
    const nextVertex = vertices[nextIndex];
    vertex.prevVertex = prevVertex;
    vertex.nextVertex = nextVertex;

    vertex.prevEdge = [vertex, prevVertex];
    vertex.nextEdge = [vertex, nextVertex];
  });
}
