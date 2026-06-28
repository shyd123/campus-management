# 封闭式学校点名系统

基于 Spring Boot + MyBatis + MySQL 的封闭式校园点名管理系统，支持多角色考勤、排座、课程管理等功能。

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Spring Boot 4.0.2 |
| ORM | MyBatis 4.0.1 |
| 数据库 | MySQL |
| 缓存 | Redis |
| 消息队列 | RabbitMQ |
| 安全 | Spring Security + JWT |
| 前端 | HTML / CSS / JavaScript |
| 构建工具 | Maven |
| JDK版本 | 17 |

## 功能模块

- **用户管理** — 管理员、班主任、教师多角色权限
- **考勤管理** — 签到/缺勤/迟到/请假状态记录
- **课程管理** — 课程编排与教师分配
- **班级管理** — 班级信息与班主任关联
- **学生管理** — 学生信息与学籍维护
- **教室管理** — 教室布局与座位编排
- **请假管理** — 请假申请与审批
- **座位安排** — 可视化座位分配

## 快速开始

### 1. 数据库

执行 `init.sql` 初始化数据库和测试数据：

```sql
source init.sql;
```

默认数据库名：`school_roll_call`

### 2. 后端启动

```bash
cd backend
mvn spring-boot:run
```

### 3. 前端访问

直接用浏览器打开 `frontend/login.html`，或部署到 Web 服务器。

### 默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 班主任 | zhangsan | 123456 |
| 班主任 | lisi | 123456 |
| 教师 | wangwu | 123456 |
| 教师 | zhaoliu | 123456 |
| 教师 | sunqi | 123456 |

## 项目结构

```
campus-management/
├── backend/            # Spring Boot 后端
│   ├── src/
│   ├── pom.xml
│   └── application.yml
├── frontend/           # 前端页面
│   ├── login.html
│   ├── admin.html
│   ├── teacher.html
│   ├── headmaster.html
│   ├── css/
│   └── js/
├── init.sql            # 数据库初始化脚本
└── .gitignore
```
