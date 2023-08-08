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
    update(data){
        const url=`/calls/${data.id}`
        return axiosClient.patch(url, data)
    },
    remove(id){
        const url=`/calls/${id}`
        return axiosClient.delete(url)
    }
}
export default callAPI