class Complex {
  constructor(a, b) {
    this.a = a
    this.b = b
  }

  add(other) {
    return new Complex(this.a + other.a, this.b + other.b)
  }

  sub(other) {
    return new Complex(this.a - other.a, this.b - other.b)
  }

  scale(scalar) {
    return new Complex(this.a * scalar, this.b * scalar)
  }

  mult(other) {
    return new Complex(
      this.a * other.a - this.b * other.b,
      this.a * other.b + this.b * other.a
    )
  }

  sqrt() {
    // convert to polar form
    let r = sqrt(this.a * this.a + this.b * this.b)
    let theta = atan2(this.b, this.a)
    r = sqrt(r)
    theta /= 2
    return new Complex(r * cos(theta), r * sin(theta))
  }
}
