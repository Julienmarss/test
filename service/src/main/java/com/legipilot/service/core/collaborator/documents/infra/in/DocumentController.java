package com.legipilot.service.core.collaborator.documents.infra.in;

import com.legipilot.service.core.collaborator.documents.AddDocumentsUseCase;
import com.legipilot.service.core.collaborator.documents.DeleteDocumentUseCase;
import com.legipilot.service.core.collaborator.documents.DocumentsService;
import com.legipilot.service.core.collaborator.documents.UpdateDocumentUseCase;
import com.legipilot.service.core.collaborator.documents.domain.DocumentType;
import com.legipilot.service.core.collaborator.documents.domain.DownloadUrl;
import com.legipilot.service.core.collaborator.documents.domain.command.AddDocuments;
import com.legipilot.service.core.collaborator.documents.domain.command.DeleteDocument;
import com.legipilot.service.core.collaborator.documents.domain.command.UpdateDocument;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.collaborator.domain.model.CollaboratorId;
import com.legipilot.service.core.company.infra.in.response.CollaboratorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/companies/{companyId}/collaborators/{collaboratorId}/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentsService service;
    private final AddDocumentsUseCase addDocumentsUseCase;
    private final UpdateDocumentUseCase updateDocumentUseCase;
    private final DeleteDocumentUseCase deleteDocumentUseCase;

    @PostMapping
    public ResponseEntity<CollaboratorResponse> add(@PathVariable("collaboratorId") UUID collaboratorId,
                                                    @RequestParam("documents") List<MultipartFile> documents) {
        Collaborator collaborator = addDocumentsUseCase.execute(
                AddDocuments.builder()
                        .collaboratorId(new CollaboratorId(collaboratorId))
                        .documents(documents)
//                        .type(DocumentType.fromLabel(type))
                        .build()
        );
        return ResponseEntity.ok(
                CollaboratorResponse.from(collaborator)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollaboratorDocumentResponse> visualize(@PathVariable("collaboratorId") UUID collaboratorId,
                                                                  @PathVariable("id") UUID id) {
        DownloadUrl url = service.visualize(id, new CollaboratorId(collaboratorId));
        return ResponseEntity.ok(
                new CollaboratorDocumentResponse(url.value())
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CollaboratorResponse> modify(@PathVariable("collaboratorId") UUID collaboratorId,
                                                       @PathVariable("id") UUID id,
                                                       @RequestBody UpdateDocumentRequest request) {
        Collaborator collaborator = updateDocumentUseCase.execute(
                UpdateDocument.builder()
                        .collaboratorId(new CollaboratorId(collaboratorId))
                        .documentId(id)
                        .type(DocumentType.fromLabel(request.type()))
                        .build()
        );
        return ResponseEntity.ok(
                CollaboratorResponse.from(collaborator)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CollaboratorResponse> delete(
            @PathVariable("collaboratorId") UUID collaboratorId, @PathVariable("id") UUID id) {
        Collaborator collaborator = deleteDocumentUseCase.execute(
                DeleteDocument.builder()
                        .collaboratorId(new CollaboratorId(collaboratorId))
                        .documentId(id)
                        .build()
        );
        return ResponseEntity.ok(
                CollaboratorResponse.from(collaborator)
        );
    }

}
