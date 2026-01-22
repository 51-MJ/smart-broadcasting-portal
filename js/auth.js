// 用户权限配置
const permissions = {
    // 超级管理员
    'admin': {
        canEdit: true,
        canDelete: true,
        regions: ['all'],
        level: '省级',
        displayName: '系统管理员'
    },
    // 乡镇管理员
    'townAdmin': {
        canEdit: true,
        canDelete: false,
        regions: ['A镇'],
        level: '乡镇级',
        displayName: 'A镇管理员'
    },
    // 普通用户
    'user': {
        canEdit: false,
        canDelete: false,
        regions: ['A镇-某村'],
        level: '村级',
        displayName: '普通用户'
    }
};

// 模拟登录函数
function login(username, password) {
    console.log('尝试登录：', username);
    
    // 简单的验证逻辑
    if (!username || !password) {
        showMessage('请输入用户名和密码', 'error');
        return false;
    }
    
    // 模拟API延迟
    showMessage('正在验证...', 'info');
    
    setTimeout(() => {
        let userType;
        
        // 根据用户名分配权限类型
        if (username === 'admin') {
            userType = 'admin';
        } else if (username.includes('town')) {
            userType = 'townAdmin';
        } else {
            userType = 'user';
        }
        
        // 保存到本地存储
        localStorage.setItem('userType', userType);
        localStorage.setItem('username', username);
        localStorage.setItem('loginTime', new Date().toLocaleString());
        
        showMessage('登录成功！正在跳转...', 'success');
        
        // 1.5秒后跳转到首页
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    }, 800);
    
    return false; // 防止表单默认提交
}

// 登出函数
function logout() {
    localStorage.clear();
    showMessage('已退出登录', 'info');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// 检查登录状态
function checkLogin() {
    const userType = localStorage.getItem('userType');
    if (!userType) {
        // 如果未登录且不在登录页，跳转到登录页
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
    return userType;
}

// 获取当前用户权限
function getCurrentPermission() {
    const userType = localStorage.getItem('userType') || 'user';
    return permissions[userType] || permissions['user'];
}

// 显示消息函数
function showMessage(text, type = 'info') {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                          type === 'error' ? 'exclamation-circle' : 
                          'info-circle'}"></i>
        <span>${text}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 添加到页面
    document.body.appendChild(messageDiv);
    
    // 3秒后自动消失
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 3000);
}

// 导出函数供其他文件使用
export { 
    permissions, 
    login, 
    logout, 
    checkLogin, 
    getCurrentPermission, 
    showMessage 
};