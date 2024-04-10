class Circle {
  constructor(bend, x, y) {
    this.x = x
    this.y = y
    this.bend = bend
    this.radius = abs(1 / this.bend)
  }
  show() {
    stroke(0)
    noFill()
    circle(this.x, this.y, this.radius * 2)
  }
}
