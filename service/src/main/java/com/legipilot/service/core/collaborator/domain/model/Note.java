package com.legipilot.service.core.collaborator.domain.model;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.collaborator.notes.domain.ModifyNote;
import lombok.*;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.UUID;

@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Accessors(fluent = true)
@ToString
@EqualsAndHashCode
public final class Note {
    private UUID id;
    private String title;
    private String content;
    private String author;
    private LocalDate date;

    public void modify(ModifyNote command, Administrator administrator) {
        this.title = command.title();
        this.content = command.content();
        this.date = LocalDate.now();
        this.author = administrator.firstname() + " " + administrator.lastname();
    }

}

