import  { Redirect } from 'react-router-dom'
import React from 'react';
import { useHistory } from 'react-router-dom';



export default function RedirectIfLoggedOut  (user) {
   // const history = useHistory();
    if(user) {
        console.log('logged');
     //   history.push('/mi-cuenta');
    }else {
        console.log('not logged');
     //history.push('/mi-cuenta');
};

}