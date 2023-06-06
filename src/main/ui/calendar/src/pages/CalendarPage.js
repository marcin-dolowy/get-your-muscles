import {isNullOrUndefined, L10n} from '@syncfusion/ej2-base';
import NavBar from "../NavBar";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Agenda, Day, Inject, Month, ScheduleComponent, Week, WorkWeek} from '@syncfusion/ej2-react-schedule';
import '../App/App.css';
import {toast, ToastContainer} from "react-toastify";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";

L10n.load({
    'en-US': {
        'schedule': {
            'saveButton': 'Pay',
            'cancelButton': 'Close',
            'deleteButton': 'Cancel Event'
        },
    }
});

const CalendarPage = ({isMyCalendar, setIsMyCalendar}) => {
    //variables necessary to payment
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [title, setTitle] = useState("");

    //variables to show data about event
    const [trainer, setTrainer] = useState("");
    const [member, setMember] = useState("");
    const [description, setDescription] = useState("");
    const [startEvent, setStartEvent] = useState("");
    const [endEvent, setEndEvent] = useState("");

    const [modalShow, setModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);

    const scheduleObj = useRef(null);
    const calculatedPriceObj = useRef(null);
    const trainerObj = useRef(null);
    const startEventObj = useRef(null);
    const endEventObj = useRef(null);
    const [events, setEvents] = useState([]);
    const [memberId, setMemberId] = useState(null);
    const CURRENCY = "PLN";
    const PAYMENT_METHOD = "paypal";
    const [trainers, setTrainers] = useState([]);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleShow = (eventData) => {
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        const isStartEventValid = regex.test(eventData.startEvent);
        const isEndEventValid = regex.test(eventData.endEvent);
        if (!isStartEventValid  || !isEndEventValid) {
            toast.error("Incorrect Date");
            return;
        }
        setPrice(eventData.calculatedPrice);
        setCurrency(CURRENCY);
        setPaymentMethod(PAYMENT_METHOD);
        setTitle(eventData.title);

        setTrainer(eventData.trainer);
        setMember(localStorage.getItem("loggedUserEmail"));
        setDescription(eventData.description);
        setStartEvent(eventData.startEvent);
        setEndEvent(eventData.endEvent);

        setModalShow(true);
    };
    const handleClose = () => setModalShow(false);
    const handleDeleteConfirmationClose = () => {
        const eventId = scheduleObj.current.activeEventData.event.Id;

        axios
            .delete("api/v1/events/" + eventId, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(async (response) => {
                scheduleObj.current.deleteEvent(eventId);
                let parsedEventsData = await getEventsByCalendar();

                setEvents(parsedEventsData);
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.message);
            });

        setDeleteModalShow(false);
    }

    const getTrainers = async () => {
        const responseForTrainers = await axios.get("/api/v1/users/all/trainers", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        const responseTrainersData = responseForTrainers.data;
        let parsedTrainersData = [];
        responseTrainersData.forEach((responseTrainer) => {
            let parsedTrainer = {
                id: responseTrainer.id,
                firstName: responseTrainer.firstName,
                lastName: responseTrainer.lastName,
                trainingPrice: parseFloat(responseTrainer.trainingPrice).toFixed(2)
            };
            parsedTrainersData.push(parsedTrainer);
        });

        return parsedTrainersData;
    }

    const getLoggedUserEvents = async () => {
        let loggedUserEmail = localStorage.getItem("loggedUserEmail");
        const responseForUser = await axios.get("/api/v1/users/find/" + loggedUserEmail, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        const responseUserId = responseForUser.data.id;
        setMemberId(responseUserId);

        return await axios.get("api/v1/events/member/" + responseUserId, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    const parseEvents = async (responseEventsData) => {
        let parsedEventsData = [];
        responseEventsData.forEach((responseEvent) => {
            let parsedEvent = {
                Id: responseEvent.id,
                trainer: responseEvent.trainer.firstName + ' ' + responseEvent.trainer.lastName + " - "
                    + parseFloat(responseEvent.trainer.trainingPrice).toFixed(2),
                title: responseEvent.title,
                description: responseEvent.description,
                startEvent: new Date(responseEvent.startEvent),
                endEvent: new Date(responseEvent.endEvent),
                trainerId: parseInt(responseEvent.trainer.id)
            };
            parsedEventsData.push(parsedEvent);
        });

        return parsedEventsData;
    }

    const getEvents = async () => {
        if (isMyCalendar) {
            return await getLoggedUserEvents();

        } else {
            return await axios.get("api/v1/events/all", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        }
    }

    const getEventsByCalendar = async () => {
        const response = await getEvents();
        return await parseEvents(response.data);
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                let parsedTrainersData = await getTrainers();
                setTrainers(parsedTrainersData);

                let parsedEventsData = await getEventsByCalendar();

                setEvents(parsedEventsData);

            } catch (err) {
                console.log(err)
                toast.error(err.message);
            }
        };
        loadData();
    }, [isMyCalendar]);

    const calculateTotalPrice = () => {
        const trainerId = trainerObj.current.options[trainerObj.current.selectedIndex]?.getAttribute("data-key");
        const orderData = {
            id: parseInt(trainerId),
            startEvent: formatDate(startEventObj.current.value, false),
            endEvent: formatDate(endEventObj.current.value, false)
        };

        axios
            .post("api/v1/events/price", orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                calculatedPriceObj.current.value = response.data;
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.message);
            });
    }

    const formatDate = (date, isFormatToDatepicker) => {
        let currentDate = new Date(date);
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Dodajemy 1, ponieważ miesiące są indeksowane od 0
        let day = String(currentDate.getDate()).padStart(2, '0');
        let hours = String(currentDate.getHours()).padStart(2, '0');
        let minutes = String(currentDate.getMinutes()).padStart(2, '0');
        let seconds = String(currentDate.getSeconds()).padStart(2, '0');

        if (isFormatToDatepicker) {
            return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
        } else {
            return year + '-' + month + '-' + day + " " + hours + ':' + minutes + ':' + seconds;
        }
    }

    // settings for ScheduleComponent
    const workHours = {
        highlight: true, start: '8:00', end: '16:00'
    };
    const fieldsData = {
        location: {name: 'trainer'},
        subject: {name: 'title'},
        description: {name: 'description'},
        startTime: {name: 'startEvent'},
        endTime: {name: 'endEvent'},
        trainerId: {name: 'trainerId'}
    }
    const eventSettings = {dataSource: events, fields: fieldsData};


    const onActionBegin = async (args) => {
        if (args.requestType === 'eventCreate') {
            args.cancel = true;
            handleShow(args.data[0]);

            //to tylko tak na razie, trzeba będzie to usunąć, bo tworzenie będzie dopiero jak payment będzie success
            const newEvent = {
                title: args.data[0].title,
                description: args.data[0].description,
                startEvent: formatDate(args.data[0].startEvent, false),
                endEvent: formatDate(args.data[0].endEvent, false),
                member: {
                    id: memberId
                },
                trainer: {
                    id: args.data[0].trainerId
                }
            }

            axios
                .post("api/v1/events/add", newEvent, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(async (response) => {
                    args.cancel = false;

                    let parsedEventsData = await getEventsByCalendar();

                    setEvents(parsedEventsData);
                })
                .catch((err) => {
                    console.log(err)
                    toast.error(err.message);
                });
            // do tego miejsca

        } else if (args.requestType === 'eventRemove') {
            args.cancel = true;

        } else if (args.requestType === 'eventChange') {
            args.cancel = true;
            const eventId = args.data.Id;

            const editedEvent = {
                title: args.data.title,
                description: args.data.description
            }

            axios
                .patch("api/v1/events/update/" + eventId, editedEvent, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(async (response) => {
                    args.cancel = false;

                    let parsedEventsData = await getEventsByCalendar();

                    setEvents(parsedEventsData);
                })
                .catch((err) => {
                    console.log(err)
                    toast.error(err.message);
                });

        }
    }

    const changePayButtonName = (text) => {
        const payButton = document.querySelector(
            "div.e-footer-content > button.e-schedule-dialog.e-control.e-btn.e-lib.e-primary.e-event-save.e-flat")
        payButton.innerHTML = text;
    }

    const onPopupOpen = async (args) => {
        console.log(args, "args - onPopupOpen");

        if (args.type === 'DeleteAlert') {
            // setTimeout(() => {
            //     // change the text in delete confirmation dialog (modal)
            //     const deleteConfirmationDialogContent = document.querySelector("#QuickDialog_dialog-content");
            //     deleteConfirmationDialogContent.value = "Do you really want to cancel the event? You will not get a refund.";
            //     const deleteButtonConfirmationDialog = document.querySelector("#QuickDialog > div.e-footer-content > button.e-quick-dialog.e-control.e-btn.e-lib.e-quick-alertok.e-flat.e-primary.e-quick-dialog-delete");
            //     // deleteButtonConfirmationDialog.ariaLabel = "Cancel";
            //     const cancelButtonConfirmationDialog = document.querySelector("#QuickDialog > div.e-footer-content > button.e-quick-dialog.e-control.e-btn.e-lib.e-quick-alertcancel.e-flat.e-quick-dialog-cancel");
            //     // cancelButtonConfirmationDialog.ariaLabel = "Close";
            //     // console.log(document.querySelector("#QuickDialog_title"));
            //     console.log(deleteConfirmationDialogContent, "deleteConfirmationDialog")
            // }, 5000);
            args.cancel = true;
            setDeleteModalShow(true);
            console.log("aaaaaaaaaaaaaaaa")

        } else if (args.type === 'Editor') {

            setTimeout(() => {
                let trainerIdInputElement = args.element.querySelector('#trainerIdInput');
                if (trainerIdInputElement) {
                    trainerIdInputElement.value = args.data.trainerId || "";
                }
                let titleInputElement = args.element.querySelector('#titleInput');
                if (titleInputElement) {
                    titleInputElement.value = args.data.title || "";
                }
                let trainerSelectElement = args.element.querySelector('#trainerSelect');
                if (trainerSelectElement) {
                    trainerSelectElement.value = args.data.trainer || trainerSelectElement[0]?.value;
                }
                let descriptionTextAreaElement = args.element.querySelector('#descriptionTextArea');
                if (descriptionTextAreaElement) {
                    descriptionTextAreaElement.value = args.data.description || "";
                }
                calculateTotalPrice();

                //to set disabled on trainer select and date need to check length of data passed to this function
                if (Object.keys(args.data).length > 4) {
                    trainerSelectElement.setAttribute("disabled", "true");
                    let startEventInputElement = args.element.querySelector('#startEventInput');
                    if (startEventInputElement) {
                        startEventInputElement.setAttribute("disabled", "true");
                    }
                    let endEventInputElement = args.element.querySelector('#endEventInput');
                    if (endEventInputElement) {
                        endEventInputElement.setAttribute("disabled", "true");
                    }
                    changePayButtonName("Modify")
                }
            }, 10);
        }
    }

    const onPopupClose = (args) => {
        if (args.type === 'Editor' && !isNullOrUndefined(args.data)) {
            let trainerIdInputElement = args.element.querySelector('#trainerIdInput');

            if (trainerIdInputElement) {
                for (let i = 0; i < trainers.length; i++) {
                    const trainerId = parseInt(trainers[i].id);
                    const trainerSelectElement = args.element.querySelector('#trainerSelect');
                    const trainerSelectedOptionElement = trainerSelectElement.options[trainerSelectElement.selectedIndex];
                    const selectedTrainerId = parseInt(trainerSelectedOptionElement?.getAttribute("data-key"));

                    if (trainerId === selectedTrainerId) {
                        args.data.trainerId = trainerId;
                    }
                }
            }
        }
    }

    const editorTemplate = (props) => {
        // console.log(props, "props - editorTemplate")
        // console.log(trainers, "trainers")
        // console.log(scheduleObj.current.getEvents(), "scheduleObj.current.getEvents() - editorTemplate");
        console.log(events, "events - editorTemplate");
        changePayButtonName("Pay");

        return (
            props !== undefined ?
                <div>
                    <input id="trainerIdInput" type="text" className="e-field" data-name="trainerId" disabled hidden/>
                    <div className="mb-1">
                        <label className="col-form-label">Title</label>
                        <input id="titleInput" type="text" className="e-field form-control" data-name="title"/>
                    </div>
                    <div className="mb-1">
                        <label className="col-form-label">Trainer</label>
                        <select id="trainerSelect" className="e-field form-select" data-name="trainer"
                                onChange={calculateTotalPrice} ref={trainerObj}>
                            {trainers.map((trainer) => (
                                <option key={trainer.id} data-key={trainer.id}>
                                    {trainer.firstName + " " + trainer.lastName + " - " +
                                        parseFloat(trainer.trainingPrice).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="row g-2">
                        <div className="col-md">
                            <div className="mb-1">
                                <label className="col-form-label">From</label>
                                <input id="startEventInput" className="e-field form-control" type="datetime-local"
                                       data-name="startEvent" onChange={calculateTotalPrice} ref={startEventObj}
                                       defaultValue={formatDate(props.startEvent, true)}/>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="mb-1">
                                <label className="col-form-label">To</label>
                                <input id="endEventInput" className="e-field form-control" type="datetime-local"
                                       data-name="endEvent" onChange={calculateTotalPrice} ref={endEventObj}
                                       defaultValue={formatDate(props.endEvent, true)}/>
                            </div>
                        </div>
                    </div>
                    <div className="mb-1">
                        <label className="col-form-label">Description</label>
                        <textarea id="descriptionTextArea" className="e-field form-control" data-name="description"
                                  rows={3} cols={50}></textarea>
                    </div>
                    <div className="mb-1 text-end">
                        <label className="col-form-label fw-bold">Total Price</label>
                        <div className="d-flex justify-content-end">
                            <div className="col-4">
                                <input id="calculatedPriceInput" type="text" className="e-field form-control text-end"
                                       data-name="calculatedPrice" disabled ref={calculatedPriceObj}/>
                            </div>
                        </div>
                    </div>
                </div>
                : <div></div>
        );
    }

    const payForTraining = (price, currency, paymentMethod, description) => {
        const paymentData = {
            price: price,
            currency: currency,
            method: paymentMethod,
            intent: "sale",
            description: description
        };

        axios
            .post("/pay", paymentData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                window.location.replace(response.data)
                handleClose();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
            });
    };

    return (
        <>
            <NavBar isMyCalendar={isMyCalendar} setIsMyCalendar={setIsMyCalendar} onChangeCalendar={() => {
                setIsMyCalendar(!isMyCalendar);
            }}/>
            <ScheduleComponent height='850px' selectedDate={selectedDate.toDateString()} eventSettings={eventSettings}
                               workHours={workHours} ref={scheduleObj} popupClose={onPopupClose} popupOpen={onPopupOpen}
                               editorTemplate={editorTemplate} showQuickInfo={false} actionBegin={onActionBegin}>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>
            </ScheduleComponent>
                <Modal
                    contentClassName="rounded-0"
                    show={deleteModalShow}
                    onHide={() => setDeleteModalShow(false)}
                    keyboard={false}
                    centered
                    size="sm"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Cancel Event
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Do you really want to cancel the event?<br/><b>You will not get a refund.</b>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="e-schedule-dialog e-control e-btn e-lib e-primary e-event-save e-flat" onClick={handleDeleteConfirmationClose}>
                            Yes
                        </Button>
                        <Button className="e-schedule-dialog e-control e-btn e-lib e-event-cancel e-flat" onClick={() => setDeleteModalShow(false)}>
                            No
                        </Button>
                    </Modal.Footer>
                </Modal>
            <Modal
                contentClassName="rounded-0"
                show={modalShow}
                onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Payment Summary
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="formPrice">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        readOnly
                                        style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formCurrency">
                                    <Form.Label>Currency</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                    >
                                        <option value="PLN">PLN</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formMethod">
                                    <Form.Label>Method</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        readOnly
                                        style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formTitle">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        readOnly
                                        style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formTrainer">
                                    <Form.Label>Trainer</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={trainer}
                                        onChange={(e) => setTrainer(e.target.value)}
                                        readOnly
                                        style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formMember">
                                    <Form.Label>Member</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={member}
                                        onChange={(e) => setMember(e.target.value)}
                                        readOnly
                                        style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                    />
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        readOnly
                                        style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formStartEvent">
                                    <Form.Label>Start Event</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={startEvent}
                                        onChange={(e) => setStartEvent(e.target.value)}
                                        readOnly
                                        style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formEndEvent">
                                    <Form.Label>End Event</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={endEvent}
                                        onChange={(e) => setEndEvent(e.target.value)}
                                        readOnly
                                        style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="e-schedule-dialog e-control e-btn e-lib e-primary e-event-save e-flat" onClick={() => payForTraining(price, currency, paymentMethod, title)}>
                        I am paying
                    </Button>
                    <Button className="e-schedule-dialog e-control e-btn e-lib e-event-cancel e-flat" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar/>
        </>
    );
}

export default CalendarPage;
