import React from 'react';
import ReactDOM from 'react-dom';
import GlobalStyle from "src/global-styles";
import client from "./apollo"
import { ApolloProvider } from "react-apollo";
import App from './Components/App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
    <GlobalStyle />
  </ApolloProvider>,
  document.getElementById("root") as HTMLElement
);