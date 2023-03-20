export interface MessageValue {
  method: string
  args: unknown[]
}
export interface Message {
  type: 'message'
  id: string
  request: MessageValue
}
export interface ResultValue {
  status: 'resolve' | 'reject'
  value: unknown
}
export interface Result {
  type: 'result'
  id: string
  result: ResultValue
}
export class Bridge {
  private send_fn: (message: Message | Result) => void
  private send_trigger: Map<
    string,
    {
      resolve: (val: ResultValue) => void
      reject: (err: unknown) => void
    }
  >
  private recv_trigger: Map<
    string,
    (val: unknown[]) => unknown | Promise<unknown>
  >
  // polyfill Source: https://stackoverflow.com/a/2117523
  static uuid() {
    return crypto.randomUUID instanceof Function
      ? crypto.randomUUID()
      : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
          (
            Number(c) ^
            (crypto.getRandomValues(new Uint8Array(1))[0] &
              (15 >> (Number(c) / 4)))
          ).toString(16)
        )
  }

  send(method: string, args: unknown[]): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
      const id = Bridge.uuid()
      this.send_fn({
        type: 'message',
        id,
        request: {
          method,
          args
        }
      })
      this.send_trigger.set(id, {
        resolve(val: unknown) {
          resolve(val)
        },
        reject(err: unknown) {
          reject(err)
        }
      })
    })
  }
  recv(
    method: string,
    trigger: (val: unknown[]) => unknown | Promise<unknown>
  ) {
    this.recv_trigger.set(method, trigger)
  }
  constructor(
    send_fn: (message: unknown) => void,
    eventListener: (
      listener: (event: MessageEvent<Message | Result>) => void
    ) => void
  ) {
    ;[this.send_fn, this.send_trigger, this.recv_trigger] = [
      send_fn,
      new Map(),
      new Map()
    ]
    eventListener(ev => {
      if (ev.data.type == 'result') {
        const pm = this.send_trigger.get(ev.data.id)
        if (pm !== undefined) {
          switch (ev.data.result.status) {
            case 'resolve': {
              pm.resolve(ev.data.result)
              this.send_trigger.delete(ev.data.id)
              break
            }
            case 'reject': {
              pm.reject(ev.data.result.value)
              this.send_trigger.delete(ev.data.id)
              break
            }
          }
        }
      } else {
        const trigger = this.recv_trigger.get(ev.data.request.method)
        if (trigger !== undefined) {
          try {
            const res = trigger(ev.data.request.args)
            if (res instanceof Promise) {
              res.then(
                res => {
                  this.send_fn({
                    type: 'result',
                    id: ev.data.id,
                    result: {
                      status: 'resolve',
                      value: res
                    }
                  })
                },
                err => {
                  this.send_fn({
                    type: 'result',
                    id: ev.data.id,
                    result: {
                      status: 'reject',
                      value: err
                    }
                  })
                }
              )
            } else {
              this.send_fn({
                type: 'result',
                id: ev.data.id,
                result: {
                  status: 'resolve',
                  value: res
                }
              })
            }
          } catch (err) {
            this.send_fn({
              type: 'result',
              id: ev.data.id,
              result: {
                status: 'reject',
                value: err
              }
            })
          }
        } else {
          this.send_fn({
            type: 'result',
            id: ev.data.id,
            result: {
              status: 'reject',
              value: `${ev.data.request.method} is not defined`
            }
          })
        }
      }
    })
  }
}
