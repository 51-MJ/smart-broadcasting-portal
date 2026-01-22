// ui.js - UI交互模块
import { getCurrentPermission } from "./auth.js";

// 初始化UI效果
export function initUIEffects() {
    console.log("初始化UI效果");
    
    // 滚动效果
    window.addEventListener("scroll", function() {
        const header = document.querySelector(".main-header");
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }
    });
    
    // 卡片悬停效果
    const cards = document.querySelectorAll(".feature-card");
    cards.forEach(card => {
        card.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-5px)";
            this.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
        });
        
        card.addEventListener("mouseleave", function() {
            this.style.transform = "translateY(0)";
            this.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        });
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            if (targetId !== "#") {
                const target = document.querySelector(targetId);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
}

// 根据权限更新UI
export function updateUIByPermission() {
    console.log("更新UI权限");
    
    const permission = getCurrentPermission();
    const username = localStorage.getItem("username") || "游客";
    
    // 更新用户信息显示
    const userInfo = document.getElementById("user-info");
    if (userInfo) {
        // 使用字符串拼接代替模板字符串，避免转义问题
        userInfo.innerHTML = '<i class="fas fa-user"></i>' +
                            '<span>' + username + '</span>' +
                            '<span class="badge">' + permission.level + '</span>';
    }
    
    // 控制管理员功能显示
    if (permission.level !== "省级") {
        document.querySelectorAll(".admin-only").forEach(el => {
            el.style.display = "none";
        });
    }
}
