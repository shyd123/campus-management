// 初始化页面
utils.initPage();

// 当前编辑的数据
let currentEditData = null;
let currentEditType = null;

// 标签页切换
function switchTab(tabId) {
    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    // 显示选中的标签内容
    document.getElementById(tabId).style.display = 'block';

    // 更新侧边栏激活状态
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.className = '';
    });
    if (event && event.target) {
        event.target.className = 'active';
    }

    // 加载对应标签的数据
    if (tabId === 'user-management') {
        loadUsers();
    } else if (tabId === 'classroom-management') {
        loadClassrooms();
    } else if (tabId === 'subject-management') {
        loadSubjects();
    } else if (tabId === 'course-management') {
        loadCourses();
    } else if (tabId === 'class-management') {
        loadClasses();
    }
}

// 加载用户列表
async function loadUsers() {
    try {
        const users = await utils.apiRequest('/users');
        const tbody = document.querySelector('#user-table tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn btn-default" onclick="editUser(${user.id})">编辑</button>
                    <button class="btn btn-default" onclick="deleteUser(${user.id})">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('加载用户失败:', error);
    }
}

// 加载教室列表
async function loadClassrooms() {
    try {
        const classrooms = await utils.apiRequest('/classrooms');
        const tbody = document.querySelector('#classroom-table tbody');
        tbody.innerHTML = '';

        classrooms.forEach(classroom => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${classroom.id}</td>
                <td>${classroom.name}</td>
                <td>${classroom.location}</td>
                <td>
                    <button class="btn btn-default" onclick="editClassroom(${classroom.id})">编辑</button>
                    <button class="btn btn-default" onclick="deleteClassroom(${classroom.id})">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('加载教室失败:', error);
    }
}

// 加载学科列表
async function loadSubjects() {
    try {
        const subjects = await utils.apiRequest('/subjects');
        const tbody = document.querySelector('#subject-table tbody');
        tbody.innerHTML = '';

        subjects.forEach(subject => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subject.id}</td>
                <td>${subject.name}</td>
                <td>
                    <button class="btn btn-default" onclick="editSubject(${subject.id})">编辑</button>
                    <button class="btn btn-default" onclick="deleteSubject(${subject.id})">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('加载学科失败:', error);
    }
}

// 加载课程列表
async function loadCourses() {
    try {
        const courses = await utils.apiRequest('/courses');
        const tbody = document.querySelector('#course-table tbody');
        tbody.innerHTML = '';

        courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.id}</td>
                <td>${course.name}</td>
                <td>${course.className}</td>
                <td>${course.classroomName}</td>
                <td>${course.subjectName}</td>
                <td>${course.teacherName}</td>
                <td>${course.weekday}</td>
                <td>${course.startTime} - ${course.endTime}</td>
                <td>
                    <button class="btn btn-default" onclick="editCourse(${course.id})">编辑</button>
                    <button class="btn btn-default" onclick="deleteCourse(${course.id})">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('加载课程失败:', error);
    }
}

// 加载班级列表
async function loadClasses() {
    try {
        const classes = await utils.apiRequest('/classes');
        const tbody = document.querySelector('#class-table tbody');
        tbody.innerHTML = '';

        classes.forEach(cls => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cls.id}</td>
                <td>${cls.name}</td>
                <td>${cls.headmasterName}</td>
                <td>
                    <button class="btn btn-default" onclick="editClass(${cls.id})">编辑</button>
                    <button class="btn btn-default" onclick="deleteClass(${cls.id})">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('加载班级失败:', error);
    }
}

// 显示模态框
function showModal(title, type, data = null) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal').style.display = 'block';
    currentEditData = data;
    currentEditType = type;

    // 清空表单
    const form = document.getElementById('modal-form');
    form.innerHTML = '';

    // 根据类型生成表单
    if (type === 'user') {
        form.innerHTML = `
            <input type="hidden" name="id" value="${data ? data.id : ''}">
            <div class="form-row">
                <label for="username">用户名</label>
                <input type="text" id="username" name="username" value="${data ? data.username : ''}" required>
            </div>
            <div class="form-row">
                <label for="password">密码</label>
                <input type="password" id="password" name="password" ${data ? '' : 'required'}>
            </div>
            <div class="form-row">
                <label for="role">角色</label>
                <select id="role" name="role" required>
                    <option value="admin" ${data && data.role === 'admin' ? 'selected' : ''}>管理员</option>
                    <option value="headmaster" ${data && data.role === 'headmaster' ? 'selected' : ''}>班主任</option>
                    <option value="teacher" ${data && data.role === 'teacher' ? 'selected' : ''}>教师</option>
                </select>
            </div>
            <div class="form-row">
                <label for="email">邮箱</label>
                <input type="email" id="email" name="email" value="${data ? data.email : ''}" required>
            </div>
        `;
    } else if (type === 'classroom') {
        form.innerHTML = `
            <input type="hidden" name="id" value="${data ? data.id : ''}">
            <div class="form-row">
                <label for="name">教室名称</label>
                <input type="text" id="name" name="name" value="${data ? data.name : ''}" required>
            </div>
            <div class="form-row">
                <label for="location">位置</label>
                <input type="text" id="location" name="location" value="${data ? data.location : ''}" required>
            </div>
        `;
    } else if (type === 'subject') {
        form.innerHTML = `
            <input type="hidden" name="id" value="${data ? data.id : ''}">
            <div class="form-row">
                <label for="name">学科名称</label>
                <input type="text" id="name" name="name" value="${data ? data.name : ''}" required>
            </div>
        `;
    } else if (type === 'course') {
        // 这里需要加载班级、教室、学科、教师列表
        form.innerHTML = `
            <input type="hidden" name="id" value="${data ? data.id : ''}">
            <div class="form-row">
                <label for="name">课程名称</label>
                <input type="text" id="name" name="name" value="${data ? data.name : ''}" required>
            </div>
            <div class="form-row">
                <label for="classId">班级</label>
                <select id="classId" name="classId" required>
                    <!-- 动态加载班级列表 -->
                </select>
            </div>
            <div class="form-row">
                <label for="classroomId">教室</label>
                <select id="classroomId" name="classroomId" required>
                    <!-- 动态加载教室列表 -->
                </select>
            </div>
            <div class="form-row">
                <label for="subjectId">学科</label>
                <select id="subjectId" name="subjectId" required>
                    <!-- 动态加载学科列表 -->
                </select>
            </div>
            <div class="form-row">
                <label for="teacherId">教师</label>
                <select id="teacherId" name="teacherId" required>
                    <!-- 动态加载教师列表 -->
                </select>
            </div>
            <div class="form-row">
                <label for="weekday">星期</label>
                <select id="weekday" name="weekday" required>
                    <option value="1" ${data && data.weekday === 1 ? 'selected' : ''}>星期一</option>
                    <option value="2" ${data && data.weekday === 2 ? 'selected' : ''}>星期二</option>
                    <option value="3" ${data && data.weekday === 3 ? 'selected' : ''}>星期三</option>
                    <option value="4" ${data && data.weekday === 4 ? 'selected' : ''}>星期四</option>
                    <option value="5" ${data && data.weekday === 5 ? 'selected' : ''}>星期五</option>
                    <option value="6" ${data && data.weekday === 6 ? 'selected' : ''}>星期六</option>
                    <option value="7" ${data && data.weekday === 7 ? 'selected' : ''}>星期日</option>
                </select>
            </div>
            <div class="form-row">
                <label for="startTime">开始时间</label>
                <input type="time" id="startTime" name="startTime" value="${data ? data.startTime : ''}" required>
            </div>
            <div class="form-row">
                <label for="endTime">结束时间</label>
                <input type="time" id="endTime" name="endTime" value="${data ? data.endTime : ''}" required>
            </div>
        `;
        // 加载下拉列表数据
        loadCourseFormData();
    } else if (type === 'class') {
        form.innerHTML = `
            <input type="hidden" name="id" value="${data ? data.id : ''}">
            <div class="form-row">
                <label for="name">班级名称</label>
                <input type="text" id="name" name="name" value="${data ? data.name : ''}" required>
            </div>
            <div class="form-row">
                <label for="headmasterId">班主任</label>
                <select id="headmasterId" name="headmasterId" required>
                    <!-- 动态加载班主任列表 -->
                </select>
            </div>
        `;
        // 加载班主任列表
        loadHeadmasterList();
    }
}

