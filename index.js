let allCircles = []
let queue = []
const epsilon = 0.1

function setup() {
  createCanvas(800, 800)

  let c1 = new Circle(-1 / (width / 3), width / 2, height / 2)
  let r2 = random(100, c1.radius / 2)

  let v = p5.Vector.fromAngle(random(TWO_PI))
  v.setMag(c1.radius - r2)
  let c2 = new Circle(1 / r2, width / 2 + v.x, height / 2 + v.y)

  let r3 = v.mag()
  v.rotate(PI)
  v.setMag(c1.radius - r3)
  let c3 = new Circle(1 / r3, width / 2 + v.x, height / 2 + v.y)

  allCircles = [c1, c2, c3]
  queue = [[c1, c2, c3]]
}

function draw() {
  background(255)

  nextGeneration()

  for (let c of allCircles) {
    c.show()
  }
}

function nextGeneration() {
  let newQueue = []
  for (let triplet of queue) {
    let [c1, c2, c3] = triplet
    let k4 = descartes(c1, c2, c3)
    let newCircles = complexDescartes(c1, c2, c3, k4)

    for (let newCirlce of newCircles) {
      if (validate(newCirlce, c1, c2, c3)) {
        allCircles.push(newCirlce)
        let t1 = [c1, c2, newCirlce]
        let t2 = [c1, c3, newCirlce]
        let t3 = [c2, c3, newCirlce]

        newQueue = newQueue.concat([t1, t2, t3])
      }
    }
  }

  queue = newQueue
}

function descartes(c1, c2, c3) {
  const k1 = c1.bend
  const k2 = c2.bend
  const k3 = c3.bend

  const sum = k1 + k2 + k3
  const root = 2 * sqrt(abs(k1 * k2 + k2 * k3 + k3 * k1))

  return [sum + root, sum - root]
}

function validate(c4, c1, c2, c3) {
  if (c4.radius < 2) return false
  for (let other of allCircles) {
    let d = c4.dist(other)
    let radiusDiff = abs(c4.radius - other.radius)
    if (d < epsilon && radiusDiff < epsilon) {
      return false
    }
  }

  if (!isTangent(c4, c1)) return false
  if (!isTangent(c4, c2)) return false
  if (!isTangent(c4, c3)) return false

  return true
}

function isTangent(c1, c2) {
  let d = c1.dist(c2)
  let r1 = c1.radius
  let r2 = c2.radius

  return abs(d - (r1 + r2)) < epsilon || d - abs(r2 - r1) < epsilon
}

function complexDescartes(c1, c2, c3, k4) {
  let k1 = c1.bend
  let k2 = c2.bend
  let k3 = c3.bend

  let z1 = c1.center
  let z2 = c2.center
  let z3 = c3.center

  let zk1 = z1.scale(k1)
  let zk2 = z2.scale(k2)
  let zk3 = z3.scale(k3)

  let sum = zk1.add(zk2).add(zk3)
  let root = zk1.mult(zk2).add(zk2.mult(zk3)).add(zk1.mult(zk3))

  root = root.sqrt().scale(2)

  let center1 = sum.add(root).scale(1 / k4[0])
  let center2 = sum.sub(root).scale(1 / k4[0])
  let center3 = sum.add(root).scale(1 / k4[1])
  let center4 = sum.sub(root).scale(1 / k4[1])

  return [
    new Circle(k4[0], center1.a, center1.b),
    new Circle(k4[0], center2.a, center2.b),
    new Circle(k4[1], center3.a, center3.b),
    new Circle(k4[1], center4.a, center4.b),
  ]
}
