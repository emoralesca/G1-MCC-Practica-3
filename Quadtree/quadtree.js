class Point {
    constructor (x, y, userData ){
        this.x = x;
        this.y = y;
        this.userData = userData;
    }
}

class Rectangle {
    constructor (x, y, w, h) {
        this.x = x; // center
        this.y = y;
        this.w = w; // half width
        this.h = h; // half height
    }
    
    // verifica si este objeto contiene un objeto Punto
    contains(point) {
        return (point.x >= this.x - this.w && point.x < this.x + this.w &&
          point.y >= this.y - this.h && point.y < this.y + this.h);
    }
    // verifica si este objeto se intersecta con otro objeto Rectangle
    intersects(range) {
        return (range.x - range.w > this.x + this.w || range.x + range.w < this.x - this.w ||
          range.y - range.h > this.y + this.h || range.y + range.h < this.y - this.h);
      }
}

class QuadTree {
    constructor ( boundary , n){
        this.boundary = boundary; // Rectangle
        this.capacity = n; // capacidad maxima de cada cuadrante
        this.points = []; // vector , almacena los puntos a almacenar
        this.divided = false;
    }
    // divide el quadtree en 4 quadtrees
    subdivide() {
        let _x = this.boundary.x;
        let _y = this.boundary.y;
        let _w = this.boundary.w * 0.5;
        let _h = this.boundary.h * 0.5;
        let px0 = _x + _w;
        let px1 = _x - _w;
        let py0 = _y + _h;
        let py1 = _y - _h;
        let ne = new Rectangle(px0, py1, _w, _h);
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(px1, py1, _w, _h);
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(px0, py0, _w, _h);
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(px1, py0, _w, _h);
        this.southwest = new QuadTree(sw, this.capacity);
        this.divided = true;
      }

    insert(point) {
        if(this.points.length<this.capacity){
            this.points.push(point);
        }
        else{
            if(!this.divided){
                this.subdivide();
                this.divided=true;
            }
            this.northeast.insert(point);
            this.northwest.insert(point);
            this.southeast.insert(point);
            this.southwest.insert(point);
            
        }        
      }

    show () {
        stroke (255);
        strokeWeight(1);
        noFill () ;
        rectMode ( CENTER );
        rect ( this.boundary.x, this.boundary.y , this.boundary.w*2 , this.boundary.h*2) ;
        if( this.divided ) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        }
        
        for (let p of this.points ){
            strokeWeight(3);
            point (p.x,p.y);
            point (p.x,p.y);
            point (p.x,p.y);
            
        }
    }

    query(boundary){
        let points_in_range = [];

        if (!this.boundary.intersects(boundary)) { return points_in_range; }
    
        for (let p of this.points)
          if (boundary.contains(p)) points_in_range.push(p);
    
        if (this.is_leaf) return points_in_range;
    
        points_in_range = points_in_range.concat(this.northwest.range(bounds));
        points_in_range = points_in_range.concat(this.northeast.range(bounds));
        points_in_range = points_in_range.concat(this.southwest.range(bounds));
        points_in_range = points_in_range.concat(this.southeast.range(bounds));
        return points_in_range;
      }
    
}