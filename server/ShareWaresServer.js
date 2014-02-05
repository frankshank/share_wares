/**
 * Share wares server code
 */
Meteor.startup(function () {
  // code to run on server at startup
});

Meteor.publish("Categories", function(category_id) {
  return Lists.find({}, {fields: {Category: 1}});
});

Meteor.publish("listdetails", function(category_id) {
  return Lists.find({_id: category_id});
});

