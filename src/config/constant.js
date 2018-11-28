// var d = moment.tz(new Date(), "America/New_York");
// var dy = moment.tz(new Date(), "America/La_Paz");
// console.log(d.format(), '<----AAA');
// console.log(dy.format(), '<----AAA1');
//const TIME_ZONE = 'America/La_Paz';
const TIME_ZONE = 'America/New_York';
/*Order Status*/
const ORDER_PENDING = 1;
const ORDER_APROVED = 2;
const ORDER_CANCELED = 3;
const ORDER_DELIVERED = 4;

// const ONESIGNAL_APP_ID = '7972755b-b8ff-4361-9662-adf642eca268';//LOCALHOST
const ONESIGNAL_APP_ID = '5b757a89-d24b-450e-a39c-b3a07e045099';//ZELADA APP1

// const REST_API_KEY = 'OTdjYWI1OTQtNGI2OS00ZGY4LWEzN2MtMWU2NmEwMzEyMDBj';//LOCALHOST
const REST_API_KEY = 'YjJlYTMxZTAtNzAwOC00MjEyLThkM2ItODc0YWIxMWY3ZDdm';//ZELADA APP1

const statusListOrder = [
  { id: ORDER_PENDING, text: 'Pendiente' },
  { id: ORDER_APROVED, text: 'Aprobado' },
  { id: ORDER_CANCELED, text: 'Anulado' },
  { id: ORDER_DELIVERED, text: 'Entregado' }
];

// const URL_STATUS_ORDER_REDIRECT = "http://localhost:3000/#/pedidos";
const URL_STATUS_ORDER_REDIRECT = "https://zeladabakery.firebaseapp.com/#/pedidos";

module.exports = { TIME_ZONE, ORDER_PENDING, ORDER_APROVED, ORDER_CANCELED, ORDER_DELIVERED, statusListOrder, ONESIGNAL_APP_ID, REST_API_KEY, URL_STATUS_ORDER_REDIRECT };