CREATE DATABASE IF NOT EXISTS school_roll_call DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

USE school_roll_call;

-- 用户表
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL COMMENT '角色: admin/teacher/headmaster',
    email VARCHAR(100),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 班级表
CREATE TABLE IF NOT EXISTS sys_class (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    headmaster_id INT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 教室表
CREATE TABLE IF NOT EXISTS sys_classroom (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    row_count INT DEFAULT 0,
    col_count INT DEFAULT 0,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 学科表
CREATE TABLE IF NOT EXISTS sys_subject (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 考勤表
CREATE TABLE IF NOT EXISTS sys_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    student_id INT,
    student_name VARCHAR(50),
    date DATE,
    status VARCHAR(20) COMMENT 'PRESENT/ABSENT/LATE/LEAVE',
    remark VARCHAR(500),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 请假表
CREATE TABLE IF NOT EXISTS sys_leave (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    class_id INT,
    start_time DATETIME,
    end_time DATETIME,
    reason VARCHAR(500),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 座位安排表
CREATE TABLE IF NOT EXISTS sys_seat_arrangement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    student_id INT,
    `row` INT,
    `col` INT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 教室布局表
CREATE TABLE IF NOT EXISTS sys_classroom_layout (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classroom_id INT,
    `row` INT,
    `col` INT,
    status VARCHAR(20) COMMENT 'SEAT/EMPTY/TEACHER_DESK',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 课程表
CREATE TABLE IF NOT EXISTS sys_course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    class_id INT,
    classroom_id INT,
    subject_id INT,
    teacher_id INT,
    weekday INT COMMENT '星期几: 1-7',
    start_time VARCHAR(10) COMMENT '开始时间 HH:mm',
    end_time VARCHAR(10) COMMENT '结束时间 HH:mm',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 学生表
CREATE TABLE IF NOT EXISTS sys_student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) UNIQUE COMMENT '学号',
    class_id INT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 默认管理员账号 (密码: admin123)
INSERT INTO sys_user (username, password, role, email) VALUES
('admin', 'admin123', 'admin', 'admin@school.com'),
('zhangsan', '123456', 'headmaster', 'zhangsan@school.com'),
('lisi', '123456', 'headmaster', 'lisi@school.com'),
('wangwu', '123456', 'teacher', 'wangwu@school.com'),
('zhaoliu', '123456', 'teacher', 'zhaoliu@school.com'),
('sunqi', '123456', 'teacher', 'sunqi@school.com');

-- 班级
INSERT INTO sys_class (id, name, headmaster_id) VALUES
(1, '高一(1)班', 2),
(2, '高一(2)班', 3);

-- 教室
INSERT INTO sys_classroom (id, name, location, row_count, col_count) VALUES
(1, '101教室', '教学楼1楼', 8, 6),
(2, '102教室', '教学楼1楼', 8, 6),
(3, '201教室', '教学楼2楼', 8, 6);

-- 学科
INSERT INTO sys_subject (id, name) VALUES
(1, '语文'),
(2, '数学'),
(3, '英语'),
(4, '物理'),
(5, '化学');

-- 学生
INSERT INTO sys_student (id, name, student_id, class_id) VALUES
(1, '小明', '2024001', 1),
(2, '小红', '2024002', 1),
(3, '小刚', '2024003', 1),
(4, '小丽', '2024004', 1),
(5, '小强', '2024005', 1),
(6, '小芳', '2024006', 1),
(7, '小军', '2024007', 1),
(8, '小美', '2024008', 1),
(9, '小龙', '2024009', 2),
(10, '小华', '2024010', 2),
(11, '小杰', '2024011', 2),
(12, '小娜', '2024012', 2),
(13, '小磊', '2024013', 2),
(14, '小慧', '2024014', 2),
(15, '小涛', '2024015', 2),
(16, '小敏', '2024016', 2);

-- 课程
INSERT INTO sys_course (id, name, class_id, classroom_id, subject_id, teacher_id, weekday, start_time, end_time) VALUES
(1, '高一语文', 1, 1, 1, 4, 1, '08:00', '09:40'),
(2, '高一数学', 1, 1, 2, 5, 1, '10:00', '11:40'),
(3, '高一英语', 1, 1, 3, 6, 2, '08:00', '09:40'),
(4, '高一物理', 1, 2, 4, 4, 2, '10:00', '11:40'),
(5, '高一化学', 1, 2, 5, 5, 3, '08:00', '09:40'),
(6, '高一语文', 2, 3, 1, 4, 3, '10:00', '11:40'),
(7, '高一数学', 2, 3, 2, 5, 4, '08:00', '09:40'),
(8, '高一英语', 2, 3, 3, 6, 4, '10:00', '11:40');
