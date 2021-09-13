import './App.css';
import AddBookForm from "./components/book/addBook";
import React from "react";
import {ToastProvider} from "react-toast-notifications";
import Books from "./components/listOfBook/books";

function App() {
    return (
        <div className="App">
            <ToastProvider>
                <AddBookForm/>
                <Books/>
            </ToastProvider>

        </div>
    );
}

export default App;
