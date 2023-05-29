import {createElement} from '@syncfusion/ej2-base';
import NavBar from "./NavBar";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Agenda, Day, Inject, Month, ScheduleComponent, Week, WorkWeek} from '@syncfusion/ej2-react-schedule';
import './App.css';

const MemberCalendarPage = ({ isMyCalendar, setIsMyCalendar }) => {
    // na razie shardcodowana lista trenerów
    const trainers = ["Trainer 1", "Trainer 2", "Trainer 3"];

    const [events, setEvents] = useState([]);
    useEffect(() => {
        const loadData = async () => {
            let loggedUserEmail = localStorage.getItem("loggedUserEmail");
            const responseForUser = await axios.get("/api/v1/users/find/" + loggedUserEmail);
            const responseUser = responseForUser.data;
            const responseUserId = responseUser.id;

            const responseForEvents = await axios.get("api/v1/events/all");
            const responseEvents = responseForEvents.data;
            console.log(responseEvents, "responseEvents");

            let parsedEventsData = []
            for (let i = 0; i < responseEvents.length; i++) {
                let responseEvent = responseEvents[i];
                let parsedEvent = {
                    id: responseEvent.id,
                    trainer: (typeof responseEvent.trainer === 'object') ? (responseEvent.trainer.firstName + ' ' + responseEvent.trainer.lastName) : responseEvent.trainer,
                    title: responseEvent.title,
                    description: responseEvent.description,
                    startEvent: new Date(responseEvent.startEvent),
                    endEvent: new Date(responseEvent.endEvent)
                };
                parsedEventsData.push(parsedEvent);
            }
            setEvents(parsedEventsData);
        }
        loadData();
    }, []);


    const convertDateToDatapicker = (date) => {
        let currentDate = new Date(date);
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Dodajemy 1, ponieważ miesiące są indeksowane od 0
        let day = String(currentDate.getDate()).padStart(2, '0');
        let hours = String(currentDate.getHours()).padStart(2, '0');
        let minutes = String(currentDate.getMinutes()).padStart(2, '0');

        return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
    }

    const scheduleObj = useRef(null);
    const workHours = {
        highlight: true, start: '8:00', end: '16:00'
    };
    const fieldsData = {
        id: {name: 'id'},
        location: {name: 'trainer'},
        subject: {name: 'title'},
        description: {name: 'description'},
        startTime: {name: 'startEvent'},
        endTime: {name: 'endEvent'}
    }
    const eventSettings = {dataSource: events, fields: fieldsData};


    const onPopupOpen = (args) => {
        if (args.type === 'Editor') {
            let formElement = args.element.querySelector('.e-schedule-form');

            formElement.firstChild.remove();
            let firstDiv = createElement('div');
            formElement.insertBefore(firstDiv, formElement.firstChild);
            let form = createElement('form');
            formElement.firstChild.insertBefore(form, formElement.firstChild.firstChild);
            let fieldset = createElement('fieldset');
            formElement.firstChild.firstChild.insertBefore(fieldset, formElement.firstChild.firstChild.firstChild);

            let textareaDiv = createElement('div', {className: "mb-1"});
            formElement.firstChild.firstChild.firstChild.insertBefore(textareaDiv, formElement.firstChild.firstChild.firstChild.firstChild);
            let descriptionLabel = createElement('label', {className: "col-form-label", innerHTML: "Description"});
            let descriptionTextArea = createElement('textarea', {
                id: "descriptionTextArea",
                className: "e-field form-control",
                attrs: {name: "description", rows: "3", cols: "50"}
            });
            formElement.firstChild.firstChild.firstChild.firstChild.insertBefore(descriptionTextArea, formElement.firstChild.firstChild.firstChild.firstChild.firstChild);
            formElement.firstChild.firstChild.firstChild.firstChild.insertBefore(descriptionLabel, formElement.firstChild.firstChild.firstChild.firstChild.firstChild);

            let datesDiv = createElement('div', {className: "row g-2"});
            formElement.firstChild.firstChild.firstChild.insertBefore(datesDiv, formElement.firstChild.firstChild.firstChild.firstChild);
            let secEndDatesDiv = createElement('div', {className: "col-md"});
            formElement.firstChild.firstChild.firstChild.firstChild.insertBefore(secEndDatesDiv, formElement.firstChild.firstChild.firstChild.firstChild.firstChild);
            let thirdEndDatesDiv = createElement('div', {className: "mb-1"});
            formElement.firstChild.firstChild.firstChild.firstChild.firstChild.insertBefore(thirdEndDatesDiv, formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild);
            let endEventLabel = createElement('label', {className: "col-form-label", innerHTML: "To"});
            let endEvent = convertDateToDatapicker(args.data.endEvent);
            let endEventInput = createElement('input', {
                id: "endEventInput",
                className: "e-field form-control",
                attrs: {name: "endEvent", type: "datetime-local", value: endEvent, required: true}
            });
            formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.insertBefore(endEventInput, formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild)
            formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.insertBefore(endEventLabel, formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild)

            let secStartDatesDiv = createElement('div', {className: "col-md"});
            formElement.firstChild.firstChild.firstChild.firstChild.insertBefore(secStartDatesDiv, formElement.firstChild.firstChild.firstChild.firstChild.firstChild);
            let thirdStartDatesDiv = createElement('div', {className: "mb-1"});
            formElement.firstChild.firstChild.firstChild.firstChild.firstChild.insertBefore(thirdStartDatesDiv, formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild);
            let startEventLabel = createElement('label', {className: "col-form-label", innerHTML: "From"});
            let startEvent = convertDateToDatapicker(args.data.startEvent);
            let startEventInput = createElement('input', {
                id: "startEventInput",
                className: "e-field form-control",
                attrs: {name: "startEvent", type: "datetime-local", value: startEvent, required: true}
            });
            formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.insertBefore(startEventInput, formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild)
            formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.insertBefore(startEventLabel, formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild)

            let selectDiv = createElement('div', {className: "mb-1"});
            formElement.firstChild.firstChild.firstChild.insertBefore(selectDiv, formElement.firstChild.firstChild.firstChild.firstChild);
            let selectLabel = createElement('label', {className: "col-form-label", innerHTML: "Trainer"});
            let trainerSelect = createElement('select', {
                id: "trainerSelect",
                className: "e-field form-select",
                attrs: {name: "trainer"}
            });
            for (let i = trainers.length - 1; i >= 0; i--) {
                let trainerSelectOption = createElement('option', {attrs: {key: i.toString()}, innerHTML: trainers[i]});
                trainerSelect.insertBefore(trainerSelectOption, trainerSelect.firstChild);
            }
            formElement.firstChild.firstChild.firstChild.firstChild.insertBefore(trainerSelect, formElement.firstChild.firstChild.firstChild.firstChild.firstChild);
            formElement.firstChild.firstChild.firstChild.firstChild.insertBefore(selectLabel, formElement.firstChild.firstChild.firstChild.firstChild.firstChild);

            let titleDiv = createElement('div', {className: "mb-1"});
            formElement.firstChild.firstChild.firstChild.insertBefore(titleDiv, formElement.firstChild.firstChild.firstChild.firstChild);
            let titleLabel = createElement('label', {className: "col-form-label", innerHTML: "Title"});
            let titleInput = createElement('input', {
                id: "titleInput",
                className: "e-field form-control",
                attrs: {name: "title", type: "text", required: true}
            });
            formElement.firstChild.firstChild.firstChild.firstChild.insertBefore(titleInput, formElement.firstChild.firstChild.firstChild.firstChild.firstChild);
            formElement.firstChild.firstChild.firstChild.firstChild.insertBefore(titleLabel, formElement.firstChild.firstChild.firstChild.firstChild.firstChild);


            let titleInputElement = args.element.querySelector('#titleInput');
            let trainerSelectElement = args.element.querySelector('#trainerSelect');
            let startEventInputElement = args.element.querySelector('#startEventInput');
            let endEventInputElement = args.element.querySelector('#endEventInput');
            let descriptionTextAreaElement = args.element.querySelector('#descriptionTextArea');

            titleInputElement.value = args.data.title || "";
            if (args.data.trainer) {
                trainerSelectElement.value = args.data.trainer;
            } else {
                trainerSelectElement.selectedIndex = 0;
            }
            startEventInputElement.value = convertDateToDatapicker(args.data.startEvent) || startEvent;
            endEventInputElement.value = convertDateToDatapicker(args.data.endEvent) || endEvent;
            descriptionTextAreaElement.value = args.data.description || "";
        }
    }

    const onActionBegin = async (args) => {
        if (args.requestType === 'eventCreate') {
            args.cancel = true;
            console.log(args, "args - eventCreate");
            console.log(scheduleObj.current.getEvents(), "scheduleObj.current.getEvents()");
            const calendarEvents = scheduleObj.current.getEvents();

            if (calendarEvents.length === 0) {
                args.data[0].id = 1;
            } else {
                let maxIdEvent = calendarEvents[0];
                calendarEvents.forEach((calEvent) => {
                    if (calEvent.id > maxIdEvent.id) {
                        maxIdEvent = calEvent;
                    }
                });
                args.data[0].id = maxIdEvent.id + 1;
                console.log(args.data, "args.data")
            }

            let newEvent = {
                id: args.data[0].id,
                trainer: args.data[0].trainer,
                title: args.data[0].title,
                description: args.data[0].description,
                startEvent: args.data[0].startEvent,
                endEvent: args.data[0].endEvent
            }

            let newEvents = [];
            for (let i = 0; i < events.length; i++) {
                newEvents.push(events[i]);
            }

            //strzelac
            let token = localStorage.getItem("token");
            if (token) {
                const response = await axios.post("/api/v1/event/add", {newEvent}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response);

                newEvents.push(newEvent);
                setEvents(newEvents);
            }


        } else if (args.requestType === 'eventRemove') {
            args.cancel = true;
            console.log(args, "args - eventRemove");

            let eventToRemoveId = args.data[0].id;
            for (let i = 0; i < events.length; i++) {
                if (eventToRemoveId === events[i].id) {
                    let newEvents = events.filter(function (item) {
                        return item.id !== eventToRemoveId;
                    });
                    setEvents(newEvents);
                    break;
                }
            }

            //strzelac

        } else if (args.requestType === 'eventChange') {
            args.cancel = true;
            console.log(args, "args - eventChange");

            let editEvent = {
                id: args.data.id,
                trainer: args.data.trainer,
                title: args.data.title,
                description: args.data.description,
                startEvent: args.data.startEvent,
                endEvent: args.data.endEvent
            }

            let eventToRemoveId = args.data.id;
            for (let i = 0; i < events.length; i++) {
                if (eventToRemoveId === events[i].id) {
                    let editedEvents = events.filter(function (item) {
                        return item.id !== eventToRemoveId;
                    });
                    editedEvents.push(editEvent);
                    setEvents(editedEvents);
                    break;
                }
            }

            // strzelac

        }
    }

    const editorTemplate = (props) => {
        console.log(events, "events - editorTemplate")

        return (
            <div></div>
        );
    }

    return (
        <>
            <NavBar isMyCalendar={isMyCalendar} setIsMyCalendar={setIsMyCalendar} />
            <ScheduleComponent height='800px' selectedDate={new Date(2023, 1, 15)} eventSettings={eventSettings}
                               workHours={workHours} popupOpen={onPopupOpen.bind(this)} ref={scheduleObj}
                               editorTemplate={editorTemplate} actionBegin={onActionBegin} showQuickInfo={false}>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>
            </ScheduleComponent>
        </>
    );
}

export default MemberCalendarPage;