package com.legipilot.service.core.collaborator.domain;

import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.shared.domain.model.DocumentText;

import java.util.List;

public interface CollaboratorExtractorPort {

    List<Collaborator> extract(DocumentText document);

}
