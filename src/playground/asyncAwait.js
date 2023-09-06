function getApiData(isRejected) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (isRejected) return rej()
            else return res("user successfully logged in")
        }, 5000);
    })
}
async function init() {
    try {
        console.log("start of init")
        const result = await getApiData(false)
        console.log(result)
        console.log("End of init")
    } catch (error) {
        console.log(error)
    }
}
console.log("Script start")
init()
init()
init()
console.log(init())
console.log("Script End")
