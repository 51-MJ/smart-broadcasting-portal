// main.js - 主入口文件
import { checkLogin, getCurrentPermission, showMessage } from "./auth.js";
import { initUIEffects, updateUIByPermission } from "./ui.js";

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function() {
    console.log("页面加载完成 - 智慧广电系统");
    
    // 获取当前页面
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    console.log("当前页面:", currentPage);
    
    // 如果不是登录页，检查登录
    if (currentPage !== "login.html") {
        if (!checkLogin()) {
            console.log("未登录，跳转到登录页");
            window.location.href = "login.html";
            return;
        }
        
        // 显示欢迎信息
        const username = localStorage.getItem("username");
        if (username) {
            showMessage(\`欢迎 \${username}\`, "success");
        }
    }
    
    // 初始化UI
    initUIEffects();
    updateUIByPermission();
    
    // 如果是登录页，绑定表单
    if (currentPage === "login.html") {
        const form = document.getElementById("login-form");
        if (form) {
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                
                const username = document.getElementById("username")?.value;
                const password = document.getElementById("password")?.value;
                
                if (username && password) {
                    // 动态导入并调用login
                    import("./auth.js").then(module => {
                        module.login(username, password);
                    });
                } else {
                    alert("请输入用户名和密码");
                }
            });
        }
    }
});

// 全局登出函数
window.logout = function() {
    if (confirm("确定要退出登录吗？")) {
        import("./auth.js").then(module => {
            module.logout();
        });
    }
};
