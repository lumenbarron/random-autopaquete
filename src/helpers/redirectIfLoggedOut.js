import  { Redirect } from 'react-router-dom'
import React from 'react';

export default function redirectIfLoggedOut(user) {
    if(user) {
        console.log('logged');
        return <Redirect to='/mi-cuenta'  />
    }else {
        console.log('not logged');
    return <Redirect to='/'  />
    }
};
