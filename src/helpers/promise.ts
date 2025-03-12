import { zipObject } from 'lodash-es'

const _if = (condition: boolean) => new Promise<void>((resolve, reject) => {
  if (condition) resolve()
  else reject()
})
const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time))
const pending = () => new Promise(resolve => {})

const defer = () => {
  const object = {} as { promise: Promise<any>, resolve: (value?: any) => void, reject: (reason?: any) => void}
  object.promise = new Promise((resolve, reject) => {
    object.resolve = resolve
    object.reject = reject
  })
  return object
}

const object = (data: Record<string, Promise<any>>) => {
  const keys = Object.keys(data)
  return Promise.all(Object.values(data))
    .then((values) => {
      return zipObject(keys, values)
    })
}

export default {
  if: _if,
  pending,
  wait,
  defer,
  object
}
