// 初始化页面
utils.initPage();

// 当前编辑的数据
let currentEditData = null;
let currentEditType = null;

// 当前选中的教室布局类型
let currentCellType = 'seat';

// 当前选中的座位
let selectedSeat = null;

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
    if (tabId === 'student-management') {
        loadStudents();
    } else if (tabId === 'classroom-layout') {
        loadClassrooms();
    } else if (tabId === 'seat-arrangement') {
        loadCourses();
    } else if (tabId === 'leave-management') {
        loadLeaves();
    }
}

// 加载学生列表
async function loadStudents() {
    try {
        const students = await utils.apiRequest('/students');
        const tbody = document.querySelector('#student-table tbody');
        tbody.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.className}</td>
                <td>${student.studentId}</td>
                <td>
                    <button class="btn btn-default" onclick="editStudent(${student.id})">编辑</button>
                    <button class="btn btn-default" onclick="deleteStudent(${student.id})">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('加载学生失败:', error);
    }
}

// 加载教室列表
async function loadClassrooms() {
    try {
        const classrooms = await utils.apiRequest('/classrooms');
        const select = document.getElementById('classroom-select');
        select.innerHTML = '<option value="">选择教室</option>';

        classrooms.forEach(classroom => {
            const option = document.createElement('option');
            option.value = classroom.id;
            option.textContent = classroom.name;
            select.appendChild(option);
        });

        // 自动选择第一个选项并触发加载
        if (classrooms.length > 0) {
            select.value = classrooms[0].id;
            loadClassroomLayout();
        }
    } catch (error) {
        console.error('加载教室失败:', error);
    }
}

// 加载课程列表
async function loadCourses() {
    try {
        const courses = await utils.apiRequest('/courses');
        const select = document.getElementById('course-select');
        select.innerHTML = '<option value="">选择课程</option>';

        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            select.appendChild(option);
        });

        // 自动选择第一个选项并触发加载
        if (courses.length > 0) {
            select.value = courses[0].id;
            loadSeatArrangement();
        }
    } catch (error) {
        console.error('加载课程失败:', error);
    }
}

