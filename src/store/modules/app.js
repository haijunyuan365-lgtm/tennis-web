// 应用模块
const state = {
    // 侧边栏折叠状态
    sidebarCollapsed: false,
    // 主题设置
    theme: localStorage.getItem('theme') || 'light',
    // 语言设置
    language: localStorage.getItem('language') || 'zh-CN',
    // 页面标题
    pageTitle: '',
    // 面包屑导航
    breadcrumbs: [],
    // 应用配置
    appConfig: {
        name: 'Vue2 Demo',
        version: '1.0.0',
        logo: '/logo.png'
    },
    // 通知消息
    notifications: [],
    // 全局设置
    settings: {
        autoSave: true,
        notifications: true,
        sound: false
    },
    // 背景设置
    backgroundTemplate: localStorage.getItem('backgroundTemplate') || 'default',
    sponsorBackgroundUrl: localStorage.getItem('sponsorBackgroundUrl') || ''
}

const getters = {
    // 获取侧边栏状态
    isSidebarCollapsed: state => state.sidebarCollapsed,
    // 获取主题
    getTheme: state => state.theme,
    // 获取语言
    getLanguage: state => state.language,
    // 获取页面标题
    getPageTitle: state => state.pageTitle,
    // 获取面包屑
    getBreadcrumbs: state => state.breadcrumbs,
    // 获取应用配置
    getAppConfig: state => state.appConfig,
    // 获取通知
    getNotifications: state => state.notifications,
    // 获取设置
    getSettings: state => state.settings,
    // 检查是否为暗色主题
    isDarkTheme: state => state.theme === 'dark',
    // 获取背景模板
    getBackgroundTemplate: state => state.backgroundTemplate,
    // 获取赞助商背景URL
    getSponsorBackgroundUrl: state => state.sponsorBackgroundUrl
}

const mutations = {
    // 切换侧边栏状态
    TOGGLE_SIDEBAR(state) {
        state.sidebarCollapsed = !state.sidebarCollapsed
    },
    // 设置侧边栏状态
    SET_SIDEBAR_COLLAPSED(state, collapsed) {
        state.sidebarCollapsed = collapsed
    },
    // 设置主题
    SET_THEME(state, theme) {
        state.theme = theme
        localStorage.setItem('theme', theme)
        // 应用主题到body
        document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme'
    },
    // 设置语言
    SET_LANGUAGE(state, language) {
        state.language = language
        localStorage.setItem('language', language)
    },
    // 设置页面标题
    SET_PAGE_TITLE(state, title) {
        state.pageTitle = title
        document.title = title
    },
    // 设置面包屑
    SET_BREADCRUMBS(state, breadcrumbs) {
        state.breadcrumbs = breadcrumbs
    },
    // 添加通知
    ADD_NOTIFICATION(state, notification) {
        state.notifications.push({
            id: Date.now(),
            timestamp: new Date(),
            ...notification
        })
    },
    // 移除通知
    REMOVE_NOTIFICATION(state, id) {
        const index = state.notifications.findIndex(n => n.id === id)
        if (index > -1) {
            state.notifications.splice(index, 1)
        }
    },
    // 清除所有通知
    CLEAR_NOTIFICATIONS(state) {
        state.notifications = []
    },
    // 更新设置
    UPDATE_SETTINGS(state, settings) {
        state.settings = {...state.settings, ...settings}
    },
    // 设置背景模板
    SET_BACKGROUND_TEMPLATE(state, template) {
        state.backgroundTemplate = template
        localStorage.setItem('backgroundTemplate', template)
    },
    // 设置赞助商背景URL
    SET_SPONSOR_BACKGROUND_URL(state, url) {
        state.sponsorBackgroundUrl = url
        localStorage.setItem('sponsorBackgroundUrl', url)
    },
    // 重置背景设置
    RESET_BACKGROUND(state) {
        state.backgroundTemplate = 'default'
        state.sponsorBackgroundUrl = ''
        localStorage.removeItem('backgroundTemplate')
        localStorage.removeItem('sponsorBackgroundUrl')
    }
}

const actions = {
    // 切换侧边栏
    toggleSidebar({commit}) {
        commit('TOGGLE_SIDEBAR')
    },

    // 设置侧边栏状态
    setSidebarCollapsed({commit}, collapsed) {
        commit('SET_SIDEBAR_COLLAPSED', collapsed)
    },

    // 切换主题
    toggleTheme({commit, getters}) {
        const newTheme = getters.isDarkTheme ? 'light' : 'dark'
        commit('SET_THEME', newTheme)
    },

    // 设置主题
    setTheme({commit}, theme) {
        commit('SET_THEME', theme)
    },

    // 设置语言
    setLanguage({commit}, language) {
        commit('SET_LANGUAGE', language)
    },

    // 设置页面标题
    setPageTitle({commit}, title) {
        commit('SET_PAGE_TITLE', title)
    },

    // 设置面包屑
    setBreadcrumbs({commit}, breadcrumbs) {
        commit('SET_BREADCRUMBS', breadcrumbs)
    },

    // 添加通知
    addNotification({commit}, notification) {
        commit('ADD_NOTIFICATION', notification)

        // 自动移除通知（如果设置了自动移除）
        if (notification.autoRemove !== false) {
            setTimeout(() => {
                commit('REMOVE_NOTIFICATION', notification.id || Date.now())
            }, notification.duration || 5000)
        }
    },

    // 移除通知
    removeNotification({commit}, id) {
        commit('REMOVE_NOTIFICATION', id)
    },

    // 清除所有通知
    clearNotifications({commit}) {
        commit('CLEAR_NOTIFICATIONS')
    },

    // 更新设置
    updateSettings({commit}, settings) {
        commit('UPDATE_SETTINGS', settings)
    },

    // 设置背景模板
    setBackgroundTemplate({commit}, template) {
        commit('SET_BACKGROUND_TEMPLATE', template)
    },

    // 设置赞助商背景URL
    setSponsorBackgroundUrl({commit}, url) {
        commit('SET_SPONSOR_BACKGROUND_URL', url)
    },

    // 重置背景设置
    resetBackground({commit}) {
        commit('RESET_BACKGROUND')
    },

    // 初始化应用
    async initApp({commit, dispatch}) {
        try {
            // 应用保存的主题
            const savedTheme = localStorage.getItem('theme')
            if (savedTheme) {
                commit('SET_THEME', savedTheme)
            }

            // 应用保存的语言
            const savedLanguage = localStorage.getItem('language')
            if (savedLanguage) {
                commit('SET_LANGUAGE', savedLanguage)
            }

            // 显示欢迎通知
            dispatch('addNotification', {
                type: 'success',
                title: '欢迎',
                message: '应用初始化完成',
                duration: 3000
            })

        } catch (error) {
            console.error('应用初始化失败:', error)
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
} 