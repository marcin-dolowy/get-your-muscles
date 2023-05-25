import {extend} from '@syncfusion/ej2-base';
import {useParams} from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import NavBar from "./NavBar";
import {useState, useEffect} from "react";
import axios from "axios";
import {
    ScheduleComponent,
    ViewsDirective,
    ViewDirective,
    Day,
    Week,
    WorkWeek,
    Month,
    Agenda,
    Inject
} from '@syncfusion/ej2-react-schedule';
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars';
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns';

const CalendarPage = () => {
    //--- moze sie przyda -> do parametrów w URL-u
    // const params = useParams();
    // const calendarId = params.calendarId;
    // const calend = calendars.find(cal => cal.name === calendarId)
    //
    // if (!calend) {
    //     return <NotFoundPage />
    // }

    //---
    const [calendarReservations, setCalendarReservations] = useState([]);
    useEffect(() => {
        const loadData = async () => {
            const response = await axios.get("/calendar");
            const reservations = response.data;
            let parsedCalendarData = [];
            for (let i = 0; i < reservations.length; i++) {
                let reservation = reservations[i];
                let res = {
                    Id: reservation.id,
                    Subject: reservation.subject,
                    StartTime: new Date(reservation.startTime + 'Z'),
                    EndTime: new Date(reservation.endTime + 'Z'),
                    IsAllDay: reservation.allDay
                };
                parsedCalendarData.push(res);
            }
            setCalendarReservations(parsedCalendarData)
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
    // console.log(calendarReservations, "calendarReservations")


    let data = extend([], calendarReservations, null, true);
    const eventSettings = {dataSource: data}

    function onActionBegin(args) {
        // let weekEnds = [0, 6];
        console.log(args.requestType)

        if (args.requestType === 'eventCreate'/* && weekEnds.indexOf((args.data[0].StartTime).getDay()) >= 0*/) {
            // args.cancel = true;

            console.log("siema sejwa")
        } else if (args.requestType === 'eventRemove'/* && weekEnds.indexOf((args.data[0].StartTime).getDay()) >= 0*/) {
            // args.cancel = true;

            console.log("siema deleta")
        }
    }

    //to remove annotation
    // setTimeout(function () {
    //     document.getRootNode().body.removeChild(document.querySelector("body > div:nth-child(4)"));
    // }, 1500);

    const onPopupOpen = (args) => {
        if (args.type === 'Editor') {
            let statusElement = args.element.querySelector('#EventType');
            if (statusElement) {
                statusElement.setAttribute('name', 'EventType');
            }
        }
    };

    const editorTemplate = (props) => {
        return (
            props !== undefined ?
                <table className="custom-event-editor">
                    <tbody>
                    <tr>
                        <td className="e-textlabel">Summary</td>
                        <td colSpan={4}>
                            <input id="Summary" className="e-field e-input" type="text" name="Subject"/>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Status</td>
                        <td colSpan={4}>
                            <DropDownListComponent id="EventType" placeholder='Choose status' data-name="EventType"
                                                   className="e-field" dataSource={['New', 'Requested', 'Confirmed']}
                                                   value={props.EventType || null}></DropDownListComponent>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">From</td>
                        <td colSpan={4}>
                            <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime"
                                                     value={new Date(props.startTime || props.StartTime)}
                                                     className="e-field"></DateTimePickerComponent>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">To</td>
                        <td colSpan={4}>
                            <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime"
                                                     value={new Date(props.endTime || props.EndTime)}
                                                     className="e-field"></DateTimePickerComponent>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Reason</td>
                        <td colSpan={4}>
                        <textarea id="Description" className="e-field e-input" name="Description" rows={3}
                                  cols={50}></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
                : <div></div>
        );
    };

    // const editorTemplate = (props) => {
    //     return (
    //         props !== undefined ?
    //             <form>
    //                 <div className="row mb-3">
    //                     <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
    //                     <div className="col-sm-10">
    //                         <input type="email" className="form-control" id="inputEmail3"/>
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
            <NavBar/>
            <ScheduleComponent width='100%' height='800px' selectedDate={new Date(2023, 1, 15)}
                               eventSettings={eventSettings} editorTemplate={editorTemplate.bind(this)}
                               showQuickInfo={false} popupOpen={onPopupOpen.bind(this)}>
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