// 加载请假列表
async function loadLeaves() {
    try {
        const leaves = await utils.apiRequest('/leaves');
        const tbody = document.querySelector('#leave-table tbody');
        tbody.innerHTML = '';

        leaves.forEach(leave => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${leave.id}</td>
                <td>${leave.studentName}</td>
                <td>${leave.className}</td>
                <td>${leave.startTime}</td>
                <td>${leave.endTime}</td>
                <td>${leave.reason}</td>
                <td>
                    <button class="btn btn-default" onclick="editLeave(${leave.id})">编辑</button>
                    <button class="btn btn-default" onclick="deleteLeave(${leave.id})">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('加载请假失败:', error);
    }
}

// 加载教室布局
async function loadClassroomLayout() {
    const classroomId = document.getElementById('classroom-select').value;
    if (!classroomId) return;

    try {
        const layouts = await utils.apiRequest(`/classroom-layouts/${classroomId}`);
        if (layouts && layouts.length > 0) {
            renderClassroomLayout(layouts);
        } else {
            // 没有布局数据时，使用教室的行列数生成默认布局
            const classroom = await utils.apiRequest(`/classrooms/${classroomId}`);
            const rowCount = classroom.rowCount || 8;
            const colCount = classroom.colCount || 6;
            renderDefaultLayout(rowCount, colCount);
        }
    } catch (error) {
        console.error('加载教室布局失败:', error);
        renderDefaultLayout(8, 6);
    }
}

// 渲染教室布局
function renderClassroomLayout(layouts) {
    const grid = document.getElementById('layout-grid');
    grid.innerHTML = '';

    // 按行分组
    const rows = {};
    layouts.forEach(layout => {
        if (!rows[layout.row]) {
            rows[layout.row] = [];
        }
        rows[layout.row].push(layout);
    });

    // 渲染每一行
    Object.keys(rows).sort((a, b) => parseInt(a) - parseInt(b)).forEach(rowNum => {
        const row = document.createElement('div');
        row.className = 'layout-row';
        
        // 按列排序
        rows[rowNum].sort((a, b) => parseInt(a.col) - parseInt(b.col)).forEach(layout => {
            const cell = document.createElement('div');
            cell.className = `layout-cell ${layout.status.toLowerCase().replace('_', '-')}`;
            cell.dataset.row = layout.row;
            cell.dataset.col = layout.col;
            cell.dataset.status = layout.status;
            cell.onclick = () => updateCellStatus(cell);
            row.appendChild(cell);
        });
        
        grid.appendChild(row);
    });
}

// 渲染默认布局
function renderDefaultLayout(rowCount = 8, colCount = 6) {
    const grid = document.getElementById('layout-grid');
    grid.innerHTML = '';

    for (let row = 1; row <= rowCount; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'layout-row';
        
        for (let col = 1; col <= colCount; col++) {
            const cell = document.createElement('div');
            cell.className = 'layout-cell seat';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.dataset.status = 'SEAT';
            cell.onclick = () => updateCellStatus(cell);
            rowDiv.appendChild(cell);
        }
        
        grid.appendChild(rowDiv);
    }
}

// 更新单元格状态
function updateCellStatus(cell) {
    const statusMap = {
        'empty': 'EMPTY',
        'seat': 'SEAT',
        'teacher-desk': 'TEACHER_DESK'
    };

    const newStatus = statusMap[currentCellType];
    cell.className = `layout-cell ${currentCellType}`;
    cell.dataset.status = newStatus;
}

// 更改单元格类型
function changeCellType(type) {
    currentCellType = type;
}

// 保存教室布局
async function saveClassroomLayout() {
    const classroomId = document.getElementById('classroom-select').value;
    if (!classroomId) {
        alert('请选择教室');
        return;
    }

    const cells = document.querySelectorAll('#layout-grid .layout-cell');
    const layouts = [];

    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (!isNaN(row) && !isNaN(col)) {
            layouts.push({
                row: row,
                col: col,
                status: cell.dataset.status
            });
        }
    });

    try {
        await utils.apiRequest(`/classroom-layouts/${classroomId}`, 'PUT', layouts);
        alert('布局保存成功');
    } catch (error) {
        console.error('保存教室布局失败:', error);
        alert('布局保存失败');
    }
}

// 加载座位安排
async function loadSeatArrangement() {
    const courseId = document.getElementById('course-select').value;
    if (!courseId) return;

    try {
        // 获取课程信息
        const course = await utils.apiRequest(`/courses/${courseId}`);
        const classroomId = course.classroomId;
        const rowCount = course.rowCount || 10;
        const colCount = course.colCount || 12;
        
        // 获取座位安排
        let arrangements = [];
        try {
            arrangements = await utils.apiRequest(`/seat-arrangements/${courseId}`);
            console.log('座位安排数据:', arrangements);
        } catch (e) {
            console.log('暂无座位安排');
        }
        
        // 优先使用教室布局
        if (classroomId) {
            try {
                // 获取教室布局信息
                const classroomLayouts = await utils.apiRequest(`/classroom-layouts/${classroomId}`);
                // 根据教室布局生成座位安排布局，并叠加座位安排信息
                renderSeatArrangementFromLayout(classroomLayouts, arrangements);
            } catch (layoutError) {
                console.error('获取教室布局失败:', layoutError);
                // 使用默认行列数
                renderDefaultSeatArrangement(rowCount, colCount, arrangements);
            }
        } else {
            // 没有教室ID，使用默认行列数
            renderDefaultSeatArrangement(rowCount, colCount, arrangements);
        }
        
        loadStudentsForSeat();
    } catch (error) {
        console.error('加载座位安排失败:', error);
        // 使用默认行列数
        renderDefaultSeatArrangement();
        loadStudentsForSeat();
    }
}

