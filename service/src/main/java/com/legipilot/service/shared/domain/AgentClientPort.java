package com.legipilot.service.shared.domain;

import java.util.List;
import java.util.Map;

public interface AgentClientPort {
    String complete(String agentId, List<Message> messages, Map<String, Object> jsonSchema);

    record Message(String role, String content) {
        public static Message user(String c) { return new Message("user", c); }
        public static Message system(String c) { return new Message("system", c); }
        public static Message assistant(String c) { return new Message("assistant", c); }
    }
}
