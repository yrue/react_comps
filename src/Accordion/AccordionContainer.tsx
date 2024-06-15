import {} from 'react';
import Accordion from './Accordion';


const data = Array(3).fill({}).map((el, index) => ({title: `Accordion ${index + 1}`, content: `Mocked Accordion content\nIndex: ${index}`}));
const AccordionContainer = () => {
    return data.map(({title, content}) => <Accordion key={title} title={title} content={content}/>);
};

export default AccordionContainer;
