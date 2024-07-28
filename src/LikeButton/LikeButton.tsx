import { } from 'react';
import './LikeButton.module.css';
import { HeartIcon, SpinnerIcon } from './icons';

const LikeButton = () => {
    return (
        <div>
            <button>
                <HeartIcon /> Like
            </button>
            <button>
                <SpinnerIcon /> Like
            </button>
        </div>
    );
};

export default LikeButton;
