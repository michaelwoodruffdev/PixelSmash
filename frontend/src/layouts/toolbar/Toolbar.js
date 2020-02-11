import React from 'react';
import './Toolbar.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class Infobar extends React.Component {
    render(){
       return(
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">
                    Title
                </Typography>
            </Toolbar>
        </AppBar>
       ) ;
    }
}
export default Infobar;