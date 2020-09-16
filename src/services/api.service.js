import { handleResponse } from '../_helpers';

import * as Constant from '../constants/common';

import * as config from '../config.json';

import csc from 'country-state-city';


export const apiservice = {
    getAll,
    getOne,
    create,
    createWithForm,
    updateOne,
    updateOnewithForm,
    deleteOne,
    getAllCountries,
    getStatesOfCountry,
    getCountryNameById,
    getStateNameById,
    getCountryNameByName,
    getStateNameByName,
    updateWithoutID
};

function getAll(url) {
    const Token = localStorage.getItem(Constant.ADMIN_TOKEN);
    const headerConfig = { 'Content-Type':'application/json','Authorization': "Bearer " + `${Token}` }
    const resourceURL = `${config.API_URL}${url}`
    const requestOptions = {
        method: 'GET',
        headers: headerConfig
    };

    return fetch(resourceURL, requestOptions)
        .then(handleResponse)
        .then(val => {            
            return val;
        }).catch(err =>{
            console.log('getAllError:', err);
            return err;
        });
}

function getOne(url, id){
    const Token = localStorage.getItem(Constant.ADMIN_TOKEN);
    const headerConfig = { 'Content-Type':'application/json','Authorization': "Bearer " + `${Token}` }
    const resourceURL = `${config.API_URL}${url}/${id}`
    const requestOptions = {
        method: 'GET',
        headers: headerConfig
    };
    return fetch(resourceURL, requestOptions)
        .then(handleResponse)
        .then(val => {            
            return val;
        }).catch(err =>{
            console.log('getAllError:', err);
            return err;
        });
}

function create(url, bodyRes){
    const Token = localStorage.getItem(Constant.ADMIN_TOKEN);
    const headerConfig = { 'Content-Type':'application/json','Authorization': "Bearer " + `${Token}` }
    const resourceURL = `${config.API_URL}${url}`
    const requestOptions = {
        method: 'POST',
        headers: headerConfig,
        body: bodyRes
    };
    return fetch(resourceURL, requestOptions)
        .then(handleResponse)
        .then(val => {            
            return val;
        }).catch(err =>{
            console.log('getAllError:', err);
            return err;
        });
}

function createWithForm(url, bodyRes){
    const Token = localStorage.getItem(Constant.ADMIN_TOKEN);
    const formHeaderConfig = { 'Authorization': "Bearer " + `${Token}` }
    const resourceURL = `${config.API_URL}${url}`
    const requestOptions = {
        method: 'POST',
        headers: formHeaderConfig,
        body: bodyRes
    };
    return fetch(resourceURL, requestOptions)
        .then(handleResponse)
        .then(val => {            
            return val;
        }).catch(err =>{
            console.log('getAllError:', err);
            return err;
        });
}

function updateOne(url, bodyRes, id){
    const Token = localStorage.getItem(Constant.ADMIN_TOKEN);
    const headerConfig = { 'Content-Type':'application/json','Authorization': "Bearer " + `${Token}` }
    const resourceURL = `${config.API_URL}${url}/${id}`
    const requestOptions = {
        method: 'PUT',
        headers: headerConfig,
        body: bodyRes
    };
    return fetch(resourceURL, requestOptions)
        .then(handleResponse)
        .then(val => {            
            return val;
        }).catch(err =>{
            console.log('getAllError:', err);
            return err;
        });
}

function updateWithoutID(url, bodyRes){
    const Token = localStorage.getItem(Constant.ADMIN_TOKEN);
    const headerConfig = { 'Content-Type':'application/json','Authorization': "Bearer " + `${Token}` }
    const resourceURL = `${config.API_URL}${url}`
    const requestOptions = {
        method: 'PUT',
        headers: headerConfig,
        body: bodyRes
    };
    return fetch(resourceURL, requestOptions)
        .then(handleResponse)
        .then(val => {            
            return val;
        }).catch(err =>{
            console.log('getAllError:', err);
            return err;
        });
}

function updateOnewithForm(url, bodyRes, id){
    const Token = localStorage.getItem(Constant.ADMIN_TOKEN);
    const formHeaderConfig = { 'Authorization': "Bearer " + `${Token}` }
    const resourceURL = `${config.API_URL}${url}/${id}`

    const requestOptions = {
        method: 'PUT',
        headers: formHeaderConfig,
        body: bodyRes
    };
    return fetch(resourceURL, requestOptions)
        .then(handleResponse)
        .then(val => {            
            return val;
        }).catch(err =>{
            console.log('getAllError:', err);
            return err;
        });
}

function deleteOne(url, id){
    const Token = localStorage.getItem(Constant.ADMIN_TOKEN);
    const headerConfig = { 'Content-Type':'application/json','Authorization': "Bearer " + `${Token}` }
    const resourceURL = `${config.API_URL}${url}/${id}`
    const requestOptions = {
        method: 'DELETE',
        headers: headerConfig
    };
    return fetch(resourceURL, requestOptions)
        .then(handleResponse)
        .then(val => {            
            return val;
        }).catch(err =>{
            console.log('getAllError:', err);
            return err;
        });
}

function getAllCountries(){
    const cList = csc.getAllCountries();
    return cList;
}

function getStatesOfCountry(countryId){
    const sList = csc.getStatesOfCountry(countryId);
    return sList;
}

function getCountryNameById(countryId){
    const country = csc.getCountryById(countryId);
    return country.name;
}

function getStateNameById(stateId){
    const state = csc.getStateById(stateId);
    return state.name;
}
function getCountryNameByName(countryName){
    const cList = csc.getAllCountries();
    const courntyJson = cList.find(x => { x = x.name.toLowerCase() === countryName.toLowerCase();return x;})
    return courntyJson;
}

function getStateNameByName(countryId,stateName){
    const sList = csc.getStatesOfCountry(countryId);
    const stateJson = sList.find(x => { x = x.name.toLowerCase() === stateName.toLowerCase();return x;})
    return stateJson;
}
