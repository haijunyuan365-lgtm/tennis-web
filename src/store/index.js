import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import app from './modules/app'
import hawkeye from './modules/hawkeye'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        app,
        hawkeye
    },
    // 全局状态
    state: {
        // 全局loading状态
        loading: false,
        // 全局错误信息
        error: null
    },
    // 计算属性
    getters: {
        isLoading: state => state.loading,
        getError: state => state.error
    },
    // 同步修改状态
    mutations: {
        SET_LOADING(state, loading) {
            state.loading = loading
        },
        SET_ERROR(state, error) {
            state.error = error
        },
        CLEAR_ERROR(state) {
            state.error = null
        }
    },
    // 异步操作
    actions: {
        // 设置loading状态
        setLoading({commit}, loading) {
            commit('SET_LOADING', loading)
        },
        // 设置错误信息
        setError({commit}, error) {
            commit('SET_ERROR', error)
        },
        // 清除错误信息
        clearError({commit}) {
            commit('CLEAR_ERROR')
        },
        // 异步操作示例
        async asyncAction({commit}) {
            try {
                commit('SET_LOADING', true)
                // 模拟异步操作
                await new Promise(resolve => setTimeout(resolve, 1000))
                // 操作成功
                commit('CLEAR_ERROR')
            } catch (error) {
                commit('SET_ERROR', error.message)
            } finally {
                commit('SET_LOADING', false)
            }
        }
    }
}) 