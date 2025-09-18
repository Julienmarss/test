import React, {useState, useCallback, ChangeEvent, DragEvent, useRef, useEffect} from 'react';
import { Button } from '@/components/ui/buttons/Button';
import { useModifyCollaboratorPictureByToken } from '@/api/collaborator/collaborators.api';

interface FileUploadState {
    file: File | null;
    preview: string | null;
    isDragActive: boolean;
}

interface AddPictureProfileProps {
    token: string;
    handleInputChange: (key: string, value: string | boolean | number | string[]) => void;
    maxSizeInMB?: number;
    acceptedFileTypes?: string[];
    className?: string;
}

const AddPictureProfile: React.FC<AddPictureProfileProps> = ({
    token,
    maxSizeInMB = 5,
    acceptedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
    className = '',
    handleInputChange
}) => {
    const [uploadState, setUploadState] = useState<FileUploadState>({
        file: null,
        preview: null,
        isDragActive: false
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>('');
    const { mutate: modifyPicture, isPending: modifyPicturePending, isSuccess, data } = useModifyCollaboratorPictureByToken();

    useEffect(() => {
        if (isSuccess && data && data.picture) {
            handleInputChange('picture', data.picture);
        }
    }, [isSuccess, data]);

    const validateFile = (file: File): string | null => {
        // Vérifier le type de fichier
        if (!acceptedFileTypes.includes(file.type)) {
            return `Type de fichier non supporté. Formats acceptés : ${acceptedFileTypes.map(type => {
                const ext = type.split('/')[1].toUpperCase();
                return ext === 'JPEG' ? 'JPG/JPEG' : ext;
            }).join(', ')}`;
        }

        // Vérifier la taille
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            return `Le fichier est trop volumineux. Taille maximale : ${maxSizeInMB}MB`;
        }

        return null;
    };

    const onDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setUploadState(prev => ({ ...prev, isDragActive: true }));
    }, []);

    const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setUploadState(prev => ({ ...prev, isDragActive: false }));
    }, []);

    const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setUploadState(prev => ({ ...prev, isDragActive: false }));

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }, []);

    const handleFiles = (files: File[]): void => {
        const file = files[0];
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            setTimeout(() => setError(''), 5000);
            return;
        }

        setError('');
        setUploadState(prev => ({ ...prev, file }));

        // Créer une prévisualisation pour les images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const result = e.target?.result as string;
                setUploadState(prev => ({ ...prev, preview: result }));
            };
            reader.readAsDataURL(file);
        } else {
            setUploadState(prev => ({ ...prev, preview: null }));
        }

        // Callback pour le parent
        modifyPicture({ file, token })
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        handleFiles(files);
    };

    const getFileExtensions = (): string => {
        return acceptedFileTypes
            .map(type => {
                const ext = type.split('/')[1];
                return ext === 'jpeg' ? 'jpg' : ext;
            })
            .map(ext => `.${ext.toUpperCase()}`)
            .join(', ');
    };

    const getAcceptAttribute = (): string => {
        return acceptedFileTypes.map(type => {
            if (type === 'image/jpeg') return '.jpg,.jpeg';
            return `.${type.split('/')[1]}`;
        }).join(',');
    };

    return (
        <div id="picture-profile" className="flex flex-col gap-y-4 bg-white rounded-lg border border-slate-200 p-2 md:p-6">
            <div className="flex items-center space-x-2">
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.25 12.75L6.40901 7.59099C7.28769 6.71231 8.71231 6.71231 9.59099 7.59099L14.75 12.75M13.25 11.25L14.659 9.84099C15.5377 8.96231 16.9623 8.96231 17.841 9.84099L20.75 12.75M2.75 16.5H19.25C20.0784 16.5 20.75 15.8284 20.75 15V3C20.75 2.17157 20.0784 1.5 19.25 1.5H2.75C1.92157 1.5 1.25 2.17157 1.25 3V15C1.25 15.8284 1.92157 16.5 2.75 16.5ZM13.25 5.25H13.2575V5.2575H13.25V5.25ZM13.625 5.25C13.625 5.45711 13.4571 5.625 13.25 5.625C13.0429 5.625 12.875 5.45711 12.875 5.25C12.875 5.04289 13.0429 4.875 13.25 4.875C13.4571 4.875 13.625 5.04289 13.625 5.25Z" stroke="#99A1AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-lg font-medium text-gray-900">Photo de profil</span>
            </div>
            <div
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${uploadState.isDragActive
                        ? 'border-blue-400 bg-blue-50'
                        : error
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }
        `}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <div className="space-y-4">
                    {uploadState.file && uploadState.preview ?
                        <div>
                            <img
                                src={uploadState.preview}
                                alt="Prévisualisation"
                                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                            />
                            {/* <div>
                                    <p className="text-base semi-bold text-gray-900 mb-2">{uploadState.file.name as string}</p>
                                </div> */}
                        </div>
                        : <>
                            <div className="flex items-center justify-center">
                                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="80" height="80" rx="40" fill="#0084D1" />
                                    <path d="M40 49L40 35.5M40 35.5L46 41.5M40 35.5L34 41.5M29.5 55C24.5294 55 20.5 50.9706 20.5 46C20.5 42.0141 23.0911 38.6334 26.6808 37.4504C26.5621 36.8184 26.5 36.1665 26.5 35.5C26.5 29.701 31.201 25 37 25C41.8625 25 45.9529 28.3052 47.1473 32.7915C47.7308 32.6023 48.3535 32.5 49 32.5C52.3137 32.5 55 35.1863 55 38.5C55 39.1963 54.8814 39.8649 54.6633 40.4866C57.4907 41.5609 59.5 44.2958 59.5 47.5C59.5 51.6421 56.1421 55 52 55H29.5Z" stroke="#F0F9FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-base semi-bold text-gray-900 mb-2">
                                    Importez votre photo de profil
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {getFileExtensions()}
                                </p>
                            </div>
                        </>}

                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept={getAcceptAttribute()}
                        onChange={handleFileInputChange}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} className='text-sm text-black semi-bold bg-white border border-gray-200 hover:bg-gray-200'>
                        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 11C1.567 11 0 9.433 0 7.5C0 6.06836 0.859559 4.83748 2.09075 4.29529C2.03138 4.03979 2 3.77356 2 3.5C2 1.567 3.567 0 5.5 0C6.94462 0 8.18482 0.875211 8.71929 2.12432C8.96493 2.04364 9.22737 2 9.5 2C10.8807 2 12 3.11929 12 4.5C12 4.72217 11.971 4.93756 11.9166 5.14262C13.1252 5.53 14 6.66283 14 8C14 9.65685 12.6569 11 11 11H3.5ZM4.21967 5.96967C3.92678 6.26256 3.92678 6.73744 4.21967 7.03033C4.51256 7.32322 4.98744 7.32322 5.28033 7.03033L6.25 6.06066L6.25 8.75C6.25 9.16421 6.58579 9.5 7 9.5C7.41421 9.5 7.75 9.16421 7.75 8.75L7.75 6.06066L8.71967 7.03033C9.01256 7.32322 9.48744 7.32322 9.78033 7.03033C10.0732 6.73744 10.0732 6.26256 9.78033 5.96967L7.53033 3.71967C7.23744 3.42678 6.76256 3.42678 6.46967 3.71967L4.21967 5.96967Z" fill="#0F172A" />
                        </svg>
                        {uploadState.file ? "Modifier la photo" : "Ajouter une photo"}
                    </Button>
                </div>
            </div>

            {/* {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                        <span className="text-red-800 text-sm">{error}</span>
                    </div>
                </div>
            )}

            {uploadState.file && !error && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-green-800 text-sm font-medium">
                            Fichier téléchargé avec succès
                        </span>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default AddPictureProfile;