// 渲染座位安排
function renderSeatArrangement(arrangements) {
    const grid = document.getElementById('seat-grid');
    grid.innerHTML = '';

    // 按行分组
    const rows = {};
    arrangements.forEach(arrangement => {
        if (!rows[arrangement.row]) {
            rows[arrangement.row] = [];
        }
        rows[arrangement.row].push(arrangement);
    });

    // 渲染每一行
    Object.keys(rows).sort((a, b) => parseInt(a) - parseInt(b)).forEach(rowNum => {
        const row = document.createElement('div');
        row.className = 'layout-row';
        
        // 按列排序
        rows[rowNum].sort((a, b) => parseInt(a.col) - parseInt(b.col)).forEach(arrangement => {
            const cell = document.createElement('div');
            cell.className = 'seat-cell';
            cell.dataset.row = arrangement.row;
            cell.dataset.col = arrangement.col;
            cell.dataset.studentId = arrangement.studentId;
            cell.onclick = () => selectSeat(cell);
            
            if (arrangement.studentName) {
                cell.innerHTML = `<div class="student-name">${arrangement.studentName}</div>`;
            }
            
            row.appendChild(cell);
        });
        
        grid.appendChild(row);
    });
}

// 渲染默认座位安排
function renderDefaultSeatArrangement(rowCount = 10, colCount = 12, arrangements = []) {
    const grid = document.getElementById('seat-grid');
    grid.innerHTML = '';

    // 创建座位安排映射，方便快速查找
    const arrangementMap = {};
    arrangements.forEach(arr => {
        const key = `${arr.row}-${arr.col}`;
        arrangementMap[key] = arr;
    });

    // 创建默认座位，使用传入的行列数
    for (let row = 1; row <= rowCount; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'layout-row';
        
        for (let col = 1; col <= colCount; col++) {
            const cell = document.createElement('div');
            cell.className = 'seat-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = () => selectSeat(cell);
            
            // 叠加座位安排信息
            const key = `${row}-${col}`;
            if (arrangementMap[key]) {
                const arr = arrangementMap[key];
                cell.dataset.studentId = arr.studentId;
                cell.innerHTML = `<div class="student-name">${arr.studentName}</div>`;
            }
            
            rowDiv.appendChild(cell);
        }
        
        grid.appendChild(rowDiv);
    }
}

// 根据教室布局渲染座位安排
function renderSeatArrangementFromLayout(layouts, arrangements = []) {
    const grid = document.getElementById('seat-grid');
    grid.innerHTML = '';

    // 创建座位安排映射，方便快速查找
    const arrangementMap = {};
    arrangements.forEach(arr => {
        const key = `${arr.row}-${arr.col}`;
        arrangementMap[key] = arr;
    });

    // 按行分组
    const rows = {};
    layouts.forEach(layout => {
        if (!rows[layout.row]) {
            rows[layout.row] = [];
        }
        rows[layout.row].push(layout);
    });

    // 渲染每一行
    Object.keys(rows).sort((a, b) => parseInt(a) - parseInt(b)).forEach(rowNum => {
        const row = document.createElement('div');
        row.className = 'layout-row';
        
        // 按列排序
        rows[rowNum].sort((a, b) => parseInt(a.col) - parseInt(b.col)).forEach(layout => {
            const cell = document.createElement('div');
            
            // 根据布局类型设置不同的样式
            if (layout.status === 'TEACHER_DESK') {
                cell.className = 'seat-cell teacher-desk';
                cell.onclick = null; // 讲台位置不可点击
            } else if (layout.status === 'EMPTY') {
                cell.className = 'seat-cell empty';
                cell.onclick = null; // 空地位置不可点击
            } else {
                cell.className = 'seat-cell';
                cell.onclick = () => selectSeat(cell);
            }
            
            cell.dataset.row = layout.row;
            cell.dataset.col = layout.col;
            cell.dataset.status = layout.status;
            
            // 叠加座位安排信息
            const key = `${layout.row}-${layout.col}`;
            if (arrangementMap[key]) {
                const arr = arrangementMap[key];
                cell.dataset.studentId = arr.studentId;
                cell.innerHTML = `<div class="student-name">${arr.studentName}</div>`;
            }
            
            row.appendChild(cell);
        });
        
        grid.appendChild(row);
    });
}

