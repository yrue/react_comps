import { useState } from 'react';
import styles from './PixelArt.module.css';
import Cell from './Cell';
import { mocked } from '@storybook/test';

/**
 * UI
 * 1. Canvas :
 * - 15*15 grid of cells
 * - each cell is 20*20px
 * - pixel alternate b/w white and gray
 * 
 * Modes -> interface
 * - Draw, Erase
 * - UI - tab
 * 
 * ColorPicker
 * 
 * Actions:
 * Drawing mode
 * - click on a cell with paint it with the currently selected color
 * - dragging on the canvas will fill the underlaying pixel with the selected color
 * 
 * Erasing mode
 * - click on cell -> remove color
 * - Dragging on the canvas while this mode is selected will remove color from cell
 */

interface Color{
    [key: string]: string
}

const COLORS: Color = {
    white: '#fff',
    gray: '#e9ecef',
    black: '#000',
    red: '#cc0001',
    orange: '#fb940b',
    yellow: '#ffff01',
    green: '#01cc00',
    teal: '#38d9a9',
    blue: '#228be6',
    purple: '#7950f2',
    beige: '#ff8787',
};

enum Mode {
    Draw = 'Draw',
    Erase = 'Erase'
}

// TODO: extract to a file
interface TabProps {
    mode: Mode,
    activeMode: Mode,
    onClick: () => void
}
const Tab = ({ mode, activeMode, onClick }: TabProps) => {
    const className = [styles.tab];
    if (mode === activeMode) className.push(styles.active);
    return <div onClick={onClick} className={className.join(' ')}>{mode}</div>
}

const CANVAS  = {
    WIDTH : 15,
    HEIGHT : 15,
}

const PixelArt = () => {
    const [mode, setMode] = useState(Mode.Draw);
    const [selectedColor, setSelectedColor] = useState(COLORS.black);
    const [cellColors, setCellColors] = useState<{[key: number]: string}>({})
    const [isDragging, setIsDragging] = useState<boolean>(false);

    return (
        <div className={styles.container}>
            {/* TODO: new comp */}
            <div className={styles.canvas}>
                {Array.from({ length: CANVAS.WIDTH * CANVAS.HEIGHT }, () => null).map((_, index) => (
                    <div className={styles.grid} style={{ background: cellColors[index] }}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseOver={() => {
                            if (!isDragging) return;

                            if (mode === Mode.Draw) setCellColors({ ...cellColors, [index]: selectedColor });
                            if (mode === Mode.Erase) {
                                const newCellColors = {...cellColors}
                                delete newCellColors[index]
                                setCellColors({ ...newCellColors })
                            };
                        }}
                    ></div>
                ))}
            </div>

            {/* TODO: new comp */}
            <div className={styles.toolbar}>
                <div className={styles.tabContainer}>
                    <Tab mode={Mode.Draw} activeMode={mode} onClick={() => setMode(Mode.Draw)} />
                    <Tab mode={Mode.Erase} activeMode={mode} onClick={() => setMode(Mode.Erase)} />
                </div>

                {/* TODO: new comp */}
                <div className={styles.colorPicker}>
                    {Object.entries(COLORS).map(([color, hashCode]) => {
                        const className = [styles.cell]
                        if (selectedColor === hashCode) className.push(styles.activeColor)
                        return (
                            <div className={className.join(' ')} style={{ background: hashCode }} aria-label={color}
                                onClick={() => setSelectedColor(hashCode)}
                            />
                        )
                    })}
                </div>
            </div>

            {/* TODO: new comp */}
            <div className={styles.debug}>
                <strong>Debugging</strong>
                <p>Mode: {mode}</p>
                <p>Is dragging: {isDragging.toString()}</p>
                <p>Selected color: {selectedColor}</p>
            </div>

        </div>
    )
};

export default PixelArt;
