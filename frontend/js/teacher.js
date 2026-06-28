// 初始化页面
utils.initPage();

// 统一错误处理函数
function handleError(error, message = '操作失败') {
    console.error(message, error);
    alert(`${message}：${error.message || '未知错误'}`);
}

// 使用闭包管理全局状态
const attendanceState = (function() {
    let currentCourse = null;
    let currentDate = null;
    
    return {
        getCourse: () => currentCourse,
        setCourse: (course) => currentCourse = course,
        getDate: () => currentDate,
        setDate: (date) => currentDate = date,
        clear: () => {
            currentCourse = null;
            currentDate = null;
        }
    };
})();

/**
 * 标签页切换函数
 * @param {string} tabId - 标签页ID
 * @description 切换不同标签页的显示状态，并加载对应标签页的数据
 */
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
    if (tabId === 'teaching-tasks') {
        loadTeachingTasks();
    } else if (tabId === 'attendance-management') {
        // 考勤管理页面不需要加载课程列表，因为只能从授课任务页面进入
        // 但需要确保有课程信息
        if (!attendanceState.getCourse() || !attendanceState.getDate()) {
            // 如果没有课程信息，重定向到授课任务页面
            setTimeout(() => {
                switchTab('teaching-tasks');
                alert('请从授课任务页面进入考勤管理');
            }, 100);
        }
    }
}

/**
 * 加载授课任务
 * @returns {Promise<void>}
 * @description 从API获取授课任务，按当天、未来七天、过去七天分类并渲染
 */
async function loadTeachingTasks() {
    try {
        const tasks = await utils.apiRequest('/teaching-tasks');
        
        // 获取当前星期几（1-7，1表示星期一）
        const now = new Date();
        let currentWeekday = now.getDay();
        if (currentWeekday === 0) {
            currentWeekday = 7;
        }

        // 分类课程并计算日期
        const todayTasks = [];
        const futureTasks = [];
        const pastTasks = [];

        const today = now.toISOString().split('T')[0]; // 格式：YYYY-MM-DD

        tasks.forEach(task => {
            // 计算课程日期
            let taskDate = '';
            if (task.weekday === currentWeekday) {
                // 当天课程
                taskDate = today;
                task.date = taskDate;
                todayTasks.push(task);
            } else if (
                (currentWeekday < 7 && task.weekday > currentWeekday) ||
                (currentWeekday === 7 && task.weekday >= 1 && task.weekday <= 6)
            ) {
                // 未来七天
                const daysUntilTask = task.weekday - currentWeekday;
                const futureDate = new Date(now);
                futureDate.setDate(now.getDate() + (daysUntilTask > 0 ? daysUntilTask : daysUntilTask + 7));
                taskDate = futureDate.toISOString().split('T')[0];
                task.date = taskDate;
                futureTasks.push(task);
            } else {
                // 过去七天
                const daysSinceTask = currentWeekday - task.weekday;
                const pastDate = new Date(now);
                pastDate.setDate(now.getDate() - (daysSinceTask > 0 ? daysSinceTask : daysSinceTask - 7));
                taskDate = pastDate.toISOString().split('T')[0];
                task.date = taskDate;
                pastTasks.push(task);
            }
        });

        // 排序：按时间排序
        todayTasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
        futureTasks.sort((a, b) => {
            if (a.weekday !== b.weekday) {
                return a.weekday - b.weekday;
            }
            return a.startTime.localeCompare(b.startTime);
        });
        pastTasks.sort((a, b) => {
            if (a.weekday !== b.weekday) {
                return b.weekday - a.weekday;
            }
            return a.startTime.localeCompare(b.startTime);
        });

        // 渲染当天课程
        renderTasks(todayTasks, 'today-task-table', true);
        
        // 渲染未来七天课程
        renderTasks(futureTasks, 'future-task-table', false);
        
        // 渲染过去七天课程
        renderPastTasks(pastTasks, 'past-task-table');
        
    } catch (error) {
        handleError(error, '加载授课任务失败');
        // 渲染错误信息到所有表格
        document.querySelector('#today-task-table tbody').innerHTML = '<tr><td colspan="8" style="text-align: center;">加载失败，请重试</td></tr>';
        document.querySelector('#future-task-table tbody').innerHTML = '<tr><td colspan="8" style="text-align: center;">加载失败，请重试</td></tr>';
        document.querySelector('#past-task-table tbody').innerHTML = '<tr><td colspan="8" style="text-align: center;">加载失败，请重试</td></tr>';
    }
}

