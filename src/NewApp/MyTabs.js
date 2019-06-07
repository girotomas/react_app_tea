import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import HelpIcon from '@material-ui/icons/Help';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import Typography from '@material-ui/core/Typography';
import {BrowserRouter as Router} from 'react-router-dom'
import { withRouter } from 'react-router-dom'



function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

function Baseline(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  var tabs=['call', 'love', 'person']
  function handleChange(event, newValue) {
    setValue(newValue);
    props.history.push('/'+tabs[newValue])
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color='white'>
        <Tabs value={value} onChange={handleChange} variant="fullWidth" scrollButtons="off">
          <Tab icon={<PhoneIcon />} aria-label="Phone" />
          <Tab icon={<FavoriteIcon />} aria-label="Favorite" />
          <Tab icon={<PersonPinIcon />} aria-label="Person" />
          
        </Tabs>
      </AppBar>
    </div>
  );
}


export default withRouter(Baseline);