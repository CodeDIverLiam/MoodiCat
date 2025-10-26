## Local setup

1) 复制模板：
   cp src/main/resources/application-example.yml src/main/resources/application.yml

2) 设置环境变量：
   # macOS/Linux
   export DASHSCOPE_API_KEY="YOUR_DASHSCOPE_KEY"
   export DB_URL="jdbc:postgresql://localhost:5432/aidb"
   export DB_USERNAME="postgres"
   export DB_PASSWORD="your_password"
   export SERVER_PORT=10000

   # Windows PowerShell
   $env:DASHSCOPE_API_KEY="YOUR_DASHSCOPE_KEY"
   $env:DB_URL="jdbc:postgresql://localhost:5432/aidb"
   $env:DB_USERNAME="postgres"
   $env:DB_PASSWORD="your_password"
   $env:SERVER_PORT="10000"

3) 启动：
   ./mvnw spring-boot:run