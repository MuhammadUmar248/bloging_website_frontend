
let month = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "saturday"];

export const getDay = (timestamp) => {
    let date = new Date(timestamp);

    return `${date.getDate()} ${month[date.getMonth()]}`
}