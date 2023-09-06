import axiosClient from "./axiosClient";
const userAPI={
    ID_GUEST(){
        return "guest75963396"
    },
    get(id){
        const url=`/calls/${id}`
        return axiosClient.get(url)
    },
    update(data){
        const url=`/users/update`
        return axiosClient.post(url,data)
    }
    


}
export default userAPI