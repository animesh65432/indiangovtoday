import { TranslateText } from "./translatetext";

export function GetUserStateCode(statesSelected: string[], language: string): string {
    const options = TranslateText[language].MULTISELECT_OPTIONS;

    const defaultState = options[options.length - 1].value;

    if (!statesSelected || statesSelected.length === 0) {
        return defaultState;
    }

    const selectedStates = statesSelected.filter(
        (state) => state !== defaultState
    );

    if (selectedStates.length > 0) {
        return selectedStates[0];
    }
    return defaultState;
}
