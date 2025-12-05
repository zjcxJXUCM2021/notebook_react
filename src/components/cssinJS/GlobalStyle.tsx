import { theme } from "antd";

export function GlobalStyle() {
    const { token } = theme.useToken();
    console.log(token);
    const css = `
    :root {
      --color-bg-base: ${token.colorBgContainer};
      --color-bg-layout:${token.colorBgLayout}
      --color-text: ${token.colorText};
      --color-primary: ${token.colorPrimary};
      --border-radius: ${token.borderRadius}px;
    }
    html, body, #root {
      background-color: var(--color-bg-base);
      color: var(--color-text);
      transition:
        background-color 0.1s linear,
        color 0.1s linear;
    }
    
  `;

    return <style>{css}</style>;
}
