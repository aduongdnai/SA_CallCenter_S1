import axiosClient from "./axiosClient";

const callAPI={
    getAll(){
        const url=`/calls`
        return axiosClient.get(url)  
    },
    get(id){
        const url=`/calls/${id}`
        return axiosClient.get(url)
    },
    add(data){
        const url=`/calls/add`
        return axiosClient.post(url, data)
    },
    remove(id){
        const url=`/calls/${id}`
        return axiosClient.delete(url)
    },
    isAddressExist(phone_number,pickup_address,dropoff_address){
        const url=`/calls/find?phone_number=${phone_number}&pickup_address=${pickup_address}&dropoff_address=${dropoff_address}`
        return axiosClient.get(url)
    },
    findInCompleteCall(){
        const url=`/calls/find/incomplete`
        return axiosClient.get(url)
    },
    updateCall(id,data){
        console.log(id,data);
        const url=`calls/update/${id}`
        return axiosClient.put(url,data)
    },
    findGeocode(phone_number,pickup_address){
        const url=`/calls/find/geocode?phone_number=${phone_number}&pickup_address=${pickup_address}`
        return axiosClient.get(url)
    },
    getAllDrivers(){
        const url=`/drivers/`
        return axiosClient.get(url)  
    },
}
export default callAPI