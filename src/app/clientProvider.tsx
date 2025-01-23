"use client";

import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import Header from "./components/Header";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <Header />
      {children}
    </Provider>
  );
}
