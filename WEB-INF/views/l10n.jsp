<%@ page language="java" contentType="application/javascript; charset=utf8" pageEncoding="utf8"%>

var dictionary = ${dictionary};

function postProcess(value) {
    if (!value) {
        value = '';
    }
    return value;
}

function translate(key, withoutPostProcess) {
    var result = key;

    if (hasTranslation(key)) {
        result = dictionary[key];
    }

    if (!withoutPostProcess) {
        result = postProcess(result);
    }

    return result;
}

function hasTranslation(key) {
    return dictionary[key]!== undefined;
}