export const globalCssText = `
:global() {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    -webkit-text-size-adjust: 100%;
    color-scheme: light;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  strong,
  b {
    font-weight: 700;
  }

  body {
    margin: 0;
    color: rgba(0, 0, 0, 0.87);
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    letter-spacing: 0.00938em;
    background-color: #fff;
  }

  @media print {
    body {
      background-color: #fff;
    }
  }

  body::backdrop {
    background-color: #fff;
  }
}
`
