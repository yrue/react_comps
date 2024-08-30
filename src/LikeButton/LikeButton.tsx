import { useState } from 'react';
import styles from './LikeButton.module.scss';
import { HeartIcon, SpinnerIcon } from './icons';

/* TODO: 
1. CSS - red #f00 , gray #888; hover
2. 2️⃣ cases - (css: btn border & background color, comp: icon)
  hover - red, icon: heart, unfilled btn
  loading - icon: loading gif
  liked - red, icon: heart, filled btn
  unlike(default) - gray, icon: heart, unfilled btn
3. 1️⃣states - 
isLike
isLoading
error_msg
hover

<default>
{isLike: false} ->|click| {isLoading: true}, {error_mag: (cleared)} ->|API success| {isLike: true}
                                            ->|API error| (no change){isLike: false}, {error_mag: (set)}
<reverse>
{isLike: true} ->|click| {isLoading: true}, {error_mag: (cleared)} ->|API success| {isLike: false}
                                           ->|API error| (no change){isLike: true}, {error_mag: (set)}
4. result - success, failed (UI for success or error)
*/

enum LIKE_STATE {
    LIKE = 'like',
    UNLIKE = 'unlike',
}

interface LikeOperatingResult {
    message: string
}

// Question to interviewer: Does this function be reused? (mantaincing?, code structure?)
// TODO: the answer put this function within the component so that it can update the state directly, but i think put the function out from the component make the api call to be flexible for using in the further cases, is that a pre-optimized case?
// TODO: should parse result in api function? or should be in usage? based on apollo graphql's practice, should be in this function?
const updateLikeButton = async (action: LIKE_STATE): Promise<LikeOperatingResult> => {
    const response = await fetch('https://www.greatfrontend.com/api/questions/like-button', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({action})
    });
    
    // TODO: no need to have a try catch to handle non-success cases?
    // if (!response.ok) {
    //     throw new Error('Failed to create a new post');
    // }

    // Parse the JSON response into the LikeOperatingResult interface
    const optResult: LikeOperatingResult = await response.json();
    return optResult;
}

const LikeButton = () => {
    const [isLike, setIsLike] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // TODO: does isPending and isLoading different in maintaincing? what's the difference?
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [isHover, setIsHover] = useState<boolean>(false);

    const handleUpdateLikeState = async () => {
        // starting
        setIsLoading(true)

        // clean up
        setErrorMsg('')

        const action = isLike ? LIKE_STATE.UNLIKE : LIKE_STATE.LIKE;
        const {message} = await updateLikeButton(action);

        // update result
        if (message === 'Success!') { // TODO: Instead of comparing the response message with an message, I should use http status code to ensure whether its success or not? I decided to go this approach because there's an exact response for me in the question. // note here does not consider translation
            setIsLike(!isLike)                        
        } else{
            setErrorMsg(message)
        }

        // wrap up
        setIsLoading(false)
    }
    const likeIconStyle = isHover ? styles.hover :
                            isLike ? styles.unlike : styles.liked;
    return (
        <div>
            {/* TODO: learn the effect of onmouseenter/over/out */}
            {/* TODO: Does the reason 'I use js event to handle onhover event to make css logic more similar?' make sense? reasoning pros, cons*/}
            {/* TODO: missing accessibility, tab order(e.g. when moving to button, focus on xxx), label - reasonable or not? different state - announce role(TODO: check detail) */}
            <button onClick={handleUpdateLikeState} disabled={isLoading} className={[styles.btn, likeIconStyle].join(' ')} onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                {/* TODO: one - line, accessibility */}
                {(function renderLikeIcon() {
                    if (isLoading) return <SpinnerIcon />
                    return <HeartIcon />
                })()}
                <span>Like</span>
            </button>
            <div>Is Like? {isLike.toString()}</div>
            {errorMsg && (<span>{errorMsg}</span>)}
        </div>
    );
};

export default LikeButton;
