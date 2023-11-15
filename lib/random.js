export function randomIndex(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function createRandomPicker(arr) {
  arr = [...arr]
  function randomPick() {
    let len = arr.length - 1
    let index = randomIndex(0, len)
    let picked = arr[index];
    [arr[index], arr[len]] = [arr[len], arr[index]]
    return picked
  }

  randomPick()

  return randomPick
}