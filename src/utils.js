import jquery from 'jquery';

export const HOST = "http://192.168.31.9:3003/log";
export const getUname = () => {
    let urls = window.location.pathname.split('/')
    let uname = urls[urls.length - 1]
    return uname
}
export const post = (jsonData, callback = () => { }) => {
    console.warn(jsonData)
    fetch(HOST, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: "same-origin",
        body: jsonData
    }).then(res => console.log(res)).then(callback())
}
export const put = (idx, jsonData, callback = () => { }) => {
    // console.warn(jsonData)
    fetch(HOST + "?id=eq." + idx, {
        method: 'patch',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PATCH,OPTIONS,HEAD',
            "Access-Control-Request-Method": "PATCH"
        },
        cache: "default",
        body: jsonData
    }).then(res => console.log("res", res), (error) => { console.log(error) }).then(callback())
}
export const patch = (idx, callback) => {
    let urls = window.location.pathname.split('/')
    let uname = urls[urls.length - 1] || "Anonymous"
    jquery.ajax({
        url: HOST + "?id=eq." + idx,
        dataType: 'json',
        type: 'patch',
        contentType: 'application/json',
        data: JSON.stringify({ solved: true, solver: uname }),
        success: callback

    })
}
export const notifyMe = (msg) => {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(msg);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(msg);
            }
        });
    }

}