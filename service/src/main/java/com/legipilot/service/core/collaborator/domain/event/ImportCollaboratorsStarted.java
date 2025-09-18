package com.legipilot.service.core.collaborator.domain.event;

import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.model.DocumentText;
import com.legipilot.service.shared.domain.model.Event;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.experimental.Accessors;

@Getter
@Accessors(fluent = true)
@RequiredArgsConstructor
@EqualsAndHashCode(callSuper = false)
@ToString
public class ImportCollaboratorsStarted extends Event {

    private final Administrator administrator;
    private final DocumentText document;
    private final Company company;

}