// 选择座位
function selectSeat(cell) {
    // 检查单元格状态，只有座位可以被选择
    const status = cell.dataset.status;
    if (status === 'TEACHER_DESK' || status === 'EMPTY') {
        return; // 讲台和空地不可选择
    }
    
    // 取消之前的选择
    if (selectedSeat) {
        selectedSeat.style.border = '';
    }
    
    // 选择当前座位
    selectedSeat = cell;
    cell.style.border = '2px solid #1890ff';
}

// 加载学生列表用于座位安排
async function loadStudentsForSeat() {
    const courseId = document.getElementById('course-select').value;
    if (!courseId) return;

    try {
        // 获取课程信息，然后获取对应班级的学生
        const course = await utils.apiRequest(`/courses/${courseId}`);
        const students = await utils.apiRequest(`/students?classId=${course.classId}`);
        
        // 获取当前座位安排
        let assignedStudents = [];
        try {
            const arrangements = await utils.apiRequest(`/seat-arrangements/${courseId}`);
            assignedStudents = arrangements.map(arr => arr.studentId);
        } catch (e) {
            console.log('暂无座位安排');
        }
        
        // 按分配状态排序：未分配的学生排在前面
        students.sort((a, b) => {
            const isAssignedA = assignedStudents.includes(a.id);
            const isAssignedB = assignedStudents.includes(b.id);
            
            if (isAssignedA && !isAssignedB) {
                return 1; // A已分配，B未分配，B排在前面
            } else if (!isAssignedA && isAssignedB) {
                return -1; // A未分配，B已分配，A排在前面
            } else {
                return 0; // 分配状态相同，保持原顺序
            }
        });
        
        // 渲染学生列表到右侧网格
        const studentList = document.getElementById('student-list');
        studentList.innerHTML = '';
        
        students.forEach(student => {
            const studentItem = document.createElement('div');
            // 检查学生是否已分配座位
            const isAssigned = assignedStudents.includes(student.id);
            studentItem.className = `student-item ${isAssigned ? 'student-assigned' : ''}`;
            studentItem.dataset.studentId = student.id;
            studentItem.dataset.studentName = student.name;
            studentItem.textContent = student.name;
            studentItem.onclick = () => assignStudentToSeat(student.id, student.name);
            studentList.appendChild(studentItem);
        });
    } catch (error) {
        console.error('加载学生列表失败:', error);
    }
}

// 分配座位（旧方法，保留兼容性）
function assignSeat() {
    if (!selectedSeat) {
        alert('请先选择座位');
        return;
    }

    // 检查座位状态，确保是有效的座位
    const status = selectedSeat.dataset.status;
    if (status === 'TEACHER_DESK' || status === 'EMPTY') {
        alert('不能在该位置分配学生');
        return;
    }

    const studentId = document.getElementById('student-select').value;
    if (!studentId) {
        alert('请选择学生');
        return;
    }

    // 检查该学生是否已经有座位，如果有则撤销
    const existingSeats = document.querySelectorAll('.seat-cell[data-student-id="' + studentId + '"]');
    existingSeats.forEach(seat => {
        if (seat !== selectedSeat) {
            // 清除原有座位的学生信息
            delete seat.dataset.studentId;
            seat.innerHTML = '';
        }
    });

    const studentName = document.getElementById('student-select').options[document.getElementById('student-select').selectedIndex].text;
    selectedSeat.dataset.studentId = studentId;
    selectedSeat.innerHTML = `<div class="student-name">${studentName}</div>`;
    
    // 更新学生列表状态
    updateStudentListStatus();
    
    // 自动选择下一个座位
    selectNextSeat();
}

