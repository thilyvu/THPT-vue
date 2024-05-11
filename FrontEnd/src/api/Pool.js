import { api } from "./axios.js";
export default {
    createPool(payload) {
        return api.post('/pool', payload)
    }, 
    updatePool(id, payload) {
        return api.put('/pool/'+id, payload)
    }, 
    getListPool() {
        return api.get('/pool')
    }, 
    getListPoolById(id) {
        return api.get('/pool/' +id)
    }, 
    deletePool(id) {
        return api.delete('/pool/' +id)
    }, 
}