// 隐藏模态框
function hideModal() {
    document.getElementById('modal').style.display = 'none';
    currentEditData = null;
    currentEditType = null;
}

// 保存数据
async function saveData() {
    const form = document.getElementById('modal-form');
    const formData = utils.getFormData('modal-form');

    try {
        let result;
        if (currentEditType === 'user') {
            if (currentEditData) {
                result = await utils.apiRequest(`/users/${formData.id}`, 'PUT', formData);
            } else {
                result = await utils.apiRequest('/users', 'POST', formData);
            }
            loadUsers();
        } else if (currentEditType === 'classroom') {
            if (currentEditData) {
                result = await utils.apiRequest(`/classrooms/${formData.id}`, 'PUT', formData);
            } else {
                result = await utils.apiRequest('/classrooms', 'POST', formData);
            }
            loadClassrooms();
        } else if (currentEditType === 'subject') {
            if (currentEditData) {
                result = await utils.apiRequest(`/subjects/${formData.id}`, 'PUT', formData);
            } else {
                result = await utils.apiRequest('/subjects', 'POST', formData);
            }
            loadSubjects();
        } else if (currentEditType === 'course') {
            if (currentEditData) {
                result = await utils.apiRequest(`/courses/${formData.id}`, 'PUT', formData);
            } else {
                result = await utils.apiRequest('/courses', 'POST', formData);
            }
            loadCourses();
        } else if (currentEditType === 'class') {
            if (currentEditData) {
                result = await utils.apiRequest(`/classes/${formData.id}`, 'PUT', formData);
            } else {
                result = await utils.apiRequest('/classes', 'POST', formData);
            }
            loadClasses();
        }

        hideModal();
    } catch (error) {
        console.error('保存数据失败:', error);
    }
}

