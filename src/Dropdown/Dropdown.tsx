import { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';

export enum Position {
    End = 'end',
    Start = 'start'
}

export interface DropdownProps {
    initialSelectedItem?: string
    label?: string
    className?: string
    items: string[]
    position?: Position
}

const DEFAULT_ITEMS: string[] = Array(100).fill(null).map((_, index) => index.toString())

const Dropdown = ({ items = DEFAULT_ITEMS, position }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!dropdownRef.current?.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>{selectedItem || 'Dropdown'}</button>
            {isOpen && (
                <div className={[
                    styles.menu,
                    position === Position.End && styles.end]
                    .filter(Boolean)
                    .join(' ')}>
                    {items.map(item => (
                        <div
                            key={item}
                            className={styles.item}
                            onClick={() => {
                                setSelectedItem(item)
                                setIsOpen(false);
                            }}>{item}</div>))}
                </div>
            )}
        </div>
    )
};

export default Dropdown;
