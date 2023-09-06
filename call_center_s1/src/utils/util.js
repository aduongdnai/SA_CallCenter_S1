
export function  formatDate(curDate){
        const currentDate= new Date(curDate.getTime() + 7 * 60 * 60 * 1000)
        // Extract date components
        const day = currentDate.getUTCDate();
        const month = currentDate.getUTCMonth() + 1; // Add 1 because months are zero-based
        const year = currentDate.getUTCFullYear();

        // Extract time components
        const hours = currentDate.getUTCHours();
        const minutes = currentDate.getUTCMinutes();
        const seconds = currentDate.getUTCSeconds();
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return formattedDate
}
function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
  }
export function convertFromCallToBooking(call){
    const booking={
        bookingId: generateRandomString(28),
        userId: "guest75963396",       
        driverId: "",
        time: call.time,
        vehicleType: call.car_type,
        pickUp: call.pickup_address,
        dropOff: call.dropoff_address,
        price:0,
        isComplete: false

    }
    return booking
}
    

  