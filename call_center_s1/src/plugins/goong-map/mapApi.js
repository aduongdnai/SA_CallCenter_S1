import {mapClient, API_KEY} from "./mapAxiosClient";

const mapAPI={
    geoCodeToAddress(latitude,longitude){
        const apikey=API_KEY()
        const url=`/Geocode?latlng=${latitude},${longitude}&api_key=${apikey}`
        return mapClient.get(url)
    },
    addressToGeocode(address){
        const apikey=API_KEY()
        const url=`/Geocode?address=${address}&api_key=${apikey}`
        return mapClient.get(url)
    }
}
export default mapAPI