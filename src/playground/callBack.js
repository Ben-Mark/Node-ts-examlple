function getApiData(callbackFn, timeInMs) {
    setTimeout(() => {
        callbackFn()
    }, timeInMs);

}
console.log("Start script")
getApiData(function () {
    console.log("do something...")
}, 3000)

getApiData(function () {
    console.log("do something...")
}, 6000)

getApiData(function () {
    console.log("do something...")
}, 3000)
console.log("End script")
