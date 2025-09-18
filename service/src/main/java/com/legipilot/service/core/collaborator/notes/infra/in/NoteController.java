package com.legipilot.service.core.collaborator.notes.infra.in;

import com.legipilot.service.core.collaborator.notes.AddNoteUseCase;
import com.legipilot.service.core.collaborator.notes.DeleteNoteUseCase;
import com.legipilot.service.core.collaborator.notes.ModifyNoteUseCase;
import com.legipilot.service.core.collaborator.notes.domain.AddNote;
import com.legipilot.service.core.collaborator.notes.domain.DeleteNote;
import com.legipilot.service.core.collaborator.notes.domain.ModifyNote;
import com.legipilot.service.core.collaborator.domain.model.Collaborator;
import com.legipilot.service.core.company.infra.in.CollaboratorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/companies/{companyId}/collaborators/{collaboratorId}/notes")
@RequiredArgsConstructor
public class NoteController {

    private final AddNoteUseCase addNoteUseCase;
    private final ModifyNoteUseCase modifyNoteUseCase;
    private final DeleteNoteUseCase deleteNoteUseCase;

    @PostMapping
    public ResponseEntity<CollaboratorResponse> addNote(@PathVariable("collaboratorId") UUID collaboratorId,
                                                        @RequestBody CreateNoteRequest request) {
        Authentication authenticatedAdmin = SecurityContextHolder.getContext().getAuthentication();
        Collaborator collaborator = addNoteUseCase.execute(
                AddNote.builder()
                        .collaboratorId(collaboratorId)
                        .title(request.title())
                        .content(request.content())
                        .administratorEmail(authenticatedAdmin.getName())
                        .build()
        );
        return ResponseEntity.ok(
                CollaboratorResponse.from(collaborator)
        );
    }

//    export function useModifyNote() {
//    const queryClient = useQueryClient();
//
//        return useMutation({
//                mutationFn: async ({collaboratorId, companyId, content, title, id}: {
//            collaboratorId: UUID,
//                    companyId: UUID,
//                    title: string,
//                    content: string,
//                    id: UUID,
//        }) => {
//            const response = await serviceClient.patch<CollaboratorResponse>(`/companies/${companyId}/collaborators/${collaboratorId}/notes/${id}`, {
//                title: title,
//                        content: content
//            });
//            return response.data;
//        },
//        onSuccess: (collaborator: CollaboratorResponse) => {
//            queryClient.setQueryData(["collaborator", collaborator.id], () => collaborator);
//        },
//        onError: () => {
//                toast({
//                        title: "Ajout echoué",
//                description: "Désolé, une erreur est survenue lors de l'ajout de la note du collaborateur.",
//                variant: "destructive",
//            });
//        },
//    });
//    }

    @PatchMapping("/{id}")
    public ResponseEntity<CollaboratorResponse> modify(
            @PathVariable("collaboratorId") UUID collaboratorId, @PathVariable("id") UUID id,
            @RequestBody ModifyNoteRequest request) {
        Authentication authenticatedAdmin = SecurityContextHolder.getContext().getAuthentication();
        Collaborator collaborator = modifyNoteUseCase.execute(
                ModifyNote.builder()
                        .collaboratorId(collaboratorId)
                        .noteId(id)
                        .title(request.title())
                        .content(request.content())
                        .administratorEmail(authenticatedAdmin.getName())
                        .build()
        );
        return ResponseEntity.ok(
                CollaboratorResponse.from(collaborator)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CollaboratorResponse> delete(
            @PathVariable("collaboratorId") UUID collaboratorId, @PathVariable("id") UUID id) {
        Collaborator collaborator = deleteNoteUseCase.execute(
                DeleteNote.builder()
                        .collaboratorId(collaboratorId)
                        .noteId(id)
                        .build()
        );
        return ResponseEntity.ok(
                CollaboratorResponse.from(collaborator)
        );
    }

}
