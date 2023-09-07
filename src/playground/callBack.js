function getApiData(callbackFn, timeInMs) {
    setTimeout(() => {
        callbackFn()
    }, timeInMs);

}
console.log("Start script")
// getApiData(function () {
//     console.log("do something 1...")
// }, 3000)
//
// getApiData(function () {
//     console.log("do something 2...")
// }, 6000)
//
// getApiData(function () {
//     console.log("do something 3...")
// }, 3000)

console.log("End script")


getApiData(function () {
    console.log("do something 1...")
}, 100)
getApiData(function () {
    console.log("do something 2...")
}, 99)
