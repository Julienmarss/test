import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {OutlineButton} from "@/components/ui/buttons/OutlineButton";
import {Minus, Plus} from "lucide-react";
import {Input} from "@/components/ui/Input";
import {ActionButton} from "@/components/ui/buttons/ActionButton";
import {useEffect, useState} from "react";
import {copyToClipboard} from "@/components/utils/user-actions";
import {UUID} from "node:crypto";
import {Ellipsis} from "@/components/ui/Ellipsis";
import {Trash} from "@/components/ui/icons/Trash";
import {useAddNote, useDeleteNote, useModifyNote} from "@/api/collaborator/note.api";
import {Textarea} from "@/components/ui/Textarea";
import { Pencil } from "@/components/ui/icons/Pencil";
import {CollaboratorResponse, NoteResponse} from "@/api/collaborator/collaborators.dto";

type Props = {
    collaborator: CollaboratorResponse;
    companyId: UUID;
};
export const NotesCard = ({collaborator, companyId}: Props) => {
    const [ajoutNote, setAjoutNote] = useState(false);
    const [noteToModify, setNoteToModify] = useState<NoteResponse>();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const {mutate: addNote, isSuccess} = useAddNote();
    const {mutate: modifyNote, isSuccess: isModifySuccess} = useModifyNote();
    const {mutate: deleteNote} = useDeleteNote();

    useEffect(() => {
        if (isSuccess) {
            setAjoutNote(false);
            setTitle("");
            setContent("");
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isModifySuccess) {
            setNoteToModify(undefined);
        }
    }, [isModifySuccess]);

    return (
        <Card className="border border-slate-200 rounded-xl">
            <CardHeader className="cursor-pointer">
                <CardTitle className="flex items-center justify-between flex-col gap-2 md:flex-row md:gap-0">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                        </svg>

                        <span className="text-lg font-medium text-gray-900">Notes</span>
                    </div>
                    {
                        ajoutNote ? (
                            <OutlineButton onClick={() => setAjoutNote(false)}>
                                <Minus className="w-4 h-4 text-gray-500"/>
                                Ne pas ajouter
                            </OutlineButton>
                        ) : (
                            <OutlineButton onClick={() => setAjoutNote(true)}>
                                <Plus className="w-4 h-4 text-gray-500"/>
                                Ajouter une note
                            </OutlineButton>
                        )
                    }
                </CardTitle>
            </CardHeader>
            <CardContent>
                {collaborator.notes.length > 0 &&
                    <div className="flex flex-col justify-between border border-slate-200 rounded-lg p-0 overflow-x-auto">
                        <table className="w-max md:w-full">
                            <tbody>
                            {collaborator.notes.map((note) => (
                                <tr key={note.id} className="even:bg-gray-50 even:border-t even:border-slate-200">
                                    <td className="p-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor"
                                             className="size-6 text-gray-400"
                                             onClick={() => copyToClipboard(note.content)}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/>
                                        </svg>
                                    </td>
                                    <td className="w-full">
                                        <div className="flex flex-col p-2 space-y-1">
                                            <span className="text-xs font-medium text-sky-600">{note.title}</span>
                                            <span className="text-sm font-medium text-gray-900 whitespace-pre-line">{note.content}</span>
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    className="text-sm font-medium text-gray-500">{note.createdBy}</span>
                                                <span className="text-sm font-medium text-gray-500">-</span>
                                                <span
                                                    className="text-sm font-medium text-gray-500">{note.updatedAt}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="pr-3">
                                        <Ellipsis actions={[
                                            {
                                                label: "Modifier",
                                                icon: Pencil,
                                                onClick: () => setNoteToModify(note)
                                            },
                                            {
                                                label: "Supprimer",
                                                icon: Trash,
                                                onClick: () => deleteNote({
                                                    collaboratorId: collaborator.id,
                                                    companyId,
                                                    noteId: note.id
                                                })
                                            },
                                        ]}/>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                }

                {ajoutNote && (
                    <div className="flex flex-col gap-2 mt-4 items-center">
                        <Input
                            placeholder="Objet de la note"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-tl-md"
                        />
                        <Textarea
                            placeholder="Contenu de la note"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <ActionButton
                            className="rounded-tr-md w-full"
                            disabled={!content || content.length === 0}
                            onClick={() => addNote({title, content, collaboratorId: collaborator.id, companyId})}
                        >
                            <Plus className="h-5 w-5 text-white"/>
                            Ajouter
                        </ActionButton>
                    </div>
                )}

                {noteToModify && (
                    <div className="flex flex-col gap-2 mt-4 items-center">
                        <Input
                            placeholder="Objet de la note"
                            value={noteToModify.title}
                            onChange={(e) => setNoteToModify({
                                ...noteToModify,
                                title: e.target.value
                            })}
                            className="rounded-tl-md"
                        />
                        <Textarea
                            placeholder="Contenu de la note"
                            value={noteToModify.content}
                            onChange={(e) => setNoteToModify({
                                ...noteToModify,
                                content: e.target.value
                            })}
                        />
                        <ActionButton
                            className="rounded-tr-md w-full"
                            onClick={() => modifyNote({id: noteToModify.id, title: noteToModify.title, content: noteToModify.content, collaboratorId: collaborator.id, companyId})}
                        >
                            <Pencil className="h-5 w-5 text-white"/>
                            Modifier
                        </ActionButton>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};