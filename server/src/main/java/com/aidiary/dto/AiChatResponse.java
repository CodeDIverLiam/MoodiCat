package com.aidiary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class AiChatResponse {
    private String reply;
    private List<Action> actions;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Action {
        private String type;
        private Long id;
    }
}
