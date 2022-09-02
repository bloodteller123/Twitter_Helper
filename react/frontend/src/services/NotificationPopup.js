import React, { useState, useEffect } from "react";
import "../CSS/Notification.scss";



const NotificationPop = ({setShow, title, message}) =>{
    // const [isShow, setShow] = useState(true)

    useEffect(() => {
        const timeId = setTimeout(() => {
            setShow(false)
        }, 2500);

        return ()=>{
            clearTimeout(timeId)
        }
    }, [])

    return (
        <>
                <div className={`noti-container success-container`}>
                    <div>
                        <div className="info-container">
                            {/* <div>
                                <div className={`snackbar-icon success-snackbar-icon`}></div>
                            </div> */}
                            <div>
                                <p className='title'>{title}</p>
                                
                                {/* <p className='message'>{message}</p> */}
                            </div>
                        </div>
                    </div>
                </div> 

        </>
    )
}

export default NotificationPop