// 分配学生到座位（新方法）
function assignStudentToSeat(studentId, studentName) {
    if (!selectedSeat) {
        alert('请先在左侧选择座位');
        return;
    }

    // 检查座位状态，确保是有效的座位
    const status = selectedSeat.dataset.status;
    if (status === 'TEACHER_DESK' || status === 'EMPTY') {
        alert('不能在该位置分配学生');
        return;
    }

    // 检查该学生是否已经有座位，如果有则撤销
    const existingSeats = document.querySelectorAll('.seat-cell[data-student-id="' + studentId + '"]');
    existingSeats.forEach(seat => {
        if (seat !== selectedSeat) {
            // 清除原有座位的学生信息
            delete seat.dataset.studentId;
            seat.innerHTML = '';
        }
    });

    selectedSeat.dataset.studentId = studentId;
    selectedSeat.innerHTML = `<div class="student-name">${studentName}</div>`;
    
    // 更新学生列表状态
    updateStudentListStatus();
    
    // 自动选择下一个座位
    selectNextSeat();
}

// 自动选择下一个座位
function selectNextSeat() {
    if (!selectedSeat) return;
    
    const currentRow = parseInt(selectedSeat.dataset.row);
    const currentCol = parseInt(selectedSeat.dataset.col);
    
    // 获取所有座位单元格
    const allSeats = Array.from(document.querySelectorAll('.seat-cell'));
    
    // 按行列排序
    allSeats.sort((a, b) => {
        const rowA = parseInt(a.dataset.row);
        const rowB = parseInt(b.dataset.row);
        const colA = parseInt(a.dataset.col);
        const colB = parseInt(b.dataset.col);
        
        if (rowA !== rowB) {
            return rowA - rowB;
        }
        return colA - colB;
    });
    
    // 找到当前座位的索引
    const currentIndex = allSeats.findIndex(seat => {
        const row = parseInt(seat.dataset.row);
        const col = parseInt(seat.dataset.col);
        return row === currentRow && col === currentCol;
    });
    
    // 找到下一个可用座位
    for (let i = currentIndex + 1; i < allSeats.length; i++) {
        const seat = allSeats[i];
        const status = seat.dataset.status;
        const hasStudent = seat.dataset.studentId;
        
        // 跳过讲台、空地和已有学生的座位
        if (status !== 'TEACHER_DESK' && status !== 'EMPTY' && !hasStudent) {
            // 取消之前的选择
            if (selectedSeat) {
                selectedSeat.style.border = '';
            }
            
            // 选择下一个座位
            selectedSeat = seat;
            seat.style.border = '2px solid #1890ff';
            return;
        }
    }
    
    // 如果没有下一个座位，保持当前选择
}

// 更新学生列表状态
function updateStudentListStatus() {
    const studentItems = Array.from(document.querySelectorAll('.student-item'));
    const assignedStudentIds = [];
    
    // 收集已分配座位的学生ID
    document.querySelectorAll('.seat-cell[data-student-id]').forEach(seat => {
        assignedStudentIds.push(parseInt(seat.dataset.studentId));
    });
    
    // 按分配状态排序：未分配的学生排在前面
    studentItems.sort((a, b) => {
        const studentIdA = parseInt(a.dataset.studentId);
        const studentIdB = parseInt(b.dataset.studentId);
        const isAssignedA = assignedStudentIds.includes(studentIdA);
        const isAssignedB = assignedStudentIds.includes(studentIdB);
        
        if (isAssignedA && !isAssignedB) {
            return 1; // A已分配，B未分配，B排在前面
        } else if (!isAssignedA && isAssignedB) {
            return -1; // A未分配，B已分配，A排在前面
        } else {
            return 0; // 分配状态相同，保持原顺序
        }
    });
    
    // 清空列表并重新添加排序后的学生
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = '';
    
    studentItems.forEach(item => {
        const studentId = parseInt(item.dataset.studentId);
        // 更新状态样式
        if (assignedStudentIds.includes(studentId)) {
            item.classList.add('student-assigned');
        } else {
            item.classList.remove('student-assigned');
        }
        studentList.appendChild(item);
    });
}

