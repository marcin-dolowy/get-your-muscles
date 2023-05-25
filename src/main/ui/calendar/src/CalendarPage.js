import {
    ScheduleComponent,
    ViewsDirective,
    ViewDirective,
    Day,
    Week,
    WorkWeek,
    Month,
    Inject, Agenda
} from '@syncfusion/ej2-react-schedule';
import {extend} from '@syncfusion/ej2-base';
import {useParams} from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import NavBar from "./NavBar";
import {useState, useEffect} from "react";
import axios from "axios";

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

    return (
        <>
            <div>
                <NavBar/>
            </div>
            <ScheduleComponent width='100%' selectedDate={new Date(2018, 1, 15)}
                               eventSettings={eventSettings} actionBegin={onActionBegin.bind(this)}>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>
            </ScheduleComponent>
        </>
    );
}

export default CalendarPage;
