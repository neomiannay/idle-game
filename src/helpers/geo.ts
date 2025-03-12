import math from './math'

const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

const polarToCartesian = (polar: {latitude: number, longitude: number, radius: number}, degree = true) => {
  const multiplier = degree ? DEG_TO_RAD : 1
  const { latitude, longitude, radius } = polar

  return {
    x: radius * Math.cos(latitude * multiplier) * Math.sin(longitude * multiplier),
    y: radius * Math.sin(latitude * multiplier),
    z: radius * Math.cos(latitude * multiplier) * Math.cos(longitude * multiplier)
  }
}

const cartesianToPolar = (position: {x: number, y: number, z: number}, degree = true) => {
  const multiplier = degree ? RAD_TO_DEG : 1
  const bounds = degree ? 180 : Math.PI
  const { x, y, z } = position

  const radius = Math.sqrt(x * x + y * y + z * z)
  const latitude = math.wrap(Math.asin(y / radius) * multiplier, -bounds / 2, bounds / 2)
  const longitude = math.wrap(Math.atan2(x, z) * multiplier, -bounds, bounds)

  return {
    latitude,
    longitude,
    radius
  }
}

const lookAt = (position: {x: number, y: number, z: number}, degree = true) => {
  const multiplier = degree ? RAD_TO_DEG : 1
  const bounds = degree ? 180 : Math.PI
  const { x, y, z } = position

  const _l = {
    heading: 180 - Math.atan2(x, z) * multiplier,
    pitch: -Math.atan2(y, Math.sqrt(x * x + z * z)) * multiplier
  }

  _l.heading = math.wrap(_l.heading, -bounds, bounds)

  return _l
}

export default {
  polarToCartesian,
  cartesianToPolar,
  lookAt
}
