function getApiData(isRejected) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (isRejected) return rej()
            else return res("user successfully logged in")
        }, 5000);
    })
}

console.log("Start Script")

function successCallback(responseFromPromise) { console.log(responseFromPromise) }
function errorCallback() { console.log("error..") }
function finallyCallback() { }
getApiData(true).then(successCallback).catch(errorCallback).finally(finallyCallback)
getApiData(false).then(successCallback).catch(errorCallback).finally(finallyCallback)

console.log("End Script")
