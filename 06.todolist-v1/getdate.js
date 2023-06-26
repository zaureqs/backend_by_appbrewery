const currDate = () => {
    const today = new Date();
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    return today.toLocaleDateString("en-US",options);
};

const x = () => {
    return "dsljf";
}

module.exports = {currDate,x};
