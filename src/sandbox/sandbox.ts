import uuid from './helper'
import { Bridge } from './bridge'
export type Prepatcher<T = {}> = (
  globalThis: WindowOrWorkerGlobalScope & T,
  bridge: Bridge
) => void
export class Sandbox {
  private bridge: Bridge
  private scope: Worker
  evaluate(fn: (...args: unknown[]) => unknown, args: unknown[] = []) {
    return this.bridge.send('eval', [fn.toString(), args])
  }
  regist(
    method: string,
    trigger: (val: unknown[]) => unknown | Promise<unknown>
  ): void {
    this.bridge.recv(method, trigger)
  }
  constructor(prepatch: Prepatcher = () => {}) {
    this.scope = new Worker(
      URL.createObjectURL(
        new Blob(
          [
            `
          ;((prepatch) => {
            ${uuid}
            ${Bridge}
            const post = globalThis.postMessage
            const bridge = new Bridge(post.bind(this.scope), ev =>
              globalThis.addEventListener('message', ev)
            )
            prepatch.call(globalThis, globalThis, bridge)
            bridge.recv('eval', (val) => {
              const [code, args] = val
              const ret = new Function('return ' + code)()
              if (ret instanceof Function) return ret.apply(globalThis, args)
              return ret
            })
          })(${prepatch.toString()})
        `
          ],
          { type: 'text/javascript' }
        )
      )
    )
    this.bridge = new Bridge(this.scope.postMessage.bind(this.scope), ev =>
      this.scope.addEventListener('message', ev)
    )
  }
}
