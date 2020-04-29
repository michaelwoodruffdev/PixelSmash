import React from 'react';
import './Toolbar.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Badge } from '@material-ui/core';

class Infobar extends React.Component {
    render(){
       return(
        <AppBar position="fixed" id="bar">
            <Toolbar>
                <Badge>
                    <img className="image" src='https://www.freelogodesign.org/file/app/client/thumb/bf970f3b-3d14-44fc-b851-5b99674b0139_200x200.png?1581994698035' width="150" height="100" alt='Logo' />
                </Badge>

                {/* <Typography variant="h6" id="title">
                    PixelSmash
                </Typography> */}
            </Toolbar>
        </AppBar>
       ) ;
    }
}
export default Infobar;