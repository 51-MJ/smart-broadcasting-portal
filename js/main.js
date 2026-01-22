// 主入口文件 - 统一管理所有功能
import { 
    checkLogin, 
    getCurrentPermission, 
    updateUIByPermission,
    showMessage 
} from './auth.js';

import { 
    initUIEffects, 
    updateUIByPermission as updateUI 
} from './ui.js';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('智慧广电门户系统初始化...');
    
    // 检查登录状态（除了登录页）
    if (!window.location.pathname.includes('login.html')) {
        const isLoggedIn = checkLogin();
        if (isLoggedIn) {
            console.log('用户已登录：', isLoggedIn);
            showMessage(`欢迎回来，${localStorage.getItem('username')}`, 'success');
        }
    }
    
    // 初始化UI效果
    initUIEffects();
    
    // 更新权限相关的UI
    updateUIByPermission();
    
    // 初始化其他功能
    initPageSpecificFunctions();
    
    console.log('系统初始化完成！');
});

// 页面特定功能
function initPageSpecificFunctions() {
    const pageName = document.body.getAttribute('data-page') || 
                    window.location.pathname.split('/').pop().replace('.html', '');
    
    switch(pageName) {
        case 'index':
            initHomePage();
            break;
        case 'login':
            initLoginPage();
            break;
        case 'dashboard':
            initDashboardPage();
            break;
        default:
            console.log('未知页面：', pageName);
    }
}

// 首页特定功能
function initHomePage() {
    console.log('初始化首页功能');
    
    // 添加模拟数据
    const stats = [
        { label: '覆盖乡镇', value: '24', icon: 'fa-map-marker-alt' },
        { label: '服务用户', value: '15,842', icon: 'fa-users' },
        { label: '月活跃度', value: '86%', icon: 'fa-chart-line' },
        { label: '平均响应', value: '2.3s', icon: 'fa-bolt' }
    ];
    
    // 动态添加统计数据
    const statsContainer = document.getElementById('stats-container');
    if (statsContainer) {
        statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas ${stat.icon}"></i>
                </div>
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }
    
    // 添加动态时间显示
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const now = new Date();
    const dateTimeElement = document.getElementById('current-datetime');
    if (dateTimeElement) {
        dateTimeElement.textContent = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

// 登录页特定功能
function initLoginPage() {
    console.log('初始化登录页功能');
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // 调用auth.js中的login函数
            login(username, password);
        });
    }
    
    // 添加演示账户提示
    const demoAccounts = document.createElement('div');
    demoAccounts.className = 'demo-accounts';
    demoAccounts.innerHTML = `
        <h4><i class="fas fa-lightbulb"></i> 演示账户</h4>
        <ul>
            <li><strong>admin</strong> - 任何密码（省级管理员）</li>
            <li><strong>townAdmin</strong> - 任何密码（乡镇管理员）</li>
            <li><strong>user123</strong> - 任何密码（普通用户）</li>
        </ul>
        <p class="demo-note">提示：这是一个演示系统，所有密码都会被接受</p>
    `;
    
    const formContainer = document.querySelector('.login-form-container');
    if (formContainer) {
        formContainer.appendChild(demoAccounts);
    }
}

// 管理后台页特定功能
function initDashboardPage() {
    console.log('初始化管理后台功能');
    
    // 这里可以添加管理后台的特定功能
    const permission = getCurrentPermission();
    
    if (permission.level === '省级') {
        showMessage('您拥有系统最高管理权限', 'success');
    } else if (permission.level === '乡镇级') {
        showMessage('您只能管理本乡镇数据', 'info');
    } else {
        showMessage('您只有查看权限，请联系管理员获取编辑权限', 'warning');
    }
}

// 全局函数（可以从HTML直接调用）
window.logout = logout;
window.showMessage = showMessage;

console.log('main.js加载完成');