import React, { Fragment, ReactNode, useState } from 'react';
import styles from './FileExplorer.module.css';

interface FileObject {
    id: number;
    name: string;
    children?: FileObject[];
}

enum ObjectType {
    File,
    Directory
}

interface FileExplorerProps {
    data: FileObject[]
}

// TODO: pick 2 of 3 prop from File obj as FileProp type
interface FileProp{
    name: string
}
const File = ({ name }: FileProp) => {
    return (<div>{name}</div>)
}

interface DirectoryProp {
    name: string
    children: ReactNode
}
const Directory = ({ name, children }: DirectoryProp) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <div style={{color: 'red'}} onClick={() => setIsOpen(!isOpen)}>{name} [{isOpen ? '-' : '+'}]</div>
            {isOpen && <div style={{position: 'relative', left: '1rem'}}>{children}</div>}
        </div>)
}
const FileExplorer = ({ data }: FileExplorerProps) => {
    // TODO sort by category first then alphabetically

    return data.map(obj => {
        return (
        <Fragment key={obj.id}>
            {obj.children ? (
                <Directory {...obj}><FileExplorer data={obj.children} /></Directory>
            ) : (
                <File {...obj} />
            )}
        </Fragment>)
    })
};


export default FileExplorer;
