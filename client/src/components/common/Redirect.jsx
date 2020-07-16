import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

// const Redirect = (props) => window.location = props.url;


// export default Redirect;
export default function Redirect(props) {
    console.log(props.url);
    window.location = props.url;
    return (
    <div>
        <div>
            <LinearProgress />Loading...
        </div>

    </div>

    );

}