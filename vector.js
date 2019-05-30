class Vector{

  constructor(x,y){
  	this.x = x;
    this.y = y;
  }

  length(){
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  normalize(){
    const length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
  }

  sub(b){
    return new Vector(this.x-b.x, this.y-b.y);
  }

  add(b){
    return new Vector(this.x + b.x, this.y + b.y);
  }

  mult(b){
    return new Vector(this.x * b.x, this.y * b.y);
  }

}