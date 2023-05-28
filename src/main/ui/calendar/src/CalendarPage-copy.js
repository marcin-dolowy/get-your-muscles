import {createElement, extend, isNullOrUndefined} from '@syncfusion/ej2-base';
import NavBar from "./NavBar";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {
    Agenda,
    Day,
    Inject,
    Month,
    ScheduleComponent,
    ViewDirective,
    ViewsDirective,
    Week,
    WorkWeek
} from '@syncfusion/ej2-react-schedule';
import './App.css';

const CalendarPage = () => {
    const startObj = useRef(null);
    const endObj = useRef(null);
    const workHours = {
        highlight: true, start: '8:00', end: '16:00'
    };

    // na razie shardcodowana lista trenerów
    const trainers = ["Trainer 1", "Trainer 2", "Trainer 3"];


    //--- moze sie przyda -> do parametrów w URL-u
    // const params = useParams();
    // const calendarId = params.calendarId;
    // const calend = calendars.find(cal => cal.name === calendarId)
    //
    // if (!calend) {
    //     return <NotFoundPage />
    // }

    //---

    // const minValidation = (args) => {
    //     return args['value'].length >= 5;
    // };
    //
    // const fieldsData = {
    //     id: 'identificator',
    //     subject: { name: 'Subject', validation: { required: true } },
    //     location: { name: 'Location', validation: { required: true } },
    //     description: {
    //         name: 'Description', validation: {
    //             required: true, minLength: [minValidation, 'Need atleast 5 letters to be entered']
    //         }
    //     },
    //     startTime: { name: 'StartTime', validation: { required: true } },
    //     endTime: { name: 'EndTime', validation: { required: true } }
    // }

    const [events, setEvents] = useState([]);
    useEffect(() => {
        const loadData = async () => {
            const response = await axios.get("/calendar");
            const responseEvents = response.data;
            let parsedEventsData = [];
            for (let i = 0; i < responseEvents.length; i++) {
                let responseEvent = responseEvents[i];
                let parsedEvent = {
                    // id: responseEvent.id,
                    // eventName: responseEvent.subject,
                    // startTime: new Date(responseEvent.startTime + 'Z'),
                    // endTime: new Date(responseEvent.endTime + 'Z'),
                    // IsAllDay: responseEvent.allDay
                    id: responseEvent.id,
                    trainer: responseEvent.trainer,
                    title: responseEvent.title,
                    description: responseEvent.description,
                    startEvent: new Date(responseEvent.startEvent + 'Z'),
                    endEvent: new Date(responseEvent.endEvent + 'Z')
                };
                parsedEventsData.push(parsedEvent);
            }
            setEvents(parsedEventsData)
        }
        loadData();
    }, []);

    // const [reservations, setReservations] = useState();
    //
    // useEffect(() => {
    //     setReservation({
    //         Id: 6,
    //         Subject: 'Something',
    //         StartTime: new Date(2018, 1, 12, 17, 0),
    //         EndTime: new Date(2018, 1, 12, 18, 0)
    //     }, []);
    // })

    // const scheduleData = [
    //     {
    //         Id: 3,
    //         Subject: 'Testing',
    //         StartTime: new Date(2018, 1, 11, 9, 0),
    //         EndTime: new Date(2018, 1, 11, 10, 0),
    //         IsAllDay: false
    //     }, {
    //         Id: 4,
    //         Subject: 'Vacation',
    //         StartTime: new Date(2018, 1, 13, 9, 0),
    //         EndTime: new Date(2018, 1, 13, 10, 0),
    //         IsAllDay: false
    //     }
    // ];
    // console.log(scheduleData, "scheduleData")
    // console.log(events, "events")

    const fieldsData = {
        id: {name: 'id'},
        location: {name: 'trainer'},
        subject: {name: 'title'},
        description: {name: 'description'},
        startTime: {name: 'startEvent'},
        endTime: {name: 'endEvent'}
    }
    let data = extend([], events, null, true);
    const eventSettings = {dataSource: data, fields: fieldsData};

    // do wywoływania endpointów z backendu
    function onActionBegin(args) {
        // let weekEnds = [0, 6];
        console.log(args, "args onActionBegin")
        // console.log(args.requestType, "args.requestType")

        if (args.requestType === 'eventCreate'/* && weekEnds.indexOf((args.data[0].StartTime).getDay()) >= 0*/) {
            // args.cancel = true;
            console.log(args.data, "eventCreate");

            let newEvent = {
                id: events.length === 0 ? 1 : (events[events.length - 1].id + 1),
                trainer: args.data[0].trainer,
                title: args.data[0].title,
                description: args.data[0].description,
                startEvent: args.data[0].startEvent,
                endEvent: args.data[0].endEvent
            }
            args.data = newEvent;

            console.log(newEvent, "newEvent");
            console.log(args.data, "args.data newEvent");
            events.push(newEvent);
            setEvents(events);
            console.log("siema sejwa")
        } else if (args.requestType === 'eventRemove'/* && weekEnds.indexOf((args.data[0].StartTime).getDay()) >= 0*/) {
            args.cancel = true;
            console.log(args.data[0], "poczatek usuwania")
            let eventToRemoveId = args.data[0].id;
            for (let i = 0; i < events.length; i++) {
                let newEvents = events.filter(function(item) {
                    return item.id !== eventToRemoveId;
                });
                setEvents(newEvents);
            }
            console.log("siema deleta")

            console.log(args.data[0], "koniec usuwania")
        } else if (args.requestType === 'eventChange') {
            args.cancel = true;
            console.log(args.data, "poczatek zmieniania")
            for (let i = 0; i < events.length; i++) {
                let event = events[i];
                if (event.id === args.data.id) {
                    events[i] = {
                        id: args.data.id,
                        trainer: args.data.trainer,
                        title: args.data.title,
                        description: args.data.description,
                        startEvent: args.data.startEvent,
                        endEvent: args.data.endEvent
                    }
                    break;
                }
            }
            setEvents(events);

            console.log(events, "ewenty")

            // args.data = args.changedRecords[0];


            console.log("siema edita");
        }
        // console.log("koniec")
        console.log(events, "events onActionBegin")
    }

    //to remove annotation
    // setTimeout(function () {
    //     document.getRootNode().body.removeChild(document.querySelector("body > div:nth-child(4)"));
    // }, 1500);

    const onPopupOpen = (args) => {
        console.log(args.data, "args.data start onPopupOpen")
        console.log(args.element, "args.element start onPopupOpen")
        if (args.type === 'Editor') {
            let formElement = args.element.querySelector('.e-schedule-form');
            //
            // console.log(formElement.childNodes, "formElement")
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
            let descriptionTextArea = createElement('textarea', {id: "descriptionTextArea", className: "e-field form-control", attrs: { name: "description", rows: "3", cols: "50" }});
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
            let endEventInput = createElement('input', {id: "endEventInput", className: "e-field form-control", attrs: { name: "endEvent", type: "datetime-local", value: endEvent, required: true }});
            formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.insertBefore(endEventInput, formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild)
            formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.insertBefore(endEventLabel, formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild)

            let secStartDatesDiv = createElement('div', {className: "col-md"});
            formElement.firstChild.firstChild.firstChild.firstChild.insertBefore(secStartDatesDiv, formElement.firstChild.firstChild.firstChild.firstChild.firstChild);
            let thirdStartDatesDiv = createElement('div', {className: "mb-1"});
            formElement.firstChild.firstChild.firstChild.firstChild.firstChild.insertBefore(thirdStartDatesDiv, formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild);
            let startEventLabel = createElement('label', {className: "col-form-label", innerHTML: "From"});
            let startEvent = convertDateToDatapicker(args.data.startEvent);
            let startEventInput = createElement('input', {id: "startEventInput", className: "e-field form-control", attrs: { name: "startEvent", type: "datetime-local", value: startEvent, required: true }});
            formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.insertBefore(startEventInput, formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild)
            formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.insertBefore(startEventLabel, formElement.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild)

            let selectDiv = createElement('div', {className: "mb-1"});
            formElement.firstChild.firstChild.firstChild.insertBefore(selectDiv, formElement.firstChild.firstChild.firstChild.firstChild);
            let selectLabel = createElement('label', {className: "col-form-label", innerHTML: "Trainer"});
            let trainerSelect = createElement('select', {id: "trainerSelect", className: "e-field form-select", attrs: {name: "trainer"}});
            for (let i = trainers.length - 1; i >= 0; i--) {
                let trainerSelectOption = createElement('option', {attrs: {key: i.toString()}, innerHTML: trainers[i]});
                trainerSelect.insertBefore(trainerSelectOption, trainerSelect.firstChild);
            }
            formElement.firstChild.firstChild.firstChild.firstChild.insertBefore(trainerSelect, formElement.firstChild.firstChild.firstChild.firstChild.firstChild);
            formElement.firstChild.firstChild.firstChild.firstChild.insertBefore(selectLabel, formElement.firstChild.firstChild.firstChild.firstChild.firstChild);

            let titleDiv = createElement('div', {className: "mb-1"});
            formElement.firstChild.firstChild.firstChild.insertBefore(titleDiv, formElement.firstChild.firstChild.firstChild.firstChild);
            let titleLabel = createElement('label', {className: "col-form-label", innerHTML: "Title"});
            let titleInput = createElement('input', {id: "titleInput", className: "e-field form-control", attrs: { name: "title", type: "text", required: true }});
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

            console.log(args.data, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        }
    }

    const onPopupClose = (args) => {
        console.log(args, "args.data start onPopupClose");
        if (args.type === 'Editor' && !isNullOrUndefined(args.data)) {
            let titleInputElement = args.element.querySelector('#titleInput');
            if (titleInputElement) {
                args.data.title = titleInputElement.value;
            }
            let trainerSelectElement = args.element.querySelector('#trainerSelect');
            if (trainerSelectElement) {
                args.data.trainer = trainerSelectElement.value;
            }
            let startEventInputElement = args.element.querySelector('#startEventInput');
            if (startEventInputElement) {
                args.data.startEvent = startEventInputElement.value;
            }
            let endEventInputElement = args.element.querySelector('#endEventInput');
            if (endEventInputElement) {
                args.data.endEvent = endEventInputElement.value;
            }
            let descriptionTextAreaElement = args.element.querySelector('#descriptionTextArea');
            if (descriptionTextAreaElement) {
                args.data.description = descriptionTextAreaElement.value;
            }
            args.data.id = events.length === 0 ? 1 : (events[events.length - 1].id + 1);
            console.log(args.data, "args.data koniec onPopupClose");
        }
    }

    // do konwertowania daty, żeby była odpowiednia dla datapickera
    const convertDateToDatapicker = (date) => {
        let currentDate = new Date(date);
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Dodajemy 1, ponieważ miesiące są indeksowane od 0
        let day = String(currentDate.getDate()).padStart(2, '0');
        let hours = String(currentDate.getHours()).padStart(2, '0');
        let minutes = String(currentDate.getMinutes()).padStart(2, '0');

        return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
    }

    const editorTemplate = (props) => {
        console.log(events, "syf");
        console.log(props, "syf props");

        // let startEvent = null;
        // let endEvent = null;
        // if (props.startEvent && props.endEvent) {
        //     startEvent = convertDateToDatapicker(props.startEvent);
        //     endEvent = convertDateToDatapicker(props.endEvent);
        // }

        return ( <div></div>
            // props !== undefined ?
            //     <form>
            //         <fieldset id="fields">
            //             <div className="mb-1">
            //                 <label className="col-form-label">Title</label>
            //                 <input id="titleInput" type="text" className="e-field form-control" data-name="title"/>
            //             </div>
            //             <div className="mb-1">
            //                 <label className="col-form-label">Trainer</label>
            //                 <select id="trainerSelect" className="e-field form-select" data-name="trainer">
            //                     {trainers.map((trainer, i) => (
            //                         <option key={i}>{trainer}</option>
            //                     ))}
            //                 </select>
            //             </div>
            //             <div className="row g-2">
            //                 <div className="col-md">
            //                     <div className="mb-1">
            //                         <label className="col-form-label">From</label>
            //                         <input id="startEventInput" className="e-field form-control" type="datetime-local"
            //                                data-name="startEvent" defaultValue={startEvent}/>
            //                     </div>
            //                 </div>
            //                 <div className="col-md">
            //                     <div className="mb-1">
            //                         <label className="col-form-label">To</label>
            //                         <input id="endEventInput" className="e-field form-control" type="datetime-local"
            //                                data-name="endEvent" defaultValue={endEvent}/>
            //                     </div>
            //                 </div>
            //             </div>
            //             <div className="mb-1">
            //                 <label className="col-form-label">Description</label>
            //                 <textarea id="descriptionTextArea" className="e-field form-control" data-name="description"
            //                           rows={3} cols={50}></textarea>
            //             </div>
            //         </fieldset>
            //     </form>
            //     : <div></div>
        );
    }

//     return (
//         props !== undefined ?
//             <form>
//                 <fieldset>
//                     <div className="mb-1">
//                         <label htmlFor="eventNameInput" className="col-sm-2 col-form-label">Event Name</label>
//                         <div className="col-sm-10">
//                             <input type="text" className="e-field form-control" id="eventNameInput" name="Subject"/>
//                         </div>
//                     </div>
//                     <div className="mb-1">
//                         <label htmlFor="trainerSelect" className="col-sm-2 col-form-label">Trainer</label>
//                         <select id="trainerSelect" className="e-field form-select" placeholder='Choose trainer'
//                                 data-name="TrainerName" value={props.TrainerName || null}>
//                             <option>Trainer 1</option>
//                             <option>Trainer 2</option>
//                             <option>Trainer 3</option>
//                         </select>
//                     </div>
//                     <div className="well">
//                         <div id="datetimepicker1" className="input-append date">
//                             <input data-format="dd/MM/yyyy hh:mm:ss" type="text"></input>
//                             <span className="add-on">
//       <i data-time-icon="icon-time" data-date-icon="icon-calendar">
//       </i>
//     </span>
//                         </div>
//                     </div>
//                     <div className="mb-1">
//                         <label htmlFor="StartTime" className="col-sm-2 col-form-label">From</label>
//                         <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime"
//                                                  value={new Date(props.startTime || props.StartTime)}
//                                                  className="e-field form-select"></DateTimePickerComponent>
//                     </div>
//                     <div className="mb-1">
//                         <label htmlFor="EndTime" className="col-sm-2 col-form-label">To</label>
//                         <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime"
//                                                  value={new Date(props.endTime || props.EndTime)}
//                                                  className="e-field"></DateTimePickerComponent>
//                     </div>
//                 </fieldset>
//             </form>
//             <div>
//
//                 <tr>
//                     <td className="e-textlabel">Status</td>
//                     <td colSpan={4}>
//                         <DropDownListComponent id="EventType" placeholder='Choose status' data-name="EventType"
//                                                className="e-field" dataSource={['New', 'Requested', 'Confirmed']}
//                                                value={props.EventType || null}></DropDownListComponent>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td className="e-textlabel">From</td>
//                     <td colSpan={4}>
//                         <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime"
//                                                  value={new Date(props.startTime || props.StartTime)}
//                                                  className="e-field"></DateTimePickerComponent>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td className="e-textlabel">To</td>
//                     <td colSpan={4}>
//                         <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime"
//                                                  value={new Date(props.endTime || props.EndTime)}
//                                                  className="e-field"></DateTimePickerComponent>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td className="e-textlabel">Reason</td>
//                     <td colSpan={4}>
//                         <textarea id="Description" className="e-field e-input" name="Description" rows={3}
//                                   cols={50}></textarea>
//                     </td>
//                 </tr>
//             </div>
//         :
//     <div></div>
// );

    // return (
    //     props !== undefined ?
    //         <table className="custom-event-editor">
    //             <tbody>
    //             <tr>
    //                 <td className="e-textlabel">Summary</td>
    //                 <td colSpan={4}>
    //                     <input id="Summary" className="e-field e-input" type="text" name="Subject"/>
    //                 </td>
    //             </tr>
    //             <tr>
    //                 <td className="e-textlabel">Status</td>
    //                 <td colSpan={4}>
    //                     <DropDownListComponent id="EventType" placeholder='Choose status' data-name="EventType"
    //                                            className="e-field"
    //                                            dataSource={['New', 'Requested', 'Confirmed']}
    //                                            value={props.EventType || null}></DropDownListComponent>
    //                 </td>
    //             </tr>
    //             <tr>
    //                 <td className="e-textlabel">From</td>
    //                 <td colSpan={4}>
    //                     <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime"
    //                                              value={new Date(props.startTime || props.StartTime)}
    //                                              className="e-field"></DateTimePickerComponent>
    //                 </td>
    //             </tr>
    //             <tr>
    //                 <td className="e-textlabel">To</td>
    //                 <td colSpan={4}>
    //                     <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime"
    //                                              value={new Date(props.endTime || props.EndTime)}
    //                                              className="e-field"></DateTimePickerComponent>
    //                 </td>
    //             </tr>
    //             <tr>
    //                 <td className="e-textlabel">Reason</td>
    //                 <td colSpan={4}>
    //                     <textarea id="Description" className="e-field e-input" name="Description" rows={3} cols={50}></textarea>
    //                 </td>
    //             </tr>
    //             </tbody>
    //         </table>
    //         : <div></div>
    // );

    // const editorTemplate = (props) =>
    //     {
    //     return (
    //         props !== undefined ?
    //             <form>
    //                 <div className="row mb-3">
    //                     <label htmlFor="eventNameInput" className="col-sm-2 col-form-label">Event Name</label>
    //                     <div className="col-sm-10">
    //                         <input type="text" className="form-control" id="eventNameInput" name="Subject"/>
    //                     </div>
    //                 </div>
    //                 <div className="row mb-3">
    //                     <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
    //                     <div className="col-sm-10">
    //                         <input type="password" className="form-control" id="inputPassword3"/>
    //                     </div>
    //                 </div>
    //             </form>
    //             : <div></div>
    //     );
    // };

    return (
        <>
            <br/><br/>
            <NavBar/>
            <ScheduleComponent width='100%' height='800px' selectedDate={new Date(2023, 1, 15)}
                               eventSettings={eventSettings} workHours={workHours}
                               editorTemplate={editorTemplate} popupOpen={onPopupOpen}
                               showQuickInfo={false} popupClose={onPopupClose}
                               actionBegin={onActionBegin}>
                <ViewsDirective>
                    <ViewDirective option='Day'/>
                    <ViewDirective option='Week'/>
                    <ViewDirective option='WorkWeek'/>
                    <ViewDirective option='Month'/>
                    <ViewDirective option='Agenda'/>
                </ViewsDirective>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>
            </ScheduleComponent>
        </>
    );
}

export default CalendarPage;
