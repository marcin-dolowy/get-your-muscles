import {isNullOrUndefined, L10n} from '@syncfusion/ej2-base';
import NavBar from "../NavBar";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Agenda, Day, Inject, Month, ScheduleComponent, Week, WorkWeek} from '@syncfusion/ej2-react-schedule';
import '../App/App.css';
import {toast} from "react-toastify";
import PaymentSummaryModal from "../PaymentSummaryModal";

L10n.load({
    'en-US': {
        'schedule': {
            'saveButton': 'Pay',
            'cancelButton': 'Close'
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

    const scheduleObj = useRef(null);
    const calculatedPriceObj = useRef(null);
    const trainerObj = useRef(null);
    const startEventObj = useRef(null);
    const endEventObj = useRef(null);
    const [events, setEvents] = useState([]);
    const CURRENCY = "PLN";
    const PAYMENT_METHOD = "paypal";
    const [trainers, setTrainers] = useState([]);

    const handleShow = (eventData) => {
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
                toast.error(err.response.data);
            }
        };
        loadData();
    }, [isMyCalendar]);

    const calculateTotalPrice = () => {
        const trainerId = trainerObj.current.options[trainerObj.current.selectedIndex].getAttribute("data-key");
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
                toast.error(err.response.data);
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
            console.log(args.data[0])

            handleShow(args.data[0]);
            let parsedEventsData = await getEventsByCalendar();

            setEvents(parsedEventsData);

        } else if (args.requestType === 'eventRemove') {
            args.cancel = true;
            const eventId = args.data[0].Id;

            axios
                .delete("api/v1/events/" + eventId, {
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
                    toast.error(err.response.data);
                });

        } else if (args.requestType === 'eventChange') {


        }
    }

    const onPopupOpen = async (args) => {
        console.log(args, "args - onPopupOpen")
        if (args.type === 'Editor') {

            const trainerId = trainerObj.current.options[trainerObj.current.selectedIndex].getAttribute("data-key");
            const orderData = {
                id: parseInt(trainerId),
                startEvent: formatDate(args.data.startEvent, false),
                endEvent: formatDate(args.data.endEvent, false)
            };

            axios
                .post("api/v1/events/price", orderData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                })
                .then((response) => {
                    const calculatedPrice = response.data;

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
                        let calculatedPriceInputElement = args.element.querySelector('#calculatedPriceInput');
                        if (calculatedPriceInputElement) {
                            calculatedPriceInputElement.value = calculatedPrice;
                        }
                    }, 10);

                })
                .catch((err) => {
                    console.log(err)
                    toast.error(err.response.data);
                });
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
                    const selectedTrainerId = parseInt(trainerSelectedOptionElement.getAttribute("data-key"));

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
        // console.log(events, "events - editorTemplate")

        return (
            props !== undefined ?
                <div className="toJestDiv">
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
                                       defaultValue={formatDate(props.startEvent, true) || null}/>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="mb-1">
                                <label className="col-form-label">To</label>
                                <input id="endEventInput" className="e-field form-control" type="datetime-local"
                                       data-name="endEvent" onChange={calculateTotalPrice} ref={endEventObj}
                                       defaultValue={formatDate(props.endEvent, true) || null}/>
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

    return (
        <>
            <NavBar isMyCalendar={isMyCalendar} setIsMyCalendar={setIsMyCalendar} onChangeCalendar={() => {
                setIsMyCalendar(!isMyCalendar);
            }}/>
            <ScheduleComponent height='850px' selectedDate={new Date(2023, 1, 15)} eventSettings={eventSettings}
                               workHours={workHours} ref={scheduleObj} popupClose={onPopupClose} popupOpen={onPopupOpen}
                               editorTemplate={editorTemplate} showQuickInfo={false} actionBegin={onActionBegin}>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>
            </ScheduleComponent>
            <PaymentSummaryModal
                show={modalShow}
                onHide={handleClose}
                price={price} setPrice={setPrice} currency={currency} setCurrency={setCurrency}
                paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} title={title} setTitle={setTitle}
                trainer={trainer} setTrainer={setTrainer} member={member} setMember={setMember}
                description={description} setDescription={setDescription}
                startEvent={startEvent} setStartEvent={setStartEvent} endEvent={endEvent} setEndEvent={setEndEvent}
            />
        </>
    );
}

export default CalendarPage;
