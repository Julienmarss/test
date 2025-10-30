package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.config.BaseIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class EventCategoriesControllerTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    void get_events_categories() throws Exception {
        mockMvc.perform(get("/event-categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("5e1a9f70-3b2c-4d8e-9a41-7c6b5a4d2e14"))
                .andExpect(jsonPath("$[0].sequence").value(1))
                .andExpect(jsonPath("$[0].icon").value("user-plus"))
                .andExpect(jsonPath("$[0].title").value("Procédure d'embauche"))
                .andExpect(jsonPath("$[0].subtitle").value("Accédez aux évènements liés à l'embauche d'un collaborateur"))
                .andExpect(jsonPath("$[0].action").value("Voir les évènements"))
                .andExpect(jsonPath("$[0].color").value("green"));
    }


    @Test
    void non_authentifie() throws Exception {
        mockMvc.perform(get("/event-categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

}
