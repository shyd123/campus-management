// 登录表单提交处理
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // 获取表单数据
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 验证表单
    if (!username || !password) {
        utils.showMessage('login-message', '用户名和密码不能为空', 'error');
        return;
    }

    try {
        // 发送登录请求
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        // 检查登录结果
        if (result.code === 200) {
            // 保存token和用户信息
            utils.saveToken(result.data.token);
            utils.saveUserInfo(result.data.user);

            // 根据角色跳转到不同页面
            const user = result.data.user;
            const role = user.role.toUpperCase();
            if (role === 'ADMIN') {
                utils.redirectTo('admin.html');
            } else if (role === 'HEADMASTER') {
                utils.redirectTo('headmaster.html');
            } else if (role === 'TEACHER') {
                utils.redirectTo('teacher.html');
            } else {
                utils.showMessage('login-message', '未知角色，请联系管理员', 'error');
            }
        } else {
            utils.showMessage('login-message', result.message || '登录失败', 'error');
        }
    } catch (error) {
        console.error('登录错误:', error);
        utils.showMessage('login-message', '登录失败，请检查网络连接', 'error');
    }
});