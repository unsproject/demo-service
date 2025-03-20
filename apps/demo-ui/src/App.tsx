import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainPage } from "./components/main-page/mainPage";
import { UserProvider } from "./components/userContext";

export const App: FC = () => (
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  </UserProvider>
);

export default App;
