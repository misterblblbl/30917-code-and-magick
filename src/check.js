'use strict';

// Проанализировать параметры и вывести соответствующее сообщение-строку
function getMessage(a, b) {
  if (typeof a == 'boolean') {
    if(a) {
      return 'Я попал в ' + b + ' .';
    } else  {
      return 'Я никуда не попал';
    }
  } else if (typeof a == 'number') {
    return 'Я прыгнул на ' + a * 100 + ' сантиметров';
  } else if (typeof a == 'object') {
    if (typeof b == 'object') {
      return 'Я прошёл ' + getArraysProduct(a, b) + ' метров';
    } else {
      return 'Я прошёл ' + getArraySum(a) + ' шагов'
    }
  }
}

// Получить сумму всех элементов массива
function getArraySum(array) {
  var arraySum = 0;
  for (var i = 0; i < array.length; i++) {
    arraySum = arraySum + array[i];
  }
  return arraySum;
}

// Получить сумму прозведений элементов двух массивов
function getArraysProduct(array1, array2) {
  var arraysProduct = 0;
  for (var i = 0; i < array1.length; i++) {
    arraysProduct = arraysProduct + array1[i] * array2[i];
  }
  return arraysProduct;
}
