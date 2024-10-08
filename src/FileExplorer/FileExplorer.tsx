import { useState } from 'react';

interface FileObject {
    id: number;
    name: string;
    children?: FileObject[];
}

interface FileExplorerProps {
    data: FileObject[]
}

const FileList = ({ data }: { data: FileObject[] }) => {
    // sort by category first then alphabetically
    const directories = data.filter(({ children }) => children);
    const files = data.filter(({ children }) => !children);
    directories.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    return data.map(obj => <FileObject {...obj} />)
}

const FileObject = ({ name, children }: FileObject) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    return (
        <li>
            <div
                onClick={() => {
                    if (!children) return
                    setIsOpen(!isOpen);
                }}
            >
                {name}
                {children && (
                    `[${isOpen ? '-' : '+'}]`
                )}
            </div>
            {(isOpen && children) && <FileExplorer data={children} />}
        </li>
    )
}

const FileExplorer = ({ data }: FileExplorerProps) => {
    return (
        <ul>
            <FileList data={data} />
        </ul>
    )
};


export default FileExplorer;
