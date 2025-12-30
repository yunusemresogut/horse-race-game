import { generateProgram } from '@/utils/raceUtils'

const state = {
    program: [],
    results: [],
    currentRace: null,
    racing: false,
    currentRaceIndex: 0,
    raceInterval: null
}

const mutations = {
    SET_PROGRAM(state, program) {
        state.program = program
    },
    SET_RESULTS(state, results) {
        state.results = results
    },
    SET_CURRENT_RACE(state, race) {
        state.currentRace = race
    },
    SET_RACING(state, racing) {
        state.racing = racing
    },
    SET_CURRENT_RACE_INDEX(state, index) {
        state.currentRaceIndex = index
    },
    SET_RACE_INTERVAL(state, interval) {
        state.raceInterval = interval
    },
    ADD_RESULT(state, result) {
        state.results.push(result)
    },
    RESET_RACES(state) {
        state.currentRaceIndex = 0
        state.currentRace = null
        state.results = []
    }
}

const actions = {
    generateProgram({ commit, rootGetters }) {
        const horses = rootGetters['horses/horses']
        if (horses.length === 0) {
            return null
        }

        const program = generateProgram(horses)
        commit('SET_PROGRAM', program)
        commit('RESET_RACES')
    },

    async startRaces({ commit, dispatch, state }) {
        if (state.program.length === 0) {
            await dispatch('generateProgram')
        }

        if (state.program.length === 0) {
            return null
        }

        commit('SET_RACING', true)

        if (state.currentRaceIndex >= state.program.length) {
            commit('SET_CURRENT_RACE_INDEX', 0)
        }

        if (!state.currentRace) {
            dispatch('runNextRace')
        }
    },

    async runNextRace({ commit, state }) {
        const currentIndex = state.currentRaceIndex

        if (currentIndex >= state.program.length) {
            commit('SET_RACING', false)
            commit('SET_CURRENT_RACE', null)
            return
        }

        const raceProgram = state.program[currentIndex]
        commit('SET_CURRENT_RACE', raceProgram)
    },

    finishCurrentRace({ commit, state, dispatch }, finalPositions) {
        const currentIndex = state.currentRaceIndex

        if (currentIndex >= state.program.length || !state.currentRace) {
            return
        }

        const raceProgram = state.program[currentIndex]

        const winners = finalPositions.map(horse => ({
            position: horse.finalPosition,
            name: horse.name,
        }));

        const formattedResult = {
            raceNumber: raceProgram.raceNumber,
            distance: raceProgram.distance,
            winners: winners
        }

        commit('ADD_RESULT', formattedResult)

        const nextIndex = currentIndex + 1
        commit('SET_CURRENT_RACE_INDEX', nextIndex)

        if (state.racing && nextIndex < state.program.length) {
            const interval = setTimeout(() => {
                dispatch('runNextRace')
            }, 1000)
            commit('SET_RACE_INTERVAL', interval)
        } else {
            commit('SET_RACING', false)
            commit('SET_CURRENT_RACE', null)
        }
    },

    pauseRaces({ commit, state }) {
        commit('SET_RACING', false)
        if (state.raceInterval) {
            clearTimeout(state.raceInterval)
            commit('SET_RACE_INTERVAL', null)
        }
    },

    toggleRace({ commit, dispatch, state }) {
        if (state.racing) {
            dispatch('pauseRaces')
        } else {
            dispatch('startRaces')
        }
    },

    addResult({ commit }, result) {
        commit('ADD_RESULT', result)
    }
}

const getters = {
    program: (state) => state.program,
    results: (state) => state.results,
    currentRace: (state) => state.currentRace,
    racing: (state) => state.racing,
    currentRaceIndex: (state) => state.currentRaceIndex,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

