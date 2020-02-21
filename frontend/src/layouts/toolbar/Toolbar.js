import React from 'react';
import './Toolbar.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class Infobar extends React.Component {
    render(){
       return(
        <AppBar position="static" id="bar">
            <Toolbar>
                <Typography variant="h6" id="title">
                    PixelSmash
                </Typography>
            </Toolbar>
        </AppBar>
       ) ;
    }
}
export default Infobar;