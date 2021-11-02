import React, {useState} from 'react';
import {
    Nav,
    NavLink,
    NavMenu,
} from './NavbarElements';
import axios from "axios";
import {toast} from "react-toastify";
import {BallBeat} from "react-pure-loaders";

const Navbar = () => {
    const [loading, setLoading] = useState(false);

    const notify = () => toast("Imported Books Successfully",
        {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    const downloadTemplate = () => {

        axios(
            {
                url: process.env.REACT_APP_SERVER_PATH + `book/template`,
                method: 'post',
                responseType: 'blob'
            }
        ).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'BookTemplate.xlsx');
            document.body.appendChild(link);
            link.click()
        }).catch(error => {

        });
    }


    const getFile = () => {
        document.getElementById("fileUpload").click();
    }

    const importedFile = (e) => {
        setLoading(true);

        var file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        document.getElementById('fileUpload').value = "";
        axios.post(process.env.REACT_APP_SERVER_PATH + `book/bulk-insert`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then(res => {
            notify();
            setLoading(false);

        }).catch(error => {
            setLoading(false);

        });
    }

    return (
        <>
            <Nav>

                <NavMenu>
                    <NavLink to='/addBook' activeStyle>
                        Add Book
                    </NavLink>
                    <NavLink to='/bookList' activeStyle>
                        Book List
                    </NavLink>
                    <NavLink to='/purchaseHistory' activeStyle>
                        Purchase History
                    </NavLink>
                    <NavLink to='/fileManager' activeStyle>
                        File Manager
                    </NavLink>

                </NavMenu>
            </Nav>

            <span className='pull-left'>
                            <button className='btn btn-default' onClick={getFile}>
                                import Books
                                <input type="file" id="fileUpload" className='hidden' accept=".xlsx"
                                       onChange={importedFile}/>
                            </button>
                        </span>

            <span className='pull-left'>
                            <button className='btn btn-default'
                                    onClick={downloadTemplate}>Download Book Template</button>
                        </span>


            <BallBeat
                color={'#123abc'}
                loading={loading}
            />

        </>
    );
};

export default Navbar;
