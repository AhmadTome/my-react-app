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


const AddBookForm = () => {
  //  const server = 'http://localhost:8080/';
    const server = 'https://aqueous-gorge-52970.herokuapp.com/';

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
    const [file, setFile] = useState(null);



    const [bookPublisherItem, setBookPublisherItem] = useState([
        <option value='0'>select</option>
    ]);
    const [bookAuthorItem, setBookAuthorItem] = useState([
        <option value='0'>select</option>
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
        axios.post(server + `publishers`, {
            publisherName: book.bookName,
            establishDate: book.bookDate,
            isStillWorking: book.isStillWorking
        }).then(res => {
            console.log(res);
            setBookPublisherItem(prevData => ([
                ...prevData,
                <option value={res["data"]["_id"]}>{res["data"]["publisherName"]}</option>
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

        axios.post(server + `authors`, data).then(res => {
            console.log(res);
            setBookAuthorItem(prevData => ([
                ...prevData,
                <option value={res["data"]["_id"]}>{res["data"]["FirstName"] +" " + res["data"]["LastName"]}</option>,
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
        console.log("data", formData);

        axios.post(server + `books`, formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then(res => {
            console.log(res);
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
            let ele = document.getElementById(err.key);
            ele.textContent = err.error;
        });
    }

    const resetError = () => {
        let elements = document.getElementsByClassName('err');
        for (var i=0; i<elements.length;i++) {
            elements[i].textContent = '';

        }
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
        axios.get(server + `publishers`).then(res => {
            console.log("bookPublisher", res);
            let items = [];
            const data = res['data'];
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                items.push(<option value={data[i]._id}>{data[i].publisherName}</option>);
            }

            setBookPublisherItem(prevData => ([
                ...prevData,
                items
            ]))
             return items;

        }).catch(error => {
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        });
    }

    const bookAuthors = () => {
        axios.get(server + `authors`).then(res => {
            console.log("bookAuthors", res);
            let items = [];
            const data = res['data'];
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                items.push(<option value={data[i]._id}>{data[i].FirstName+" "+data[i].LastName}</option>);
            }

            setBookAuthorItem(prevData => ([
                ...prevData,
                items
            ]))
            return items;

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
                                <span className='err' id='BookId' style={{float: 'left', color : 'red'}}></span>
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
                                <span className='err' id='BookTitle' style={{float: 'left', color : 'red'}}></span>

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
                                    {bookPublisherItem}
                                </select>
                                <span className='err' id='BookPublisherId' style={{float: 'left', color : 'red'}}></span>

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
                                <span className='err' id='PublisherDate' style={{float: 'left', color : 'red'}}></span>

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
                                    {bookAuthorItem}
                                </select>
                                <span className='err' id='BookAuthorId' style={{float: 'left', color : 'red'}}></span>

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
                                <span className='err' id='AvailableUnit' style={{float: 'left', color : 'red'}}></span>

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
                                <span className='err' id='UnitPrice' style={{float: 'left', color : 'red'}}></span>

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