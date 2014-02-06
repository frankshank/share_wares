Lists = new Meteor.Collection("Lists");

// crude check to see if the current user is the admin user
function adminUser(userId) {
  var adminUser = Meteor.users.findOne({username:"admin"});
  return (userId && adminUser && (userId === adminUser._id));
}

Lists.allow({
  insert: function(userId, doc){
    return adminUser(userId);
  },
  update: function(userId, docs, fields, modifier){
    return adminUser(userId);
  },
  remove: function (userId, docs){
    return adminUser(userId);
  }
});

