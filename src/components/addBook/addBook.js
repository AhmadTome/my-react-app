import React, {useEffect, useState} from 'react';
import './AddBook.css';
import './tags.css';
import Modal from '../../libraries/modal/modal';
import {WithContext as ReactTags} from 'react-tag-input';
import axios from "axios";
import {useToasts} from 'react-toast-notifications';
import { BallBeat } from 'react-pure-loaders';
import CreatableSelect from 'react-select/creatable';
import  {countries}  from './countries';
import Books from "../listOfBook/books";
import AXIOS from "../../config/axiosWrapper";

const AddBookForm = () => {
    const {addToast} = useToasts();
    const [showBookPublisher, setShowBookPublisher] = useState(false);
    const [showBookAuthor, setShowBookAuthor] = useState(false);
    const [suggestions, setSuggestions] = useState([
        {id: 'USA', text: 'USA'},
        {id: 'Germany', text: 'Germany'},
        {id: 'Austria', text: 'Austria'},
        {id: 'Costa Rica', text: 'Costa Rica'},
        {id: 'Sri Lanka', text: 'Sri Lanka'},
        {id: 'Thailand', text: 'Thailand'}
    ]);
    const [tags, setTags] = useState([
        {id: "كتاب مخطوط", text: "مكتبة"},
        {id: "India", text: "India"}
    ]);

    const [book, setBook] = useState([
        {
            bookName: "",
            bookDate: "",
            isStillWorking: false
        }
    ]);

    const [author, setAuthor] = useState([
        {
            firstName: "",
            middleName: "",
            lastName: "",
            birthDay: "",
            countryOfResidence: "",
            deathDate: "",
            officialWebSite: "",
        }
    ]);

    const [bookInfo, setBookInfo] = useState([
        {
            BookId: "",
            BookTitle: "",
            BookPublisherId: "",
            PublisherDate: "",
            BookAuthorId: "",
            BookTags: tags,
            AvailableUnit: "",
            UnitPrice: "",
        }
    ]);

    const [bookInfoErr, setBookInfoErr] = useState([
        {
            BookId: "",
            BookTitle: "",
            BookPublisherId: "",
            PublisherDate: "",
            BookAuthorId: "",
            AvailableUnit: "",
            UnitPrice: "",
        }
    ]);

    const [file, setFile] = useState(null);



    const [bookPublisherItem, setBookPublisherItem] = useState([{
        key : 0,
        val : 'select'
    }]);
    const [bookAuthorItem, setBookAuthorItem] = useState([
        {
            key : 0,
            val : 'select'
        }
    ]);




    const KeyCodes = {
        comma: 188,
        enter: 13,
    };

    const delimiters = [KeyCodes.enter];

    const handleDelete = (i) => {
        const filteredTags = tags.filter((tag, index) => index !== i);
        setTags(filteredTags);
    }

    const handleAddition = (tag) => {
        setTags([...tags, tag]);
    }

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        setTags(newTags);
    }


    const addNewPublisher = () => {
        AXIOS.post(process.env.REACT_APP_SERVER_PATH + `publishers`, {
            publisherName: book.bookName,
            establishDate: book.bookDate,
            isStillWorking: book.isStillWorking
        }, {}).then(res => {
            setBookPublisherItem(prevData => ([
                ...prevData,
                {
                    key : res["data"]["_id"],
                    val : res["data"]["publisherName"]
                }
            ]));
            addToast('Publisher Added Successfully', {appearance: 'success', autoDismiss: true});
            setShowBookPublisher(!showBookPublisher)
        }).catch(error => {
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        })
    }



    const addNewAuthor = () => {
        const data = {
            FirstName: author.firstName,
            MiddleName: author.middleName,
            LastName: author.lastName,
            BirthDate: author.birthDay,
            DeathDate: author.deathDate,
            Country: author.countryOfResidence,
            OfficialWebsite: author.officialWebSite
        }

        AXIOS.post(process.env.REACT_APP_SERVER_PATH + `authors`, data, {}).then(res => {
            setBookAuthorItem(prevData => ([
                ...prevData,
                {
                    key : res["data"]["_id"],
                    val : res["data"]["FirstName"] +" " + res["data"]["LastName"]
                }
            ]));
            addToast('Author Added Successfully', {appearance: 'success', autoDismiss: true});
            setShowBookAuthor(!showBookAuthor)
        }).catch(error => {
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        });
    }

    const AddNewBook = () => {
        resetError();
        setLoading(true);
        const formData = new FormData();
        formData.append("BookId", bookInfo.BookId);
        formData.append("BookTitle", bookInfo.BookTitle);
        formData.append("BookPublisherId", bookInfo.BookPublisherId);
        formData.append("PublisherDate", bookInfo.PublisherDate);
        formData.append("BookAuthorId", bookInfo.BookAuthorId);
        formData.append("BookTags", JSON.stringify(tags));
        formData.append("AvailableUnit", bookInfo.AvailableUnit);
        formData.append("UnitPrice", bookInfo.UnitPrice);
        formData.append("file", file);

        axios.post(process.env.REACT_APP_SERVER_PATH + `books`, formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then(res => {
            setLoading(false);
            addToast('Book Added Successfully', {appearance: 'success', autoDismiss: true});
        }).catch(error => {
            setLoading(false);
            addToast(error.message, {appearance: 'error', autoDismiss: true});
            showError(error.response.data.errors);
        });
    }

    const bookChange = (e) => {
        const {name, value, checked} = e.target;

        setBook(prevState => (
                {
                    ...prevState,
                    [name]: [name] == "isStillWorking" ? checked : value
                }
            )
        );
    }

    const showError = (error) => {

        error.map((err)=>{
            setBookInfoErr((prevData) => ({
                ...prevData,
                [err.key]: err.error
            }));
        });
    }

    const resetError = () => {
        setBookInfoErr([
            {
                BookId: "",
                BookTitle: "",
                BookPublisherId: "",
                PublisherDate: "",
                BookAuthorId: "",
                AvailableUnit: "",
                UnitPrice: "",
            }
        ]);
    }

    const authorChange = (e) => {
        let name = "";
        let value = "";
        if (e.label) {
            name = "countryOfResidence";
            value = e.value;

        } else {
            name = e.target.name;
            value = e.target.value;
        }

        setAuthor((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const BookChange = (e) => {
        let {name, value} = e.target;
        setBookInfo((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }


    const bookPublishers =  () => {
        AXIOS.get(process.env.REACT_APP_SERVER_PATH + `publishers`, [], {}).then(res => {
            const data = res['data'];
            for (let i = 0; i < data.length; i++) {
                setBookPublisherItem(prevData => ([
                    ...prevData,
                    {
                        key : data[i]._id,
                        val : data[i].publisherName
                    }
                ]))
            }
        }).catch(error => {
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        });
    }

    const bookAuthors = () => {
        AXIOS.get(process.env.REACT_APP_SERVER_PATH + `authors`, [], {}).then(res => {
            const data = res['data'];
            for (let i = 0; i < data.length; i++) {
                setBookAuthorItem(prevData => ([
                    ...prevData,
                    {
                        key : data[i]._id,
                        val : data[i].FirstName+" "+data[i].LastName
                    }
                ]))
            }

        }).catch(error => {
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        });
    }

    useEffect(() => {
        bookPublishers();
        bookAuthors();
    }, []);

    const [loading, setLoading] = useState(false);

    return (
        <div className='container'>
            <div className='panel panel-default' >
                <div className="panel-heading">Add New Book</div>
                <div className="panel-body">
                    <BallBeat
                        color={'#123abc'}
                        loading={loading}
                    />
                        <div className="row form-group">
                            <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Book Id:</label>
                            <div className='col-sm-10'>
                                <input type="text" className="form-control" id="bookId" placeholder="Enter Book Id"
                                       value={bookInfo.BookId}
                                       onChange={BookChange}
                                       name="BookId"
                                />
                                <span style={{float: 'left', color : 'red'}}>{bookInfoErr.BookId}</span>
                            </div>
                        </div>

                        <div className="row form-group">
                            <label className='pull-left col-sm-2 col-form-label' htmlFor="bookTitle">Book
                                Title:</label>
                            <div className='col-sm-10'>
                                <input type="text" className="form-control" id="bookTitle"
                                       placeholder="Enter Book Title"
                                       value={bookInfo.BookTitle}
                                       onChange={BookChange}
                                       name="BookTitle"
                                />
                                <span style={{float: 'left', color : 'red'}}>{bookInfoErr.BookTitle}</span>

                            </div>
                        </div>

                        <div className="row form-group">
                            <label className='pull-left col-sm-2 col-form-label' htmlFor="bookPublisher">Book
                                Publisher:</label>
                            <div className='col-sm-9'>
                                <select className='form-control'
                                        value={bookInfo.BookPublisherId}
                                        onChange={BookChange}
                                        name="BookPublisherId"
                                >
                                    {
                                        bookPublisherItem.map((item) => {
                                             return  <option value={item.key}>{item.val}</option>;
                                        })
                                    }
                                </select>
                                <span style={{float: 'left', color : 'red'}}>{bookInfoErr.BookPublisherId}</span>

                            </div>
                            <span className='col-sm-1 add' onClick={() => setShowBookPublisher(!showBookPublisher)}>
                                +
                            </span>

                        </div>

                        <div className="row form-group">
                            <label className='pull-left col-sm-2 col-form-label' htmlFor="publishDate">Publish
                                Date:</label>
                            <div className='col-sm-10'>
                                <input type="date" className="form-control" id="publishDate"
                                       placeholder="Enter Publish Date"
                                       value={bookInfo.PublisherDate}
                                       onChange={BookChange}
                                       name="PublisherDate"
                                />
                                <span style={{float: 'left', color : 'red'}}>{bookInfoErr.PublisherDate}</span>

                            </div>
                        </div>

                        <div className="row form-group">
                            <label className='pull-left col-sm-2 col-form-label' htmlFor="bookAuthor">Book
                                author:</label>
                            <div className='col-sm-9'>
                                <select className='form-control'
                                        value={bookInfo.BookAuthorId}
                                        onChange={BookChange}
                                        name="BookAuthorId"
                                >
                                    {
                                        bookAuthorItem.map((item) => {
                                            return  <option value={item.key}>{item.val}</option>;
                                        })
                                    }
                                </select>
                                <span style={{float: 'left', color : 'red'}}>{bookInfoErr.BookAuthorId}</span>

                            </div>
                            <span className='col-sm-1 add' onClick={() => setShowBookAuthor(!showBookAuthor)}>
                                +
                            </span>
                        </div>

                        <div className="row form-group">
                            <label className='pull-left col-sm-2 col-form-label' htmlFor="BookPDF">Book PDF:</label>
                            <div className='col-sm-10'>
                                <input type="file" className="" id="BookPDF"
                                       onChange={(e) => setFile(e.target.files[0])}
                                       name="BookFile"
                                />
                            </div>
                        </div>

                        <div className="row form-group">
                            <label className='pull-left col-sm-2 col-form-label' htmlFor="bookTags">Book
                                Tags:</label>
                            <div className='col-sm-10 tags-container'>
                                <ReactTags tags={tags}
                                           suggestions={suggestions}
                                           handleDelete={handleDelete}
                                           handleAddition={handleAddition}
                                           handleDrag={handleDrag}
                                           delimiters={delimiters}/>

                                {/*<input type="text" className="form-control" id="bookTags" placeholder=""*/}
                                {/*       name="bookTags"/>*/}
                            </div>
                        </div>

                        <div className="row form-group">
                            <label className='pull-left col-sm-2 col-form-label' htmlFor="AvailableUnit">Available
                                Unit:</label>
                            <div className='col-sm-10'>
                                <input type="text" className="form-control" id="" placeholder=""
                                       value={bookInfo.AvailableUnit}
                                       onChange={BookChange}
                                       name="AvailableUnit"
                                />
                                <span style={{float: 'left', color : 'red'}}>{bookInfoErr.AvailableUnit}</span>

                            </div>
                        </div>

                        <div className="row form-group">
                            <label className='pull-left col-sm-2 col-form-label' htmlFor="UnitPrice">Unit
                                Price:</label>
                            <div className='col-sm-10 '>
                                <input type="text" className="form-control" id="" placeholder=""
                                       value={bookInfo.UnitPrice}
                                       onChange={BookChange}
                                       name="UnitPrice"
                                />
                                <span style={{float: 'left', color : 'red'}}>{bookInfoErr.UnitPrice}</span>

                            </div>
                        </div>

                        <div className="row form-group">
                            <div className='col-sm-10 col-sm-offset-2'>
                                <button className='btn btn-primary pull-left' onClick={AddNewBook}> Submit Book</button>
                            </div>
                        </div>



                    <Modal show={showBookPublisher}>
                        <div className='container'>

                            <h1 className='text-left'>Add new publisher </h1>

                            <div className='form-group'>
                                <div className="row">
                                    <label className='pull-left' htmlFor="publisherName">Publisher Name:</label>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-8'>
                                        <input type="text" className="form-control" id="publisherName"
                                               placeholder=""
                                               name="bookName" value={book.bookName} onChange={bookChange}/>
                                    </div>
                                </div>
                            </div>

                            <div className='form-group'>
                                <div className="row">
                                    <label className='pull-left' htmlFor="EstablishDate">Establish date :</label>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-8'>
                                        <input type="date" className="form-control" id="EstablishDate"
                                               placeholder=""
                                               name="bookDate" value={book.bookDate} onChange={bookChange}/>
                                    </div>
                                </div>
                            </div>


                            <div className='form-group'>
                                <div className="row">
                                    <input type="checkbox" className="pull-left form-check-input"
                                           id="isStillWorking" placeholder=""
                                           name="isStillWorking" onChange={bookChange}/>
                                    <label className='pull-left' htmlFor="isStillWorking">Still Working ?</label>
                                </div>
                            </div>

                            <div className="row form-group">
                                <div className='col-sm-2 col-sm-offset-6'>
                                    <button className='btn btn-primary pull-left add-btn'
                                            onClick={addNewPublisher}> Add
                                    </button>
                                    <button className='btn btn-default pull-left'
                                            onClick={() => setShowBookPublisher(!showBookPublisher)}> Cancel
                                    </button>
                                </div>
                            </div>

                        </div>
                    </Modal>


                    <Modal show={showBookAuthor}>
                        <div className='container'>

                            <h1 className='text-left'>Add new author </h1>

                            <div className='row form-group '>
                                <div className="pull-left margin-right-10">
                                    <label className='pull-left'>First Name: </label>
                                    <br/>
                                    <input type="text" value={author.firstName} onChange={authorChange}
                                           name="firstName" width="10" id="firstName" className="form-control"/>
                                </div>

                                <div className="pull-left margin-right-10">
                                    <label className='pull-left'>Middle Name: </label>
                                    <br/>
                                    <input type="text" value={author.middleName} onChange={authorChange}
                                           name="middleName" width="10" id="middleName" className="form-control"/>
                                </div>

                                <div className="pull-left margin-right-10">
                                    <label className='pull-left'>Last Name: </label>
                                    <br/>
                                    <input type="text" value={author.lastName} onChange={authorChange}
                                           name="lastName" width="10" id="lastName" className="form-control"/>
                                </div>
                            </div>


                            <div className='row form-group '>
                                <div className="pull-left margin-right-10 col-sm-5">
                                    <label className='pull-left'>Birth of Date: </label>
                                    <br/>
                                    <input type="date" value={author.birthDay} onChange={authorChange}
                                           name="birthDay" className="form-control"/>
                                </div>

                                <div className="pull-left margin-right-10 col-sm-5">
                                    <label className=''>Country of residence: </label>
                                    <br/>
                                    <p>
                                        <CreatableSelect
                                            onChange={authorChange}
                                            options={countries}
                                        />
                                    </p>



                                    {/*<select value={author.countryOfResidence} onChange={authorChange}*/}
                                    {/*        name="countryOfResidence" id="countryOfResidence"*/}
                                    {/*        className="form-control">*/}
                                    {/*    <option>Select The Country</option>*/}
                                    {/*</select>*/}
                                </div>
                            </div>


                            <div className='row form-group '>
                                <div className="pull-left margin-right-10 col-sm-5">
                                    <label className='pull-left'>Death Date: </label>
                                    <br/>
                                    <input type="date" value={author.deathDate} onChange={authorChange}
                                           name="deathDate" id="deathDate" className="form-control"/>
                                </div>

                                <div className="pull-left margin-right-10 col-sm-5">
                                    <label className='pull-left'>Official Website: </label>
                                    <br/>
                                    <input type="text" value={author.officialWebSite} onChange={authorChange}
                                           name="officialWebSite" id="officialWebSite" className="form-control"
                                           placeholder='ex. https://www.example.com'/>

                                </div>
                            </div>


                            <div className="row form-group">
                                <div className='col-sm-2 col-sm-offset-6'>
                                    <button className='btn btn-primary pull-left add-btn' onClick={addNewAuthor}> Add
                                    </button>
                                    <button className='btn btn-default pull-left'
                                            onClick={() => setShowBookAuthor(!showBookAuthor)}> Cancel
                                    </button>
                                </div>
                            </div>

                        </div>
                    </Modal>


                </div>
            </div>
        </div>

    );
}

export default AddBookForm;