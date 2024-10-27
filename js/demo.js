const obj = {
  a: {
    b: {
      c: {
        d1: 111,
        d2: 222,
      },
    },
  },
}
console.dir(obj, {
  depth: Infinity,
})
