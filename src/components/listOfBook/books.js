import React, {useEffect, useState} from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import {useToasts} from 'react-toast-notifications';
import Modal from "../modal";
import {Panel, Tab, Tabs} from "../bookPayment/tabs";

const Books = () => {
    const {addToast} = useToasts();

    const [showPaymentDialog, setShowPaymentDialog] = useState(false);

    const columns = [
        {
            name: 'Id',
            selector: '_id',
            sortable: true,
        },
        {
            name: 'Title',
            selector: 'BookTitle',
            sortable: true,
        },
        {
            name: 'Publisher',
            selector: 'BookPublisherId',
            sortable: true,
        },
        {
            name: 'Publisher Date',
            selector: 'PublisherDate',
        },
        {
            name: 'Author',
            selector: 'BookAuthorId',
        },
        {
            name: 'Book Tags',
            selector: 'BookTags',
        },
        {
            name: 'Available Unit',
            selector: 'AvailableUnit',
        },
        {
            name: 'Unit Price',
            selector: 'UnitPrice',
        },
        {
            name: 'Reserve',
            selector: 'Reserve',
        },
    ];

    const [bookInfo, setBookInfo] = useState(
        {
            _id: "",
            BookId: "",
            BookTitle: "",
            BookPublisher: "",
            PublisherDate: "",
            BookAuthor: "",
            AvailableUnit: "",
            UnitPrice: "",
        }
    );

    const [paymentInfo, setPaymentInfo] = useState(
        {
            numberOfUnit: "",
            BuyerName: "",
            BuyerAddress: "",
            BuyerPhoneNumber: "",
            purchaseDate: "",
            NotionalId: "",
        }
    );


    const [books, setBooks] = useState(null);

    const Button = ({isActive, onClick, children}) => (
        <button className='btn' disabled={isActive} onClick={onClick}>
            {children}
        </button>
    )

    const loadBooks = () => {
        axios.get(`http://localhost:8080/books`).then(res => {
            console.log("books", res);
            let data = res["data"];
            updateBooksTable(data);

        }).catch(error => {
            console.log("error", error);

        });
    }

    const [searchAttr, setSearchAttr] = useState({
        inquiry: '',
        unitPriceStart: '',
        unitPriceEnd: '',
        availableUnitStart: '',
        availableUnitEnd: '',
        searchCategory: 'Any',
    });

    const searchBookChange = (e) => {
        const {name, value} = e.target;
        setSearchAttr(preVal => ({
            ...preVal,
            [name]: value
        }));
    }

    const searchForBook = () => {
        const search_attr = "inquiry=" + searchAttr.inquiry + "&searchCategory=" + searchAttr.searchCategory +
            "&unitPriceStart=" + searchAttr.unitPriceStart + "&unitPriceEnd=" + searchAttr.unitPriceEnd +
            "&availableUnitStart=" + searchAttr.availableUnitStart + "&availableUnitEnd=" + searchAttr.availableUnitEnd;

        axios.get(`http://localhost:8080/books/search?` + search_attr).then(res => {
            let data = res["data"];
            updateBooksTable(data);
        }).catch(error => {
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        });
    }

    const updateBooksTable = (data) => {
        const filteredData = data.map((item) => {

            const tag = (item['BookTags']).map(tag => {
                return tag['text'] + ', ';
            });

            var author = '';
            if (item['authors'] && item['authors'].length > 0 && item['authors'][0]["FirstName"]) {
                author = item['authors'][0]["FirstName"];
            }

            var publisher = '';
            if (item['publishers'] && item['publishers'].length > 0 && item['publishers'][0]["publisherName"]) {
                publisher = item['publishers'][0]["publisherName"];
            }
            const publishDate = item['PublisherDate'].substr(0, 10);


            return {
                ...item,
                "BookTags": tag,
                "BookAuthorId": author,
                "BookPublisherId": publisher,
                "PublisherDate": publishDate,
                "Reserve": <button disabled={item['AvailableUnit'] == 0} className='btn btn-success'
                                   data-id={item['_id']} onClick={() => PaymentToReserve(item['_id'])}>Reserve</button>
            }
        });

        setBooks(filteredData)
    }

    const PaymentToReserve = (_id) => {

        setBookInfo((prevData) => ({
            ...prevData,
            _id: _id,
        }));

        axios.get(`http://localhost:8080/books/` + _id).then(res => {
            console.log("book", res);
            let data = res["data"][0];
            setShowPaymentDialog(!showPaymentDialog);
            const BookAuthors = data['authors'][0] ? data['authors'][0]['FirstName'] : 'no book authors';
            const BookPublisher = data['publishers'][0] ? data['publishers'][0]['publisherName'] : 'no book publisher';

            setBookInfo((prevData) => ({
                ...prevData,
                BookId: data.BookId,
                BookTitle: data.BookTitle,
                BookPublisher: BookPublisher,
                PublisherDate: data.PublisherDate.substr(0, 10),
                BookAuthor: BookAuthors,
                AvailableUnit: data.AvailableUnit,
                UnitPrice: data.UnitPrice,
            }));

        }).catch(error => {
            console.log("error", error);
        });
    }

    const PaymentInfoChange = (e) => {
        let {name, value} = e.target;
        setPaymentInfo((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const ReserveBook = () => {
        let BookId = bookInfo._id;
        let data = {...paymentInfo, ...bookInfo, BookId};
        axios.post(`http://localhost:8080/books/`+ BookId +`/reserve`, data).then(res => {
            addToast('Book Reserved Successfully', {appearance: 'success', autoDismiss: true});
            setShowPaymentDialog(!showPaymentDialog);
        }).catch(error => {
            addToast('Book Reserved Fail', {appearance: 'error', autoDismiss: true});
            console.log("error", error);
        });
    }

    useEffect(() => {
        loadBooks();
    }, []);

    return (
        <div className='container'>
            <div className='panel panel-default'>
                <div className="panel-heading">Search for a book</div>
                <div className="panel-body">

                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label' htmlFor="">Search word:</label>
                        <div className='col-sm-6'>
                            <input type="text" className="form-control" id="inquiry"
                                   placeholder="Type Something to search"
                                   value={searchAttr.inquiry}
                                   name="inquiry"
                                   onChange={searchBookChange}
                            />
                        </div>
                        <div className='col-sm-4'>
                            <select className='form-control'
                                    value={searchAttr.searchCategory}
                                    name="searchCategory"
                                    onChange={searchBookChange}
                            >
                                <option value='Any'>Any</option>
                                <option value='BookTitle'>Book Title</option>
                                <option value='publishers.publisherName'>Book Publisher</option>
                                <option value='authors.FirstName'>Book Author</option>
                                <option value='Tags'>Tags</option>
                            </select>
                        </div>
                    </div>

                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label'>Available Unit :</label>
                        <div className='col-sm-3'>
                            <input type="text" className="form-control" id="" placeholder="Start with"
                                   value={searchAttr.availableUnitStart}
                                   name="availableUnitStart"
                                   onChange={searchBookChange}
                            />
                        </div>
                        <div className='col-sm-3'>
                            <input type="text" className="form-control" id="" placeholder="End with"
                                   value={searchAttr.availableUnitEnd}
                                   name="availableUnitEnd"
                                   onChange={searchBookChange}
                            />
                        </div>
                    </div>

                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label'>Unit Price :</label>
                        <div className='col-sm-3'>
                            <input type="text" className="form-control" id="" placeholder="Start with"
                                   value={searchAttr.unitPriceStart}
                                   name="unitPriceStart"
                                   onChange={searchBookChange}
                            />
                        </div>
                        <div className='col-sm-3'>
                            <input type="text" className="form-control" id="" placeholder="End with"
                                   value={searchAttr.unitPriceEnd}
                                   name="unitPriceEnd"
                                   onChange={searchBookChange}
                            />
                        </div>
                    </div>

                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label'></label>
                        <div className='col-sm-3'>
                            <button className='btn btn-primary pull-left' onClick={searchForBook}>Search</button>
                        </div>

                    </div>


                    {
                        books
                        &&
                        <DataTable
                            title="Books"
                            columns={columns}
                            data={books}
                            highlightOnHover
                            pagination
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 15, 25, 50]}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Records per page:',
                                rangeSeparatorText: 'out of',
                            }}
                        />
                    }
                </div>
            </div>


            <Modal show={showPaymentDialog}>
                <div className='container'>

                    <h1 className='text-left'>Reserve a book</h1>

                    <div className="panel-body">
                        <Tabs>
                            <div>
                                <Tab>
                                    <Button>Book Details</Button>
                                </Tab>
                                <Tab>
                                    <Button>Buyer details</Button>
                                </Tab>
                                <Tab>
                                    <Button>Payment details</Button>
                                </Tab>
                            </div>

                            <Panel>
                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Book Id:</label>
                                    <div className='col-sm-10'>
                                        <input type="text" className="form-control" id="bookId" placeholder="Enter Book Id"
                                               disabled={true}
                                               value={bookInfo.BookId}
                                               name="BookId"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookTitle">Book
                                        Title:</label>
                                    <div className='col-sm-10'>
                                        <input type="text" className="form-control" id="bookTitle"
                                               disabled={true}
                                               placeholder="Enter Book Title"
                                               value={bookInfo.BookTitle}
                                               name="BookTitle"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookPublisher">Book
                                        Publisher:</label>
                                    <div className='col-sm-10'>
                                        <input type="text" className="form-control" id="bookTitle"
                                               placeholder="Enter Book Title"
                                               disabled={true}
                                               value={bookInfo.BookPublisher}
                                               name="BookPublisher"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="publishDate">Publish
                                        Date:</label>
                                    <div className='col-sm-10'>
                                        <input type="test" className="form-control" id="publishDate"
                                               disabled={true}
                                               value={bookInfo.PublisherDate}
                                               name="BookPublisher"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookAuthor">Book
                                        author:</label>
                                    <div className='col-sm-10'>
                                        <input type="text" className="form-control" id="publishDate"
                                               placeholder="Enter Publish Date"
                                               disabled={true}
                                               value={bookInfo.BookAuthor}
                                               name="BookAuthor"
                                        />
                                    </div>

                                </div>


                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="AvailableUnit">Available
                                        Unit:</label>
                                    <div className='col-sm-10'>
                                        <input type="text" className="form-control" id="AvailableUnit" placeholder=""
                                               disabled={true}
                                               value={bookInfo.AvailableUnit}
                                               name="AvailableUnit"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="UnitPrice">Unit
                                        Price:</label>
                                    <div className='col-sm-10 '>
                                        <input type="text" className="form-control" id="UnitPrice" placeholder=""
                                               disabled={true}
                                               value={bookInfo.UnitPrice}
                                               name="UnitPrice"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="UnitPrice">
                                        Number Of Units:
                                    </label>
                                    <div className='col-sm-10 '>
                                        <input type="text" className="form-control" id="UnitPrice" placeholder=""
                                               value={paymentInfo.numberOfUnit}
                                               onChange={PaymentInfoChange}
                                               name="numberOfUnit"

                                        />
                                    </div>
                                </div>

                                {/*<div className="row form-group">*/}
                                {/*    <label className='pull-left col-sm-2 col-form-label' ></label>*/}
                                {/*    <div className='col-sm-10'>*/}
                                {/*        <button className='btn btn-primary pull-left'>Save and continue</button>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </Panel>

                            <Panel>
                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Buyer Name:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               value={paymentInfo.BuyerName}
                                               onChange={PaymentInfoChange}
                                               name="BuyerName"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Buyer Address:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               value={paymentInfo.BuyerAddress}
                                               onChange={PaymentInfoChange}
                                               name="BuyerAddress"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Buyer Phone No.:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               value={paymentInfo.BuyerPhoneNumber}
                                               onChange={PaymentInfoChange}
                                               name="BuyerPhoneNumber"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Purchase Date:</label>
                                    <div className='col-sm-10'>
                                        <input type="date"
                                               className="form-control"
                                               value={paymentInfo.purchaseDate}
                                               onChange={PaymentInfoChange}
                                               name="purchaseDate"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">National Id:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               value={paymentInfo.NotionalId}
                                               onChange={PaymentInfoChange}
                                               name="NotionalId"
                                        />
                                    </div>
                                </div>

                                {/*<div className="row form-group">*/}
                                {/*    <label className='pull-left col-sm-2 col-form-label' ></label>*/}
                                {/*    <div className='col-sm-10'>*/}
                                {/*        <button className='btn btn-primary pull-left'>Save and continue</button>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </Panel>

                            <Panel>
                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Payment Method:</label>
                                    <div className='col-sm-10'>
                                        <select className='form-control'>
                                            <option >Cash</option>
                                            <option disabled={true}>Credit Card</option>
                                            <option disabled={true}>Paypal</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Number Of Units:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               disabled={true}
                                               value={paymentInfo.numberOfUnit}
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Unit Price:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               id="bookId"
                                               placeholder="Enter Book Id"
                                               value={bookInfo.UnitPrice}
                                               disabled={true}
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Total Price:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               id="bookId"
                                               placeholder="Enter Book Id"
                                               value={ bookInfo.UnitPrice * paymentInfo.numberOfUnit}
                                               disabled={true}
                                        />
                                    </div>
                                </div>



                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' ></label>
                                    <div className='col-sm-10'>
                                        <button className='btn btn-primary pull-left' onClick={() => ReserveBook()}>Reserve book</button>
                                    </div>
                                </div>
                            </Panel>
                        </Tabs>
                    </div>

                    <div className="row form-group">
                        <div className='col-sm-2 col-sm-offset-6'>
                            <button className='btn btn-default pull-left'
                                    onClick={() => setShowPaymentDialog(!showPaymentDialog)}> Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </Modal>



        </div>);
}

export default Books;