/**
 * 渲染任务列表
 * @param {Array} tasks - 任务列表数据
 * @param {string} tableId - 表格ID
 * @param {boolean} isToday - 是否为当天任务
 * @description 渲染任务列表到指定表格，为当天任务添加特殊样式
 */
function renderTasks(tasks, tableId, isToday) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    const fragment = document.createDocumentFragment();

    if (tasks.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<tr><td colspan="8" style="text-align: center;">无任务</td></tr>';
        fragment.appendChild(row);
    } else {
        tasks.forEach(task => {
            const row = document.createElement('tr');
            if (isToday) {
                row.className = 'today-task';
            }
            row.innerHTML = `
                <td>${task.name}</td>
                <td>${task.className}</td>
                <td>${task.classroomName}</td>
                <td>${task.subjectName}</td>
                <td>${task.date}</td>
                <td>${task.weekday}</td>
                <td>${task.startTime} - ${task.endTime}</td>
                <td>
                    <button class="btn btn-primary" onclick="goToAttendance(${task.id}, '${task.date}')">去点名</button>
                </td>
            `;
            fragment.appendChild(row);
        });
    }

    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}

/**
 * 渲染过去任务列表
 * @param {Array} tasks - 过去任务列表数据
 * @param {string} tableId - 表格ID
 * @description 渲染过去任务列表到指定表格，显示查看按钮
 */
