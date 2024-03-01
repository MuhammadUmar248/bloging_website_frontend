import axios from "axios";

export const filterPaginationData = async ({create_new_arr = false, state, data, page, counteRoute, data_to_send={}}) => {

    let obj;
    if(state != null && !create_new_arr){
        obj = {...state,results: [...state.results, ...data], page: page}
    } else{
        // console.log("route is", counteRoute)
       await axios.post("http://localhost:3001"  + counteRoute, data_to_send)
       .then(({data: {totalDocs}}) => {
        obj = {results : data, page:1, totalDocs}
       })
       .catch(err => {
            console.log (err);
       })
    }
    // console.log("obj",obj)
    return obj;

}