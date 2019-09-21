import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule } from "styled-components";

interface IThemeInterface {
    // primaryColor: string;
    // primaryColorInverted: string;
    blueColor: string;
}

const {
    default: styled,
    css,
    createGlobalStyle,
    keyframes,
    ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<IThemeInterface>;

export { css, createGlobalStyle, keyframes, ThemeProvider }

export default styled;