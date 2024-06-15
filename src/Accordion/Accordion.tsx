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
        {/* 
        Approach - use state to toggle (vs use style: display)
        pros - won't large mounted dom node when initializing (better approach: with style), 
        cons - remount effort which harms perf in larger scale 
        */}
        {isVisible && <div aria-label={title} role='region'>{content}</div>}
        </>
    );
};

export default Accordion;
