# JWT Token 使用指南

## 1. 获取Token

### 登录请求
```
POST http://localhost:10000/api/v1/auth/login
Content-Type: application/json

{
  "username": "testuser2",
  "password": "password123"
}
```

### 响应示例
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlcjIiLCJpYXQiOjE3NjExOTU1NzAsImV4cCI6MTc2MTE5OTE3MH0.IiE7_6Aplp16-l6gBY8Qcf2II1cwlYNWilX69yJ5onc",
  "user": {
    "id": 9,
    "username": "testuser2",
    "email": "test2@example.com"
  }
}
```

## 2. 使用Token访问受保护的接口

### 在Postman中设置Authorization Header

1. **选择需要认证的接口**（如获取任务列表）
2. **点击Headers标签**
3. **添加请求头**：
   - **Key**: `Authorization`
   - **Value**: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlcjIiLCJpYXQiOjE3NjExOTU1NzAsImV4cCI6MTc2MTE5OTE3MH0.IiE7_6Aplp16-l6gBY8Qcf2II1cwlYNWilX69yJ5onc`

### 测试受保护的接口

#### 获取任务列表
```
GET http://localhost:10000/api/v1/tasks
Authorization: Bearer <your-token>
```

#### 创建任务
```
POST http://localhost:10000/api/v1/tasks
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "title": "测试任务",
  "description": "这是一个测试任务",
  "status": "pending"
}
```

#### 获取日记列表
```
GET http://localhost:10000/api/v1/diary-entries
Authorization: Bearer <your-token>
```

#### AI聊天
```
POST http://localhost:10000/api/v1/ai/chat
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "message": "你好，今天天气怎么样？"
}
```

## 3. 重要注意事项

### Token格式
- **必须包含**: `Bearer ` (注意Bearer后面有空格)
- **完整格式**: `Bearer <your-jwt-token>`

### Token过期
- Token有过期时间（默认1小时）
- 过期后需要重新登录获取新token
- 过期后会返回401 Unauthorized

### 错误处理
- **401 Unauthorized**: Token无效或过期
- **403 Forbidden**: Token有效但权限不足
- **400 Bad Request**: 请求格式错误

## 4. 快速测试命令

### 使用curl测试
```bash
# 1. 登录获取token
TOKEN=$(curl -s -X POST http://localhost:10000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser2","password":"password123"}' \
  | jq -r '.token')

# 2. 使用token访问受保护的接口
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:10000/api/v1/tasks
```

## 5. Postman Collection设置

### 环境变量
在Postman中设置环境变量：
- **变量名**: `jwt_token`
- **初始值**: (空)
- **当前值**: 从登录响应中复制的token

### 自动设置Authorization
在Postman的Tests标签中添加：
```javascript
// 登录后自动设置token
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("jwt_token", response.token);
}
```

### 使用环境变量
在需要认证的请求中，Authorization header设置为：
```
Bearer {{jwt_token}}
```
