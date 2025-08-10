// 用户模块
const state = {
    // 用户信息
    userInfo: null,
    // 登录状态
    isLoggedIn: false,
    // 登录表单数据
    loginForm: {
        username: '',
        password: ''
    },
    // 注册表单数据
    registerForm: {
        username: '',
        password: '',
        email: ''
    },
    // 用户权限
    permissions: [],
    // 用户token
    token: localStorage.getItem('token') || null
}

const getters = {
    // 获取用户信息
    getUserInfo: state => state.userInfo,
    // 获取登录状态
    isLoggedIn: state => state.isLoggedIn,
    // 获取登录表单
    getLoginForm: state => state.loginForm,
    // 获取注册表单
    getRegisterForm: state => state.registerForm,
    // 获取用户权限
    getPermissions: state => state.permissions,
    // 获取token
    getToken: state => state.token,
    // 检查是否有特定权限
    hasPermission: (state) => (permission) => {
        return state.permissions.includes(permission)
    }
}

const mutations = {
    // 设置用户信息
    SET_USER_INFO(state, userInfo) {
        state.userInfo = userInfo
        state.isLoggedIn = !!userInfo
    },
    // 设置登录状态
    SET_LOGIN_STATUS(state, status) {
        state.isLoggedIn = status
    },
    // 设置登录表单
    SET_LOGIN_FORM(state, form) {
        state.loginForm = {...state.loginForm, ...form}
    },
    // 设置注册表单
    SET_REGISTER_FORM(state, form) {
        state.registerForm = {...state.registerForm, ...form}
    },
    // 设置用户权限
    SET_PERMISSIONS(state, permissions) {
        state.permissions = permissions
    },
    // 设置token
    SET_TOKEN(state, token) {
        state.token = token
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    },
    // 清除用户数据
    CLEAR_USER_DATA(state) {
        state.userInfo = null
        state.isLoggedIn = false
        state.permissions = []
        state.token = null
        localStorage.removeItem('token')
    }
}

const actions = {
    // 登录操作
    async login({commit}, loginData) {
        try {
            commit('SET_LOGIN_FORM', loginData)

            // 模拟登录API调用
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    // 模拟登录验证
                    if (loginData.username && loginData.password) {
                        resolve({
                            success: true,
                            data: {
                                userInfo: {
                                    id: 1,
                                    username: loginData.username,
                                    email: 'user@example.com',
                                    avatar: 'https://via.placeholder.com/40'
                                },
                                token: 'mock-jwt-token-' + Date.now(),
                                permissions: ['read', 'write']
                            }
                        })
                    } else {
                        resolve({
                            success: false,
                            message: '用户名或密码错误'
                        })
                    }
                }, 1000)
            })

            if (response.success) {
                const {userInfo, token, permissions} = response.data
                commit('SET_USER_INFO', userInfo)
                commit('SET_TOKEN', token)
                commit('SET_PERMISSIONS', permissions)
                return {success: true}
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            commit('SET_LOGIN_STATUS', false)
            throw error
        }
    },

    // 注册操作
    async register({commit}, registerData) {
        commit('SET_REGISTER_FORM', registerData)

        // 模拟注册API调用
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                // 模拟注册验证
                if (registerData.username && registerData.password && registerData.email) {
                    resolve({
                        success: true,
                        message: '注册成功'
                    })
                } else {
                    resolve({
                        success: false,
                        message: '注册信息不完整'
                    })
                }
            }, 1000)
        })

        if (response.success) {
            return {success: true, message: response.message}
        } else {
            throw new Error(response.message)
        }
    },

    // 登出操作
    logout({commit}) {
        commit('CLEAR_USER_DATA')
    },

    // 获取用户信息
    async getUserInfo({commit}) {
        // 模拟获取用户信息API
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 1,
                    username: 'testuser',
                    email: 'test@example.com',
                    avatar: 'https://via.placeholder.com/40'
                })
            }, 500)
        })

        commit('SET_USER_INFO', response)
        return response
    },

    // 更新用户信息
    async updateUserInfo({commit}, userInfo) {
        // 模拟更新用户信息API
        await new Promise((resolve) => setTimeout(resolve, 500))
        commit('SET_USER_INFO', userInfo)
        return {success: true}
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
} 