// 保存座位安排
async function saveSeatArrangement() {
    const courseId = document.getElementById('course-select').value;
    if (!courseId) {
        alert('请选择课程');
        return;
    }

    const seats = document.querySelectorAll('#seat-grid .seat-cell');
    const arrangements = [];

    seats.forEach(seat => {
        const studentId = seat.dataset.studentId;
        if (studentId) {
            const row = parseInt(seat.dataset.row);
            const col = parseInt(seat.dataset.col);
            if (!isNaN(row) && !isNaN(col)) {
                arrangements.push({
                    studentId: parseInt(studentId),
                    row: row,
                    col: col
                });
            }
        }
    });

    try {
        await utils.apiRequest(`/seat-arrangements/${courseId}`, 'PUT', arrangements);
        alert('座位安排保存成功');
    } catch (error) {
        console.error('保存座位安排失败:', error);
        alert('座位安排保存失败');
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
    if (type === 'student') {
        form.innerHTML = `
            <input type="hidden" name="id" value="${data ? data.id : ''}">
            <div class="form-row">
                <label for="name">姓名</label>
                <input type="text" id="name" name="name" value="${data ? data.name : ''}" required>
            </div>
            <div class="form-row">
                <label for="classId">班级</label>
                <select id="classId" name="classId" required>
                    <!-- 动态加载班级列表 -->
                </select>
            </div>
            <div class="form-row">
                <label for="studentId">学号</label>
                <input type="text" id="studentId" name="studentId" value="${data ? data.studentId : ''}" required>
            </div>
        `;
        // 加载班级列表
        loadClassesForStudent();
    } else if (type === 'leave') {
        // 格式化日期时间
        function formatDateTime(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        }
        
        const formattedStartTime = data ? formatDateTime(data.startTime) : '';
        const formattedEndTime = data ? formatDateTime(data.endTime) : '';
        
        form.innerHTML = `
            <input type="hidden" name="id" value="${data ? data.id : ''}">
            <div class="form-row">
                <label for="studentId">学生</label>
                <select id="studentId" name="studentId" required>
                    <!-- 动态加载学生列表 -->
                </select>
            </div>
            <div class="form-row">
                <label for="startTime">开始时间</label>
                <input type="datetime-local" id="startTime" name="startTime" value="${formattedStartTime}" required>
            </div>
            <div class="form-row">
                <label for="endTime">结束时间</label>
                <input type="datetime-local" id="endTime" name="endTime" value="${formattedEndTime}" required>
            </div>
            <div class="form-row">
                <label for="reason">原因</label>
                <input type="text" id="reason" name="reason" value="${data ? data.reason : ''}" required>
            </div>
        `;
        // 加载学生列表
        loadStudentsForLeave(data ? data.studentId : null);
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
        if (currentEditType === 'student') {
            if (currentEditData) {
                result = await utils.apiRequest(`/students/${formData.id}`, 'PUT', formData);
            } else {
                result = await utils.apiRequest('/students', 'POST', formData);
            }
            loadStudents();
        } else if (currentEditType === 'leave') {
            if (currentEditData) {
                result = await utils.apiRequest(`/leaves/${formData.id}`, 'PUT', formData);
            } else {
                result = await utils.apiRequest('/leaves', 'POST', formData);
            }
            loadLeaves();
        }

        hideModal();
    } catch (error) {
        console.error('保存数据失败:', error);
    }
}

// 加载班级列表（用于学生管理）
async function loadClassesForStudent() {
    try {
        const classes = await utils.apiRequest('/classes');
        const select = document.getElementById('classId');
        select.innerHTML = '';
        
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            if (currentEditData && currentEditData.classId === cls.id) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    } catch (error) {
        console.error('加载班级列表失败:', error);
    }
}

// 加载学生列表（用于请假管理）
async function loadStudentsForLeave(selectedStudentId = null) {
    try {
        const students = await utils.apiRequest('/students');
        const select = document.getElementById('studentId');
        select.innerHTML = '';
        
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            // 优先使用传入的selectedStudentId，其次使用currentEditData中的studentId
            if (selectedStudentId && selectedStudentId === student.id) {
                option.selected = true;
            } else if (!selectedStudentId && currentEditData && currentEditData.studentId === student.id) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    } catch (error) {
        console.error('加载学生列表失败:', error);
    }
}

// 编辑学生
async function editStudent(id) {
    try {
        const student = await utils.apiRequest(`/students/${id}`);
        showModal('编辑学生', 'student', student);
    } catch (error) {
        console.error('获取学生信息失败:', error);
    }
}

// 删除学生
async function deleteStudent(id) {
    if (confirm('确定要删除这个学生吗？')) {
        try {
            await utils.apiRequest(`/students/${id}`, 'DELETE');
            loadStudents();
        } catch (error) {
            console.error('删除学生失败:', error);
        }
    }
}

// 编辑请假
async function editLeave(id) {
    try {
        const leave = await utils.apiRequest(`/leaves/${id}`);
        showModal('编辑请假', 'leave', leave);
    } catch (error) {
        console.error('获取请假信息失败:', error);
    }
}

// 删除请假
async function deleteLeave(id) {
    if (confirm('确定要删除这个请假吗？')) {
        try {
            await utils.apiRequest(`/leaves/${id}`, 'DELETE');
            loadLeaves();
        } catch (error) {
            console.error('删除请假失败:', error);
        }
    }
}

// 生成布局
async function generateClassroomLayout() {
    const classroomId = document.getElementById('classroom-select').value;
    const rowCount = parseInt(document.getElementById('row-count').value);
    const colCount = parseInt(document.getElementById('col-count').value);

    if (!classroomId) {
        alert('请选择教室');
        return;
    }

    if (!rowCount || !colCount || rowCount < 1 || colCount < 1) {
        alert('请输入有效的行数和列数');
        return;
    }

    try {
        // 设置教室行列数
        await utils.apiRequest(`/classrooms/${classroomId}/size?rowCount=${rowCount}&colCount=${colCount}`, 'PUT', null);

        // 生成默认布局
        const result = await utils.apiRequest(`/classroom-layouts/${classroomId}/generate?rowCount=${rowCount}&colCount=${colCount}`, 'POST', null);

        // 渲染新布局
        renderClassroomLayout(result);
        alert('布局生成成功');
    } catch (error) {
        console.error('生成布局失败:', error);
        alert('布局生成失败');
    }
}

// 绑定事件
window.onload = function() {
    // 添加学生按钮
    document.getElementById('add-student-btn').addEventListener('click', function() {
        showModal('添加学生', 'student');
    });

    // 添加请假按钮
    document.getElementById('add-leave-btn').addEventListener('click', function() {
        showModal('添加请假', 'leave');
    });

    // 保存布局按钮
    document.getElementById('save-layout-btn').addEventListener('click', saveClassroomLayout);

    // 生成布局按钮
    document.getElementById('generate-layout-btn').addEventListener('click', generateClassroomLayout);

    // 保存座位安排按钮
    document.getElementById('save-seat-btn').addEventListener('click', saveSeatArrangement);

    // 取消按钮
    document.getElementById('modal-cancel').addEventListener('click', hideModal);

    // 保存按钮
    document.getElementById('modal-save').addEventListener('click', saveData);

    // 初始化拖拽调整大小功能
    initSplitView();

    // 初始加载学生列表
    loadStudents();
};

// 初始化分割视图拖拽功能
function initSplitView() {
    const container = document.querySelector('.split-container');
    if (!container) return;

    const leftPane = container.querySelector('.split-left');
    const handle = container.querySelector('.split-handle');
    const rightPane = container.querySelector('.split-right');

    let isResizing = false;

    handle.addEventListener('mousedown', function(e) {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;

        const containerRect = container.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        // 限制最小宽度为20%
        if (newWidth > 20 && newWidth < 80) {
            leftPane.style.flex = `0 0 ${newWidth}%`;
            rightPane.style.flex = `0 0 ${100 - newWidth}%`;
        }
    });

    document.addEventListener('mouseup', function() {
        isResizing = false;
        document.body.style.cursor = '';
    });
}