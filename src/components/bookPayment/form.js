import {Panel, Tab, Tabs} from "./tabs";
import React from "react";
import './tab.css';

const paymentForm = () => {

    const Button = ({isActive, onClick, children}) => (
        <button className='btn' disabled={isActive} onClick={onClick}>
            {children}
        </button>
    )

    return (

        <div className='container'>
            <div className='panel panel-default'>
                <div className="panel-heading">Reserve a book</div>
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
                                           
                                           
                                           name="BookId"
                                    />
                                </div>
                            </div>

                            <div className="row form-group">
                                <label className='pull-left col-sm-2 col-form-label' htmlFor="bookTitle">Book
                                    Title:</label>
                                <div className='col-sm-10'>
                                    <input type="text" className="form-control" id="bookTitle"
                                           placeholder="Enter Book Title"
                                           
                                           
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
                                           
                                           name="BookTitle"
                                    />
                                </div>
                            </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="publishDate">Publish
                                        Date:</label>
                                    <div className='col-sm-10'>
                                        <input type="date" className="form-control" id="publishDate"
                                               placeholder="Enter Publish Date"
                                               disabled={true}
                                               
                                               name="PublisherDate"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookAuthor">Book
                                        author:</label>
                                    <div className='col-sm-10'>
                                        <input type="date" className="form-control" id="publishDate"
                                               placeholder="Enter Publish Date"
                                               disabled={true}
                                               
                                               name="PublisherDate"
                                        />
                                    </div>

                                </div>


                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="AvailableUnit">Available
                                        Unit:</label>
                                    <div className='col-sm-10'>
                                        <input type="text" className="form-control" id="AvailableUnit" placeholder=""
                                               disabled={true}
                                               
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


                                               name="UnitPrice"
                                        />
                                    </div>
                            </div>

                            <div className="row form-group">
                                <label className='pull-left col-sm-2 col-form-label' ></label>
                                <div className='col-sm-10'>
                                    <button className='btn btn-primary pull-left'>Save and continue</button>
                                </div>
                            </div>
                        </Panel>

                        <Panel>
                            <div className="row form-group">
                                <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Buyer Name:</label>
                                <div className='col-sm-10'>
                                    <input type="text"
                                           className="form-control"
                                           id="bookId"
                                           placeholder="Enter Book Id"
                                           name="BookId"
                                    />
                                </div>
                            </div>

                            <div className="row form-group">
                                <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Buyer Address:</label>
                                <div className='col-sm-10'>
                                    <input type="text"
                                           className="form-control"
                                           id="bookId"
                                           placeholder="Enter Book Id"
                                           name="BookId"
                                    />
                                </div>
                            </div>

                            <div className="row form-group">
                                <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Buyer Phone No.:</label>
                                <div className='col-sm-10'>
                                    <input type="text"
                                           className="form-control"
                                           id="bookId"
                                           placeholder="Enter Book Id"
                                           name="BookId"
                                    />
                                </div>
                            </div>

                            <div className="row form-group">
                                <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Purchase Date:</label>
                                <div className='col-sm-10'>
                                    <input type="date"
                                           className="form-control"
                                           id="bookId"
                                           placeholder="Enter Book Id"
                                           name="BookId"
                                    />
                                </div>
                            </div>

                            <div className="row form-group">
                                <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">National Id:</label>
                                <div className='col-sm-10'>
                                    <input type="text"
                                           className="form-control"
                                           id="bookId"
                                           placeholder="Enter Book Id"
                                           name="BookId"
                                    />
                                </div>
                            </div>

                            <div className="row form-group">
                                <label className='pull-left col-sm-2 col-form-label' ></label>
                                <div className='col-sm-10'>
                                    <button className='btn btn-primary pull-left'>Save and continue</button>
                                </div>
                            </div>
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
                                           id="bookId"
                                           placeholder="Enter Book Id"
                                           name="BookId"
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
                                           name="BookId"
                                           disabled={true}
                                    />
                                </div>
                            </div>

                            <div className="row form-group">
                                <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Total Price:</label>
                                <div className='col-sm-10'>
                                    <input type="date"
                                           className="form-control"
                                           id="bookId"
                                           placeholder="Enter Book Id"
                                           name="BookId"
                                           disabled={true}
                                    />
                                </div>
                            </div>



                            <div className="row form-group">
                                <label className='pull-left col-sm-2 col-form-label' ></label>
                                <div className='col-sm-10'>
                                    <button className='btn btn-primary pull-left'>Reserve book</button>
                                </div>
                            </div>
                        </Panel>
                    </Tabs>
                </div>
            </div>
        </div>);
}
export default paymentForm;