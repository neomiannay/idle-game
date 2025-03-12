class Bucket {
  private _delay: number
  private _list: Function[]
  private _timeout: number | null = null

  constructor (delay: number) {
    this._delay = delay
    this._list = []
  }

  add (callback: Function) {
    this._list.push(callback)
    if (!this._timeout) this.execute()
  }

  execute = () => {
    const callback = this._list.shift()
    if (callback) {
      callback()
      this._timeout = window.setTimeout(this.execute, this._delay)
    } else {
      this._timeout = null
    }
  }
}

export { Bucket }
