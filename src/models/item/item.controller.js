'use strict';
const Items = require('./item.model.js');
const Groups = require('./../group/group.model.js');
const GroupsDetail = require('./../group-detail/groupdetail.model.js');
const Token = require('../../config/token.js');
const jwt = require('../../middleware/jwt.js');
const NOT_FOUND_ERROR = 'Error Not Found - Item can not be found';
var base64Img = require('base64-img');

function get (req, res) {
  console.log('Invoking items[get]');
  return Items.find(
    {
      deleted: false
    },
    {
      image: 0,
      __v: 0
    },
    {
      sort:{ resgisterdate: -1 }
    })
    .then(item => {
      return Groups.populate(item, { path: "groupsprices.group" })
        .then(()=>{
          res.send({ data: item });
        })
        .catch(error=> {
          throw error;
        });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getItemsImages (req, res) {
  console.log('Invoking items[getItemsImages]');
  return Items.find({
    deleted: false
  }, {}, { sort:{ resgisterdate: -1 } })
    .then(item => {
      item = item.map(itemt => {
        /*
        var stringImage = (itemt.filepath) ? base64Img.base64Sync(itemt.filepath) : null;
        itemt = {
          _id: itemt._id,
          name: itemt.name,
          description: itemt.description,
          code: itemt.code,
          kind: itemt.kind,
          unit: itemt.unit,
          // filepath: null,
          resgisterdate: itemt.resgisterdate,
          groupsprices: itemt.groupsprices,
          available: itemt.available,
          deleted: itemt.deleted,
          image: stringImage
        };*/
        return itemt;
      });
      res.send({ data: item });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getById (req, res) {
  console.log('Invoking items[getById]');
  return Items.findById({
    _id: req.params.id,
    deleted: false
  })
    .then(item => {
    return Groups.populate(item, { path: "groupsprices.group" })
        .then((item)=>{
          /*var stringImage = (item.filepath) ? base64Img.base64Sync(item.filepath) : null;//base64Img.base64Sync('public/image/default.png');
          var newItem = {
            _id: item._id,
            name: item.name,
            description: item.description,
            code: item.code,
            kind: item.kind,
            unit: item.unit,
            // filepath: null,
            resgisterdate: item.resgisterdate,
            groupsprices: item.groupsprices,
            available: item.available,
            deleted: item.deleted,
            image: stringImage
          };
          res.send({ data: newItem });*/
          res.send({ data: item });
        })
        .catch(error=> {
          throw error;
        });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getByGroup (req, res) {
  console.log('Invoking items[getByGroup]');
  return Items.find(
    {
      deleted: false,
      groupsprices: {$elemMatch: {group: req.params.id }}
    },
    {
      image: 0,
      __v: 0
    },
    {
      sort:{ resgisterdate: -1 }
    })
    .then(item => {
      item = item.map(itemt => {
        // res.send({ data: item });
        return itemt;
      });
      res.send({ data: item });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getByGroupImages (req, res) {
  console.log('Invoking items[getByGroupImages]');
  return Items.find({
    deleted: false,
    groupsprices: {$elemMatch: {group: req.params.id }}
    },  {
    __v: 0,
    deleted: 0,
    available: 0,
    image: 0,
  }, { sort:{ resgisterdate: -1 } })
    .then(item => {
      /*item = item.map(itemt => {

        var stringImage = (itemt.filepath) ? base64Img.base64Sync(itemt.filepath) : null;//base64Img.base64Sync('public/image/default.png');
        itemt = {
          _id: itemt._id,
          name: itemt.name,
          description: itemt.description,
          code: itemt.code,
          kind: itemt.kind,
          unit: itemt.unit,
          // filepath: null,
          resgisterdate: itemt.resgisterdate,
          groupsprices: itemt.groupsprices,
          available: itemt.available,
          deleted: itemt.deleted,
          image: stringImage
        };
        return itemt;
      });*/
      res.send({ data: item });
    })
    .catch(error => res.status(404).send({ data: error }));
}

class groupDetail {
  constructor(group, item, price){
    this.group = group;
    this.item = item;
    this.price = price;
  }
};

function getItemPrices (req, res) {
  console.log('Invoking items[getItemPrices]');
  return Items.find({
    deleted: false
  }, {}, { sort:{ resgisterdate: -1 } })
    .then(itemList => {
      var pricesList = [];
      itemList.groupsprices.forEach(itemPrice=>{
        pricesList.push(new groupDetail(itemPrice.group, itemList, itemPrice.price));
      });
      res.send({ data: pricesList });
    })
    .catch(error => { res.status(404).send({ data: error }); });
}

function updateAllFilepath (req, res){
  console.log('Invoking items[updateAllFilepath]');
  let newItem = req.body;
  return Items.update({}, { filepath: null }, { multi: true })
    .then(response => {
      res.send({ data: response });
    })
    .catch(error => res.status(404).send({ data: error }))
}

function update (req, res){
  console.log('Invoking items[update]');
  let newItem = req.body;
  return Items.findOneAndUpdate({ _id: req.params.id }, { $set: newItem }, { new: true })
    .then(response => {
      res.send({ data: response });
    })
    .catch(error => res.status(404).send({ data: error }));
  // var imagefile = newItem.image;
  /*base64Img.img(imagefile, 'public/image/', newItem.code
    ,function(err, filepath) {
      if (err) {
        return err;
      }
      if (filepath) {
        newItem.filepath =  filepath;
        return Items.findOneAndUpdate({ _id: req.params.id }, { $set: newItem }, { new: true })
          .then(response => {
            res.send({ data: response });
          })
          .catch(error => res.status(404).send({ data: error }));
      }
    });*/
}

function post (req, res) {
  console.log('Invoking items[post]');
  let groups = req.body.groupsprices;
  let item = req.body;
  item.resgisterdate = new Date();
  return Items.create(item)
    .then(response => {
      res.send({ data: response })
    })
    .catch(error => res.status(404).send({ data: error }));
  // var imagefile = item.image;
  // base64Img.img(imagefile, 'public/image/', item.code
  //   ,function(err, filepath) {
  //     if (err) {
  //       return err;
  //     }
  //     if (filepath) {
  //       item.filepath =  filepath;
  //       return Items.create(item)
  //         .then(response => {
  //           res.send({ data: response })
  //         })
  //         .catch(error => res.status(404).send({ data: error }));
  //     }
  //   })
}

function removeAll (req, res) {
  console.log('Invoking items[removeAll]');
  /*Phisical implementation*/
  return Items.remove({})
    .then(() => res.send({ data: 'Item has been deleted' }))
    .catch(error => res.status(403).send({ data: error }));
}
function remove (request, response) {
  console.log('Invoking items[remove]');
  return Items.findOneAndUpdate({ _id: request.params.id }, { $set: { deleted: true } }, { new: true })
    .then(item => {
      response.send({ data: item });
    })
    .catch(error => response.status(404).send({ data: error }));
}

function getGroupsByItemId (req, res) {
  console.log('Invoking items[getGroupsByItemId]');
  return GroupsDetail.find({
    item: req.params.id,
    deleted: false
  }, {}, { sort:{ resgisterdate: -1 } })
    .then(groupList => {
      Items.populate(groupList, {path: "item"}).
      then(listItems =>
        Groups.populate(listItems, {path: "group"})
          .then(listItems => res.send({ data: listItems }))
      );
    })
    .catch(error => res.status(404).send({ data: error }));
}

module.exports = { post, get, getById, getByGroup, getByGroupImages, update, updateAllFilepath, remove, getGroupsByItemId, getItemPrices, removeAll, getItemsImages };
