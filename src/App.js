import React from "react";

import About from "./pages/About";
import './styles/App.css';
import {Route, Routes, Outlet} from "react-router-dom";
import Posts from "./pages/Posts";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<Outlet/>}>
                <Route index element={<About/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/posts" element={<Posts/>}/>
            </Route>
        </Routes>
    )
}

export default App;