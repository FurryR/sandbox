// polyfill Source: https://stackoverflow.com/a/2117523
export default crypto.randomUUID instanceof Function
  ? crypto.randomUUID
  : function uuidv4() {
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
        (
          Number(c) ^
          (crypto.getRandomValues(new Uint8Array(1))[0] &
            (15 >> (Number(c) / 4)))
        ).toString(16)
      )
    }
