import { createStore } from 'vuex'
import horses from './modules/horses'
import races from './modules/races'

export default createStore({
    modules: {
        horses,
        races
    }
})

