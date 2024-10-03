import { useMemo, useState } from 'react';
import styles from './Wordle.module.css';

// default UI

// features:
// answer - string
// guessed - string[]
// input(not submit) - string
// validation - function () : enum

// accessibility

enum STATUS_COLOR {
    DEFAULT = '#d3d6da',
    CORRECT = '#6aaa64',
    PRESENT = '#c9b458',
    ABSENT = '#787c7e'
}

export const WORDS = Object.freeze([
    'APPLE',
    'BEAST',
    'FAINT',
    'FEAST',
    'FRUIT',
    'GAMES',
    'PAINT',
    'PASTE',
    'TOWER',
    'REACT',
]);
enum KEYS {
    ENTER = 'ENTER',
    BACK = 'BACK'
}
const MAX_WORD_LENGTH = 5;
const MAX_GUESSED = 6

interface WordleProps {
    word: string
}

const Wordle = ({ word }: WordleProps) => {
    const [guessed, setGuessed] = useState<string[]>([]);
    const [draft, setDraft] = useState<string>('')
    const [status, setStatus] = useState<string>('');
    const wordSet = useMemo(() => new Set(word), [word]);
    const guessedLetterSet = useMemo(() => new Set(guessed.join('')), [guessed])
    console.log(guessedLetterSet)

    const getColor = (index: number, letter: string): STATUS_COLOR => {
        if (!guessedLetterSet.has(letter)) return STATUS_COLOR.DEFAULT;
        // index, letter correct -> correct
        if (word[index] === letter) return STATUS_COLOR.CORRECT;
        // letter correct -> present
        if (wordSet.has(letter)) return STATUS_COLOR.PRESENT; // TODO: frequency of the letter in the word should be considered
        // input but not in word -> gray
        return STATUS_COLOR.ABSENT
    }
    const renderGrid = () => {
        const ROW = MAX_GUESSED;
        return (
            <div className={styles.metrix}>
                {Array.from({ length: ROW }).map((_, rowIndex) => {
                    return (
                        <div className={styles.metrixRow}>
                            {Array.from({ length: MAX_WORD_LENGTH }).map((__, columnIndex) => {
                                const row = [...guessed, draft].at(rowIndex);
                                const label = row?.at(columnIndex)
                                const shouldValidate = rowIndex < guessed.length;
                                return <div className={styles.metrixColumn} style={{ backgroundColor: shouldValidate && getColor(columnIndex, label) }}>{label}</div>
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
    const renderKeyboard = () => {
        const letters: string[][] = ['qwertyuiop'.toUpperCase().split(''), 'asdfghjkl'.toUpperCase().split(''), [KEYS.ENTER, ...'zxcvbnm'.toUpperCase().split(''), KEYS.BACK]];
        // TODO: how to make a prompt
        // render the letters in rows, and each letter to be an character
        return (
            <div className={styles.keyboard}>
                {letters.map(row => {
                    return (
                        <div className={styles.row}>
                            {row.map((key, index) => {
                                // TODO: create dedicated handler function in outer scope to avoid unnecessary re-initialization?
                                let onClickHandler;
                                if (key === KEYS.BACK) onClickHandler = () => setDraft(prev => prev.slice(0, prev.length - 1))
                                else if (key === KEYS.ENTER) {
                                    onClickHandler = () => {
                                        if (guessed.length === MAX_GUESSED) {
                                            setStatus('Failed');
                                            return;
                                        }

                                        if (draft.length < MAX_WORD_LENGTH) {
                                            setStatus('Not enough characters.')
                                            return;
                                        }

                                        if (draft === word) setStatus('Win!!!!')

                                        if (!WORDS.includes(draft)) {
                                            setStatus('Unknown word')
                                            return}
                                        setGuessed(prev => {
                                            return [...prev, draft]
                                        })
                                        setDraft('');
                                    }
                                } else {
                                    onClickHandler = () => {
                                        const isEnd = guessed.length === MAX_GUESSED || guessed.at(-1) === word;
                                        const exceedLength = draft.length === MAX_WORD_LENGTH;
                                        if (isEnd || exceedLength) return;

                                        setDraft(prev => prev += key)
                                    }
                                }
                                return <button key={key} className={styles.keycell} aria-label={key} onClick={onClickHandler} style={{ backgroundColor: getColor(index, key) }}>{key}</button>
                            })}
                        </div>
                    )
                })}
                <button onClick={() => {
                    setDraft('')
                    setGuessed([])
                }}>Reset</button>
            </div>
        )
    }

    const renderDebug = () => {
        return (<div>
            <strong>Debug</strong>
            <p>Draft: {draft}</p>
            <p>Answer: {word}</p>
            <p>Guessed: {JSON.stringify(guessed, null, 2)}</p>
        </div>)
    }
    return (
        <div className={styles.container}>
            <h1>Wordle</h1>
            {/* TODO: Separator */}

            {renderGrid()}
            {renderKeyboard()}
            {status && <p>Status: {status}</p>}
            {renderDebug()}
        </div>);
};

export default Wordle;
