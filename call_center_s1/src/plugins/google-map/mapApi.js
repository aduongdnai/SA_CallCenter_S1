import {mapClient, API_KEY} from "./mapAxiosClient";

const mapAPI={
    geoCodeToAddress(latitude,longitude){
        const apikey=API_KEY()
        const url=`/geocode/json?latlng=${latitude},${longitude}&key=${apikey}`
        return mapClient.get(url)
    },
    addressToGeocode(address){

        const apikey=API_KEY()
        const url=`/geocode/json?address=${address}&key=${apikey}`
        console.log(url);
        return mapClient.get(url)
    }
}
export default mapAPI