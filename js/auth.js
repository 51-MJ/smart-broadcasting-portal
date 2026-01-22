// auth.js - 权限验证模块
export const permissions = {
    admin: { 
        level: "省级", 
        canEdit: true,
        displayName: "系统管理员",
        regions: ["all"]
    },
    townAdmin: { 
        level: "乡镇级", 
        canEdit: true,
        displayName: "乡镇管理员",
        regions: ["A镇"]
    },
    user: { 
        level: "村级", 
        canEdit: false,
        displayName: "普通用户",
        regions: ["A镇-某村"]
    }
};

// 登录函数
export function login(username, password) {
    console.log("登录:", username);
    
    if (!username || !password) {
        alert("请输入用户名和密码");
        return false;
    }
    
    // 确定用户类型
    let userType = "user";
    if (username === "admin") userType = "admin";
    else if (username.includes("town")) userType = "townAdmin";
    
    // 保存到本地存储
    localStorage.setItem("userType", userType);
    localStorage.setItem("username", username);
    localStorage.setItem("loggedIn", "true");
    
    console.log("登录成功，用户类型:", userType);
    
    // 延迟跳转，让用户看到成功消息
    setTimeout(() => {
        window.location.href = "index.html";
    }, 500);
    
    return true;
}

// 登出函数
export function logout() {
    localStorage.clear();
    console.log("已退出登录");
    window.location.href = "login.html";
}

// 检查登录状态
export function checkLogin() {
    return localStorage.getItem("loggedIn") === "true";
}

// 获取当前权限
export function getCurrentPermission() {
    const userType = localStorage.getItem("userType") || "user";
    return permissions[userType] || permissions.user;
}

// 显示消息
export function showMessage(text, type = "info") {
    console.log(`${type}: ${text}`);
    
    // 简单的alert实现
    if (type === "error") {
        alert("错误: " + text);
    } else if (type === "success") {
        alert("成功: " + text);
    }
}
