import { api } from "./axios.js";
export default {
    createCalendar(payload) {
        return api.post('/calendar', payload)
    }, 
    createClassCalendar(payload) {
        return api.post('/classCalendar', payload)
    }, 
    getCalendarById(id) {
        return api.get('/calendarById/' + id)
    }, 
    getListPersonalCalendar() {
        return api.get('/calendar')
    }, 
    getListClassCalendar(id) {
        return api.get('/calendar/' + id)
    }, 
    updateCalendar(id, payload) {
        return api.put('/calendar/' + id, payload)
    }, 
    deleteCalendar(id) {
        return api.delete('/calendar/' + id)
    }, 
}