// 加载课程表单数据
async function loadCourseFormData() {
    try {
        // 加载班级列表
        const classes = await utils.apiRequest('/classes');
        const classSelect = document.getElementById('classId');
        classSelect.innerHTML = '';
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            if (currentEditData && currentEditData.classId === cls.id) {
                option.selected = true;
            }
            classSelect.appendChild(option);
        });

        // 加载教室列表
        const classrooms = await utils.apiRequest('/classrooms');
        const classroomSelect = document.getElementById('classroomId');
        classroomSelect.innerHTML = '';
        classrooms.forEach(classroom => {
            const option = document.createElement('option');
            option.value = classroom.id;
            option.textContent = classroom.name;
            if (currentEditData && currentEditData.classroomId === classroom.id) {
                option.selected = true;
            }
            classroomSelect.appendChild(option);
        });

        // 加载学科列表
        const subjects = await utils.apiRequest('/subjects');
        const subjectSelect = document.getElementById('subjectId');
        subjectSelect.innerHTML = '';
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            if (currentEditData && currentEditData.subjectId === subject.id) {
                option.selected = true;
            }
            subjectSelect.appendChild(option);
        });

        // 加载教师列表
        const users = await utils.apiRequest('/users');
        const teacherSelect = document.getElementById('teacherId');
        teacherSelect.innerHTML = '';
        users.forEach(user => {
            if (user.role.toUpperCase() === 'TEACHER') {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.username;
                if (currentEditData && currentEditData.teacherId === user.id) {
                    option.selected = true;
                }
                teacherSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('加载课程表单数据失败:', error);
    }
}

// 加载班主任列表
async function loadHeadmasterList() {
    try {
        const users = await utils.apiRequest('/users');
        const headmasterSelect = document.getElementById('headmasterId');
        headmasterSelect.innerHTML = '';
        users.forEach(user => {
            if (user.role.toUpperCase() === 'HEADMASTER') {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.username;
                if (currentEditData && currentEditData.headmasterId === user.id) {
                    option.selected = true;
                }
                headmasterSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('加载班主任列表失败:', error);
    }
}

// 编辑用户
async function editUser(id) {
    try {
        const user = await utils.apiRequest(`/users/${id}`);
        showModal('编辑用户', 'user', user);
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
}

// 删除用户
async function deleteUser(id) {
    if (confirm('确定要删除这个用户吗？')) {
        try {
            await utils.apiRequest(`/users/${id}`, 'DELETE');
            loadUsers();
        } catch (error) {
            console.error('删除用户失败:', error);
        }
    }
}

// 编辑教室
async function editClassroom(id) {
    try {
        const classroom = await utils.apiRequest(`/classrooms/${id}`);
        showModal('编辑教室', 'classroom', classroom);
    } catch (error) {
        console.error('获取教室信息失败:', error);
    }
}

// 删除教室
async function deleteClassroom(id) {
    if (confirm('确定要删除这个教室吗？')) {
        try {
            await utils.apiRequest(`/classrooms/${id}`, 'DELETE');
            loadClassrooms();
        } catch (error) {
            console.error('删除教室失败:', error);
        }
    }
}

// 编辑学科
async function editSubject(id) {
    try {
        const subject = await utils.apiRequest(`/subjects/${id}`);
        showModal('编辑学科', 'subject', subject);
    } catch (error) {
        console.error('获取学科信息失败:', error);
    }
}

// 删除学科
async function deleteSubject(id) {
    if (confirm('确定要删除这个学科吗？')) {
        try {
            await utils.apiRequest(`/subjects/${id}`, 'DELETE');
            loadSubjects();
        } catch (error) {
            console.error('删除学科失败:', error);
        }
    }
}

// 编辑课程
async function editCourse(id) {
    try {
        const course = await utils.apiRequest(`/courses/${id}`);
        showModal('编辑课程', 'course', course);
    } catch (error) {
        console.error('获取课程信息失败:', error);
    }
}

// 删除课程
async function deleteCourse(id) {
    if (confirm('确定要删除这个课程吗？')) {
        try {
            await utils.apiRequest(`/courses/${id}`, 'DELETE');
            loadCourses();
        } catch (error) {
            console.error('删除课程失败:', error);
        }
    }
}

// 编辑班级
async function editClass(id) {
    try {
        const cls = await utils.apiRequest(`/classes/${id}`);
        showModal('编辑班级', 'class', cls);
    } catch (error) {
        console.error('获取班级信息失败:', error);
    }
}

// 删除班级
async function deleteClass(id) {
    if (confirm('确定要删除这个班级吗？')) {
        try {
            await utils.apiRequest(`/classes/${id}`, 'DELETE');
            loadClasses();
        } catch (error) {
            console.error('删除班级失败:', error);
        }
    }
}

// 绑定事件
window.onload = function() {
    // 添加用户按钮
    document.getElementById('add-user-btn').addEventListener('click', function() {
        showModal('添加用户', 'user');
    });

    // 添加教室按钮
    document.getElementById('add-classroom-btn').addEventListener('click', function() {
        showModal('添加教室', 'classroom');
    });

    // 添加学科按钮
    document.getElementById('add-subject-btn').addEventListener('click', function() {
        showModal('添加学科', 'subject');
    });

    // 添加课程按钮
    document.getElementById('add-course-btn').addEventListener('click', function() {
        showModal('添加课程', 'course');
    });

    // 添加班级按钮
    document.getElementById('add-class-btn').addEventListener('click', function() {
        showModal('添加班级', 'class');
    });

    // 取消按钮
    document.getElementById('modal-cancel').addEventListener('click', hideModal);

    // 保存按钮
    document.getElementById('modal-save').addEventListener('click', saveData);

    // 初始加载用户列表
    loadUsers();
};