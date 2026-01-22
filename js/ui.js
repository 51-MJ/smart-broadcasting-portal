// UI交互效果
function initUIEffects() {
    // 滚动时导航栏变化
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // 卡片悬停效果
    const cards = document.querySelectorAll('.feature-card, .arch-placeholder');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // 平滑滚动（用于锚点链接）
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 返回顶部按钮
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    console.log('UI效果初始化完成');
}

// 根据权限更新UI
function updateUIByPermission() {
    const permission = getCurrentPermission();
    const username = localStorage.getItem('username') || '游客';
    
    // 更新用户信息显示
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <i class="fas fa-user"></i>
            <span>${username} (${permission.displayName})</span>
            <span class="permission-badge">${permission.level}</span>
        `;
    }
    
    // 控制编辑按钮
    const editButtons = document.querySelectorAll('.edit-btn, .admin-only');
    editButtons.forEach(btn => {
        if (btn.classList.contains('admin-only') && permission.level !== '省级') {
            btn.style.display = 'none';
        }
        
        if (btn.classList.contains('edit-btn')) {
            btn.disabled = !permission.canEdit;
            btn.title = permission.canEdit ? '点击编辑' : '无编辑权限';
        }
    });
    
    // 更新区域显示
    const regionElement = document.getElementById('current-region');
    if (regionElement) {
        regionElement.textContent = permission.regions.join(', ');
    }
    
    console.log('UI权限更新完成：', permission.level);
}

// 初始化表格或列表交互
function initDataTables() {
    // 如果有表格，添加排序功能
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const headers = table.querySelectorAll('th[data-sortable]');
        headers.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-column');
                const isAsc = header.classList.toggle('asc');
                sortTable(table, column, isAsc);
            });
        });
    });
}

function sortTable(table, column, ascending) {
    // 简单的表格排序逻辑
    console.log(`按${column}列${ascending ? '升序' : '降序'}排序`);
}

export { initUIEffects, updateUIByPermission, initDataTables };