import  { Redirect } from 'react-router-dom'
import React from 'react';
import { useHistory } from 'react-router-dom';



export default function redirectIfLoggedOut(user) {
    //const history = useHistory();
    if(user) {
        console.log('logged');
      //  history.push('/mi-cuenta');
    }else {
        console.log('not logged');
    //return history.push('/mi-cuenta');
};

}