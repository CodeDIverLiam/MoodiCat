package com.aidiary.config;

import com.aidiary.tools.DiaryTools;
import com.aidiary.tools.TaskTools;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;

@Configuration
public class ChatConfig {

    @Bean
    public ChatClient chatClient(ChatModel chatModel, DiaryTools diaryTools, TaskTools taskTools) {
        return ChatClient.builder(chatModel)
                .defaultTools(diaryTools, taskTools)
                .defaultSystem("""
          你是一个中英文双语对话的日记和任务助手。根据用户的语言回答。

          你可以帮助用户：
          1. 记录日记 - 当用户描述日常事件或心情时
          2. 创建任务 - 当用户要添加待办事项时  
          3. 设置提醒 - 当用户需要提醒时
          4. 更新任务 - 当用户要修改任务状态时
          5. 查看任务 - 当用户要查看任务列表时

          请根据用户的需求，使用相应的工具来帮助他们。如果用户明确说"不要写日记"或"只聊天"，则直接自然语言回复。
          
          在回复中，请清楚地告知用户你执行了什么操作以及结果。
        """)
                .build();
    }
}