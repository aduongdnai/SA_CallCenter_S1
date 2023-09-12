class CallAdapter {
    constructor(call) {
        this.call = call;
    }

    convertToBooking() {
        const booking = {
            bookingId: this.generateRandomString(28),
            userId: "guest75963396",
            driverId: "",
            time: this.call.time,
            vehicleType: this.call.car_type,
            pickUp: this.call.pickup_address,
            dropOff: this.call.dropoff_address,
            price: 0,
            isComplete: false,
        };

        return booking;
    }

    generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
export default CallAdapter;