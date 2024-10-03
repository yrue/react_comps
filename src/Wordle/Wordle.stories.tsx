import Wordle from ".";
import { WORDS } from "./Wordle";

export default {
    component: Wordle
}

export const Default = {
    args: {
        word: WORDS.at(3)
    }
}