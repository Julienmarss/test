package com.legipilot.service.core.collaborator.events.infra.in;

import com.legipilot.service.config.BaseIntegrationTest;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class EventsControllerTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final UUID categoryId = UUID.fromString("24c7e8a1-7b2f-4c9d-8a33-5e6f1d0a9b13");

    @Test
    @WithMockUser
    void get_events() throws Exception {
        Collaborator collab = etantDonneLeCollaborateur();
        mockMvc.perform(get("/collaborators/%s/events?categoryId=%s".formatted(collab.id(), categoryId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(csrf()))
                .andExpect(status().isOk())

                // tableau de 2 événements
                .andExpect(jsonPath("$", hasSize(2)))

                // === Event 0 : Licenciement pour faute grave ===
                .andExpect(jsonPath("$[0].id").value("6a891796-6388-447f-97fc-abf9dd386a51"))
                .andExpect(jsonPath("$[0].title").value("Licenciement pour faute grave"))
                .andExpect(jsonPath("$[0].subtitle").value("Licencier un salarié pour une faute grave"))

                // === Event 1 : Licenciement pour faute simple ===
                .andExpect(jsonPath("$[1].id").value("6a891796-6388-447f-97fc-abf9dd386a52"))
                .andExpect(jsonPath("$[1].title").value("Licenciement pour faute simple"))
                .andExpect(jsonPath("$[1].subtitle").value("Licencier un salarié pour une faute simple"));
    }

    @Test
    void non_authentifie() throws Exception {
        mockMvc.perform(get("/events?categoryId=" + categoryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

}
