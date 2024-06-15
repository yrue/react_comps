import { useState } from 'react';

interface AccordionProps{
    title: string,
    content: string
}

const Accordion = ({title, content}: AccordionProps) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <>
        <button aria-label={title} onClick={() => setIsVisible(prev => !prev)}>
            {title}
        </button>
        {isVisible && <div aria-label={title} role='region'>{content}</div>}
        </>
    );
};

export default Accordion;