function renderPastTasks(tasks, tableId) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    const fragment = document.createDocumentFragment();

    if (tasks.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<tr><td colspan="8" style="text-align: center;">无任务</td></tr>';
        fragment.appendChild(row);
    } else {
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.name}</td>
                <td>${task.className}</td>
                <td>${task.classroomName}</td>
                <td>${task.subjectName}</td>
                <td>${task.date}</td>
                <td>${task.weekday}</td>
                <td>${task.startTime} - ${task.endTime}</td>
                <td>
                    <button class="btn btn-default" onclick="viewAttendance(${task.id}, '${task.date}')">查看</button>
                </td>
            `;
            fragment.appendChild(row);
        });
    }

    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}

/**
 * 处理考勤操作（查看或跳转到考勤页面）
 * @param {number} courseId - 课程ID
 * @param {string} courseDate - 课程日期
 * @description 获取课程信息，设置当前考勤状态，切换到考勤管理标签页并加载考勤数据
 */
function handleAttendance(courseId, courseDate) {
    // 获取课程信息
    utils.apiRequest(`/courses/${courseId}`).then(course => {
        attendanceState.setCourse(course);
        attendanceState.setDate(courseDate || utils.getCurrentDate());
        
        // 显示课程信息
        showCourseInfo();
        
        // 切换到考勤管理标签
        switchTab('attendance-management');
        
        // 加载考勤
        loadAttendance();
    }).catch(error => {
        handleError(error, '获取课程信息失败');
    });
}

// 查看考勤记录（兼容旧代码）
function viewAttendance(courseId, courseDate) {
    handleAttendance(courseId, courseDate);
}

// 跳转到考勤页面（兼容旧代码）
function goToAttendance(courseId, courseDate) {
    handleAttendance(courseId, courseDate);
}

/**
 * 显示课程信息
 * @description 从考勤状态中获取课程信息并显示在页面上
 */
function showCourseInfo() {
    const course = attendanceState.getCourse();
    const date = attendanceState.getDate();
    if (!course) return;
    
    const courseInfo = document.getElementById('course-info');
    const dateInfo = document.getElementById('date-info');
    const timeInfo = document.getElementById('time-info');
    
    courseInfo.textContent = `课程: ${course.name}`;
    dateInfo.textContent = `日期: ${date}`;
    timeInfo.textContent = `时间: ${course.startTime} - ${course.endTime}`;
}



/**
 * 加载考勤记录
 * @returns {Promise<void>}
 * @description 从API获取考勤记录，加载学生列表，处理请假记录，生成考勤表格和座位图表
 */
async function loadAttendance() {
    const course = attendanceState.getCourse();
    const date = attendanceState.getDate();
    if (!course || !date) {
        // 如果没有课程信息，重定向到授课任务页面
        switchTab('teaching-tasks');
        return;
    }

    const courseId = course.id;

    try {
        // 获取学生请假记录
        const students = await utils.apiRequest(`/students?classId=${course.classId}`);
        const leaveRecords = await utils.apiRequest(`/leaves?classId=${course.classId}`);
        
        
        
        // 过滤出当天有效的请假记录
        const today = new Date(date);
        // 设置为UTC时间的0点
        const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        
        const todayLeaves = leaveRecords.filter(leave => {
            const leaveStart = new Date(leave.startTime);
            const leaveEnd = new Date(leave.endTime);
            
            // 转换为UTC时间并设置为0点
            const leaveStartUTC = new Date(Date.UTC(leaveStart.getFullYear(), leaveStart.getMonth(), leaveStart.getDate()));
            const leaveEndUTC = new Date(Date.UTC(leaveEnd.getFullYear(), leaveEnd.getMonth(), leaveEnd.getDate()));
            
            const isInRange = leaveStartUTC <= todayUTC && leaveEndUTC >= todayUTC;
            return isInRange;
        });
        
        // 创建学生ID到请假记录的映射
        const studentLeaveMap = {};
        todayLeaves.forEach(leave => {
            // 使用数字作为键，确保类型匹配
            const studentId = leave.studentId;
            studentLeaveMap[studentId] = leave;
        });

        const records = await utils.apiRequest(`/attendances/${courseId}?date=${date}`);
        const tbody = document.querySelector('#attendance-table tbody');
        tbody.innerHTML = '';

        if (records.length === 0) {
            // 如果没有考勤记录，加载学生列表并生成默认记录
            await loadStudentsForAttendance(courseId, studentLeaveMap);
        } else {
            // 显示已有考勤记录
            const fragment = document.createDocumentFragment();
            records.forEach(record => {
                const row = document.createElement('tr');
                // 检查学生是否有请假记录
                const studentId = record.studentId;
                const hasLeave = studentLeaveMap[studentId] !== undefined;
                const status = hasLeave ? 'LEAVE' : record.status;
                
                // 生成备注placeholder和值
                let remarkPlaceholder = '备注';
                let remarkValue = record.remark || '';
                let remarkReadonly = false;
                
                if (hasLeave) {
                    // 有班主任请假记录，显示请假原因
                    const leaveRecord = studentLeaveMap[studentId];
                    const leaveReason = leaveRecord.reason || '请假';
                    remarkValue = `班主任报备请假，请假原因：${leaveReason}`;
                    remarkPlaceholder = '请假原因';
                    remarkReadonly = true;
                } else {
                    // 无班主任请假记录，根据状态设置placeholder
                    switch(status) {
                        case 'PRESENT':
                            remarkPlaceholder = '填写课堂表现';
                            break;
                        case 'ABSENT':
                            remarkPlaceholder = '填写人员去向或去向消息';
                            break;
                        case 'LATE':
                            remarkPlaceholder = '填写迟到时间，迟到原因';
                            break;
                        case 'LEAVE':
                            remarkPlaceholder = '请假';
                            break;
                    }
                }
                
                // 生成状态按钮HTML
                let statusButtonsHTML = '';
                if (hasLeave) {
                    // 有班主任请假记录，锁定状态为请假
                    statusButtonsHTML = `
                        <div class="status-buttons" data-student-id="${record.studentId}">
                            <div class="status-btn" data-status="PRESENT" disabled aria-disabled="true" style="opacity: 0.5; cursor: not-allowed;">已到</div>
                            <div class="status-btn" data-status="ABSENT" disabled aria-disabled="true" style="opacity: 0.5; cursor: not-allowed;">缺勤</div>
                            <div class="status-btn" data-status="LATE" disabled aria-disabled="true" style="opacity: 0.5; cursor: not-allowed;">迟到</div>
                            <div class="status-btn active" data-status="LEAVE" disabled aria-disabled="true">请假</div>
                        </div>
                    `;
                } else {
                    // 无班主任请假记录，显示所有状态按钮（包括请假）
                    statusButtonsHTML = `
                        <div class="status-buttons" data-student-id="${record.studentId}">
                            <div class="status-btn ${record.status === 'PRESENT' ? 'active' : ''}" data-status="PRESENT">已到</div>
                            <div class="status-btn ${record.status === 'ABSENT' ? 'active' : ''}" data-status="ABSENT">缺勤</div>
                            <div class="status-btn ${record.status === 'LATE' ? 'active' : ''}" data-status="LATE">迟到</div>
                            <div class="status-btn ${record.status === 'LEAVE' ? 'active' : ''}" data-status="LEAVE">请假</div>
                        </div>
                    `;
                }
                
                row.innerHTML = `
                    <td>${record.studentName}</td>
                    <td>
                        ${statusButtonsHTML}
                    </td>
                    <td>
                        <input type="text" class="attendance-remark" data-student-id="${record.studentId}" value="${remarkValue}" placeholder="${remarkPlaceholder}" ${remarkReadonly ? 'readonly' : ''} ${remarkReadonly ? 'style="background-color: #f0f8ff; font-weight: bold;"' : ''}>
                    </td>
                `;
                fragment.appendChild(row);
            });
            tbody.appendChild(fragment);
        }
    } catch (error) {
        handleError(error, '加载考勤记录失败');
        const tbody = document.querySelector('#attendance-table tbody');
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">加载失败，请重试</td></tr>';
    }
    
    // 生成座位图表
    await generateSeatLayout();
}

/**
 * 加载学生列表用于考勤
 * @param {number} courseId - 课程ID
 * @param {Object} studentLeaveMap - 学生请假记录映射
 * @returns {Promise<void>}
 * @description 加载指定课程的学生列表，处理请假记录，生成考勤表格
 */
async function loadStudentsForAttendance(courseId, studentLeaveMap = {}) {
    try {
        // 获取课程信息，然后获取对应班级的学生
        const course = await utils.apiRequest(`/courses/${courseId}`);
        const students = await utils.apiRequest(`/students?classId=${course.classId}`);
        
        const tbody = document.querySelector('#attendance-table tbody');
        const fragment = document.createDocumentFragment();

        students.forEach(student => {
            const row = document.createElement('tr');
            // 检查学生是否有请假记录
            const studentId = student.id;
            const hasLeave = studentLeaveMap[studentId] !== undefined;
            
            // 生成备注placeholder和值
            let remarkPlaceholder = '备注';
            let remarkValue = '';
            let remarkReadonly = false;
            
            if (hasLeave) {
                // 有班主任请假记录，显示请假原因
                const leaveRecord = studentLeaveMap[studentId];
                const leaveReason = leaveRecord.reason || '请假';
                remarkValue = `班主任报备请假，请假原因：${leaveReason}`;
                remarkPlaceholder = '请假原因';
                remarkReadonly = true;
            } else {
                // 无班主任请假记录，设置默认placeholder
                remarkPlaceholder = '填写人员去向或去向消息';
            }
            
            // 生成状态按钮HTML
            let statusButtonsHTML = '';
            if (hasLeave) {
                // 有班主任请假记录，锁定状态为请假
                statusButtonsHTML = `
                    <div class="status-buttons" data-student-id="${student.id}">
                        <div class="status-btn" data-status="PRESENT" disabled aria-disabled="true" style="opacity: 0.5; cursor: not-allowed;">已到</div>
                        <div class="status-btn" data-status="ABSENT" disabled aria-disabled="true" style="opacity: 0.5; cursor: not-allowed;">缺勤</div>
                        <div class="status-btn" data-status="LATE" disabled aria-disabled="true" style="opacity: 0.5; cursor: not-allowed;">迟到</div>
                        <div class="status-btn active" data-status="LEAVE" disabled aria-disabled="true">请假</div>
                    </div>
                `;
            } else {
                // 无班主任请假记录，显示所有状态按钮（包括请假）
                statusButtonsHTML = `
                    <div class="status-buttons" data-student-id="${student.id}">
                        <div class="status-btn" data-status="PRESENT">已到</div>
                        <div class="status-btn active" data-status="ABSENT">缺勤</div>
                        <div class="status-btn" data-status="LATE">迟到</div>
                        <div class="status-btn" data-status="LEAVE">请假</div>
                    </div>
                `;
            }
            
            row.innerHTML = `
                <td>${student.name}</td>
                <td>
                    ${statusButtonsHTML}
                </td>
                <td>
                    <input type="text" class="attendance-remark" data-student-id="${student.id}" value="${remarkValue}" placeholder="${remarkPlaceholder}" ${remarkReadonly ? 'readonly' : ''} ${remarkReadonly ? 'style="background-color: #f0f8ff; font-weight: bold;"' : ''}>
                </td>
            `;
            fragment.appendChild(row);
        });

        tbody.innerHTML = '';
        tbody.appendChild(fragment);
    } catch (error) {
        handleError(error, '加载学生列表失败');
    }
}

/**
 * 保存考勤记录
 * @returns {Promise<void>}
 * @description 收集考勤记录数据，发送到API保存
 */
async function saveAttendance() {
    const course = attendanceState.getCourse();
    const date = attendanceState.getDate();
    if (!course || !date) {
        alert('请先从授课任务页面进入考勤管理');
        return;
    }

    const courseId = course.id;

    // 收集考勤记录
    const records = [];
    document.querySelectorAll('.status-buttons').forEach(buttons => {
        const studentId = parseInt(buttons.dataset.studentId);
        const activeBtn = buttons.querySelector('.status-btn.active');
        const status = activeBtn ? activeBtn.dataset.status : 'ABSENT';
        const remarkElement = document.querySelector(`.attendance-remark[data-student-id="${studentId}"]`);
        const remark = remarkElement ? remarkElement.value : '';
        
        records.push({
            studentId,
            status,
            remark
        });
    });

    try {
        await utils.apiRequest(`/attendances/${courseId}`, 'POST', {
            date,
            records
        });
        alert('考勤保存成功');
    } catch (error) {
        handleError(error, '保存考勤失败');
    }
}

/**
 * 全选已到
 * @description 将所有非报备请假状态的学生标记为已到状态
 * 区分两种请假状态：
 * 1. 报备请假（从班主任获得的请假报备）：按钮禁用，不被覆盖
 * 2. 临时请假（在表格中选择的请假状态）：按钮可用，可以被覆盖
 */
function markAllPresent() {
    document.querySelectorAll('.status-buttons').forEach(buttons => {
        const studentId = buttons.dataset.studentId;
        
        // 检查是否有按钮被禁用（报备请假）
        const hasDisabledBtn = Array.from(buttons.querySelectorAll('.status-btn')).some(btn => 
            btn.disabled || btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true'
        );
        if (hasDisabledBtn) {
            // 如果有按钮被禁用，说明是报备请假，跳过，不覆盖
            return;
        }
        
        // 移除所有按钮的active类
        buttons.querySelectorAll('.status-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // 为"已到"按钮添加active类
        const presentBtn = buttons.querySelector('[data-status="PRESENT"]');
        if (presentBtn) {
            presentBtn.classList.add('active');
        }
        
        // 更新备注输入框的placeholder
        const remarkElement = document.querySelector(`.attendance-remark[data-student-id="${studentId}"]`);
        if (remarkElement) {
            remarkElement.placeholder = '填写课堂表现';
        }
        
        // 更新座位状态
        const studentName = buttons.closest('tr').querySelector('td:first-child').textContent;
        updateStudentSeatStatus(studentName, 'PRESENT');
    });
}

/**
 * 生成座位图表
 * @returns {Promise<void>}
 * @description 从API获取座位安排数据和教室布局数据，生成座位图表，显示学生考勤状态
 */
async function generateSeatLayout() {
    const layoutContainer = document.getElementById('seat-layout');
    layoutContainer.innerHTML = '加载中...';
    
    const course = attendanceState.getCourse();
    if (!course) {
        layoutContainer.innerHTML = '无课程信息';
        return;
    }
    
    try {
        // 获取课程的座位安排数据
        const courseId = course.id;
        
        // 尝试获取座位安排数据
        let seatArrangements = [];
        try {
            seatArrangements = await utils.apiRequest(`/seat-arrangements/${courseId}`);
        } catch (error) {
            // 如果获取失败，尝试使用班级ID获取
            if (course.classId) {
                seatArrangements = await utils.apiRequest(`/seat-arrangements/class/${course.classId}`);
            }
        }
        
        // 获取教室布局数据
        const classroomId = course.classroomId;
        let classroom = { rowCount: 4, colCount: 8 };
        let classroomLayouts = [];
        try {
            classroom = await utils.apiRequest(`/classrooms/${classroomId}`);
            
            // 获取实际的教室布局数据
            classroomLayouts = await utils.apiRequest(`/classroom-layouts/${classroomId}`);
        } catch (error) {
        }
        
        const rowCount = classroom.rowCount || 4;
        const colCount = classroom.colCount || 8;
        
        // 生成座位布局
        layoutContainer.innerHTML = '';
        
        // 创建布局网格
        const gridElement = document.createElement('div');
        gridElement.className = 'layout-grid';
        
        // 生成布局
        for (let row = 0; row < rowCount; row++) {
            const rowElement = document.createElement('div');
            rowElement.className = 'layout-row';
            
            for (let col = 0; col < colCount; col++) {
                const cellElement = document.createElement('div');
                
                // 检查该位置的布局状态
                let cellType = 'seat';
                if (classroomLayouts && classroomLayouts.length > 0) {
                    // 查找该位置的布局信息
                    const layout = classroomLayouts.find(l => l.row === row + 1 && l.col === col + 1);
                    if (layout) {
                        switch(layout.status) {
                            case 'TEACHER_DESK':
                                cellType = 'teacher-desk';
                                break;
                            case 'EMPTY':
                                cellType = 'empty';
                                break;
                            case 'SEAT':
                            default:
                                cellType = 'seat';
                                break;
                        }
                    }
                } else {
                    // 使用默认布局逻辑
                    // 检查是否是讲台
                    if (row === 0 && col >= 2 && col <= 5) {
                        cellType = 'teacher-desk';
                    } 
                    // 检查是否是空地
                    else if ((row === 0 && (col < 2 || col > 5)) ||
                             (row === 1 && col === 2) ||
                             (row === 1 && col === 5) ||
                             (row === 2 && col === 2) ||
                             (row === 2 && col === 5) ||
                             (row === 3 && col === 2) ||
                             (row === 3 && col === 5)) {
                        cellType = 'empty';
                    }
                }
                
                cellElement.className = `layout-cell ${cellType}`;
                
                // 只有座位才显示学生
                if (cellType === 'seat') {
                    // 查找该座位的学生
                    let foundStudent = false;
                    let studentName = '';
                    for (const arrangement of seatArrangements) {
                        // 尝试不同的属性名，注意后端使用1-based索引，前端使用0-based索引
                        if ((arrangement.row === row + 1 && arrangement.col === col + 1) ||
                            (arrangement.row_num === row + 1 && arrangement.col_num === col + 1) ||
                            (arrangement.rowIndex === row && arrangement.colIndex === col)) {
                            if (arrangement.studentName || arrangement.student) {
                                studentName = arrangement.studentName || arrangement.student;
                                cellElement.textContent = studentName;
                                foundStudent = true;
                                break;
                            }
                        }
                    }
                    
                    // 如果没有找到学生，尝试直接使用学生列表填充
                    if (!foundStudent) {
                        // 从考勤记录中获取学生列表
                        const studentRows = document.querySelectorAll('#attendance-table tbody tr');
                        const students = [];
                        studentRows.forEach(row => {
                            const name = row.querySelector('td:first-child').textContent;
                            if (name && name !== '加载失败，请重试') {
                                students.push(name);
                            }
                        });
                        
                        // 简单的学生分配逻辑
                        const seatIndex = row * colCount + col;
                        if (seatIndex < students.length) {
                            studentName = students[seatIndex];
                            cellElement.textContent = studentName;
                        }
                    }
                    
                    // 如果找到学生，根据考勤状态添加颜色和阴影
                    if (studentName) {
                        // 查找学生的考勤状态
                        const studentRows = document.querySelectorAll('#attendance-table tbody tr');
                        studentRows.forEach(row => {
                            const name = row.querySelector('td:first-child').textContent;
                            if (name === studentName) {
                                const activeStatusBtn = row.querySelector('.status-btn.active');
                                if (activeStatusBtn) {
                                    const status = activeStatusBtn.dataset.status;
                                    // 根据状态添加颜色和阴影
                                    switch(status) {
                                        case 'PRESENT':
                                            cellElement.style.border = '2px solid green';
                                            cellElement.style.boxShadow = '0 0 8px green';
                                            cellElement.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                                            break;
                                        case 'ABSENT':
                                            cellElement.style.border = '2px solid red';
                                            cellElement.style.boxShadow = '0 0 8px red';
                                            cellElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                                            break;
                                        case 'LATE':
                                            cellElement.style.border = '2px solid yellow';
                                            cellElement.style.boxShadow = '0 0 8px yellow';
                                            cellElement.style.backgroundColor = 'rgba(255, 255, 0, 0.1)';
                                            break;
                                        case 'LEAVE':
                                            cellElement.style.border = '2px solid purple';
                                            cellElement.style.boxShadow = '0 0 8px purple';
                                            cellElement.style.backgroundColor = 'rgba(128, 0, 128, 0.1)';
                                            break;
                                    }
                                }
                            }
                        });
                    }
                }
                
                rowElement.appendChild(cellElement);
            }
            
            gridElement.appendChild(rowElement);
        }
        
        // 检查是否已经存在图例，如果存在则移除
        const existingLegend = layoutContainer.querySelector('.seat-legend');
        if (existingLegend) {
            existingLegend.remove();
        }
        
        // 添加图例
        const legendElement = document.createElement('div');
        legendElement.className = 'seat-legend';
        legendElement.innerHTML = `
            <div class="legend-item">
                <div class="legend-color empty"></div>
                <span>空地</span>
            </div>
            <div class="legend-item">
                <div class="legend-color seat"></div>
                <span>座位</span>
            </div>
            <div class="legend-item">
                <div class="legend-color teacher-desk"></div>
                <span>讲台</span>
            </div>
            <div class="legend-item">
                <div class="legend-color present"></div>
                <span>已到</span>
            </div>
            <div class="legend-item">
                <div class="legend-color absent"></div>
                <span>缺勤</span>
            </div>
            <div class="legend-item">
                <div class="legend-color late"></div>
                <span>迟到</span>
            </div>
            <div class="legend-item">
                <div class="legend-color leave"></div>
                <span>请假</span>
            </div>
        `;
        layoutContainer.appendChild(legendElement);
        
        layoutContainer.appendChild(gridElement);
        
    } catch (error) {
        handleError(error, '加载座位布局失败');
        layoutContainer.innerHTML = '加载座位布局失败';
        
        // 加载失败时显示默认布局
        generateDefaultSeatLayout();
    }
}

/**
 * 生成默认座位图表
 * @description 生成默认的座位布局，用于加载失败时显示
 */
function generateDefaultSeatLayout() {
    const layoutContainer = document.getElementById('seat-layout');
    layoutContainer.innerHTML = '';
    
    // 模拟座位布局数据
    // 4行8列的教室布局
    const layout = [
        ['empty', 'empty', 'teacher-desk', 'teacher-desk', 'teacher-desk', 'teacher-desk', 'empty', 'empty'],
        ['seat', 'seat', 'empty', 'seat', 'seat', 'empty', 'seat', 'seat'],
        ['seat', 'seat', 'empty', 'seat', 'seat', 'empty', 'seat', 'seat'],
        ['seat', 'seat', 'empty', 'seat', 'seat', 'empty', 'seat', 'seat']
    ];
    
    // 模拟学生数据
    const students = ['张三', '李四', '王五', '小明', '小红', '小李'];
    let studentIndex = 0;
    
    // 生成布局
    layout.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'layout-row';
        
        row.forEach((cellType, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = `layout-cell ${cellType}`;
            
            // 添加学生姓名到座位
            if (cellType === 'seat' && studentIndex < students.length) {
                cellElement.textContent = students[studentIndex];
                studentIndex++;
            }
            
            rowElement.appendChild(cellElement);
        });
        
        layoutContainer.appendChild(rowElement);
    });
}

/**
 * 更新单个学生的座位状态
 * @param {string} studentName - 学生姓名
 * @param {string} status - 考勤状态
 * @description 根据学生姓名和考勤状态更新座位的样式
 */
function updateStudentSeatStatus(studentName, status) {
    // 查找所有座位元素
    const seatElements = document.querySelectorAll('.layout-cell.seat');
    seatElements.forEach(seat => {
        if (seat.textContent === studentName) {
            // 清除之前的样式
            seat.style.border = '';
            seat.style.boxShadow = '';
            seat.style.backgroundColor = '';
            
            // 根据状态添加新的样式
            switch(status) {
                case 'PRESENT':
                    seat.style.border = '2px solid green';
                    seat.style.boxShadow = '0 0 8px green';
                    seat.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                    break;
                case 'ABSENT':
                    seat.style.border = '2px solid red';
                    seat.style.boxShadow = '0 0 8px red';
                    seat.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                    break;
                case 'LATE':
                    seat.style.border = '2px solid yellow';
                    seat.style.boxShadow = '0 0 8px yellow';
                    seat.style.backgroundColor = 'rgba(255, 255, 0, 0.1)';
                    break;
                case 'LEAVE':
                    seat.style.border = '2px solid purple';
                    seat.style.boxShadow = '0 0 8px purple';
                    seat.style.backgroundColor = 'rgba(128, 0, 128, 0.1)';
                    break;
            }
        }
    });
}

/**
 * 更新备注输入框的placeholder
 * @param {number} studentId - 学生ID
 * @param {string} status - 考勤状态
 * @description 根据学生ID和考勤状态更新备注输入框的placeholder
 */
function updateRemarkPlaceholder(studentId, status) {
    const remarkElement = document.querySelector(`.attendance-remark[data-student-id="${studentId}"]`);
    if (remarkElement) {
        let placeholder = '';
        switch(status) {
            case 'PRESENT':
                placeholder = '填写课堂表现';
                break;
            case 'ABSENT':
                placeholder = '填写人员去向或去向消息';
                break;
            case 'LATE':
                placeholder = '填写迟到时间，迟到原因';
                break;
            case 'LEAVE':
                placeholder = '请假';
                break;
            default:
                placeholder = '备注';
        }
        remarkElement.placeholder = placeholder;
    }
}

// 绑定事件
window.onload = function() {
    // 初始加载授课任务
    loadTeachingTasks();
    
    // 为状态按钮添加点击事件
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('status-btn')) {
            // 检查按钮是否被禁用（使用更可靠的方式）
            if (e.target.disabled || e.target.hasAttribute('disabled') || e.target.getAttribute('aria-disabled') === 'true') {
                return; // 如果禁用，不执行任何操作
            }
            
            const buttons = e.target.closest('.status-buttons');
            const studentId = buttons.dataset.studentId;
            const status = e.target.dataset.status;
            
            // 移除所有按钮的active类
            buttons.querySelectorAll('.status-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // 为当前点击的按钮添加active类
            e.target.classList.add('active');
            
            // 更新备注输入框的placeholder
            updateRemarkPlaceholder(studentId, status);
            
            // 直接更新对应学生的座位状态，避免重新生成整个布局
            updateStudentSeatStatus(buttons.closest('tr').querySelector('td:first-child').textContent, status);
        }
    });
};