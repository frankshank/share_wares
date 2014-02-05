/**
 * Share wares client code.
 */

// Subscribe to our Categories channel
Meteor.subscribe('Categories');

Meteor.autosubscribe(function() {
  Meteor.subscribe("listdetails", Session.get('current_list'));
});

// Lists the categories
Template.categories.Lists = function () {
  return Lists.find({}, {sort: {Category: 1}});
};

// We are declaring the 'adding_category' flag
Session.set('adding_category', false);

// This returns true if adding_category has been assigned the value true
Template.categories.new_cat = function () {
  return Session.equals('adding_category',true);
};

// React to the relevant events
Template.categories.events({'click #btnNewCat': function (e, t) {
    Session.set('adding_category', true);
    Meteor.flush();
    focusText(t.find("#add-category"));
  },
  'keyup #add-category': function (e, t) {
    if (e.which === 13) {
      var catVal = String(e.target.value || "");
      if (catVal) {
        Lists.insert({Category:catVal});
        Session.set('adding_category', false);
      }
    }
  },
  'focusout #add-category': function (e, t) {
    Session.set('adding_category', false);
  },
  'click .category': selectCategory
});

// The select category function
function selectCategory(e, t) {
  Session.set('current_list', this._id);
}

function addItem(list_id, item_name) {
  if (!item_name && !list_id) return;
  Lists.update({_id: list_id}, {$addToSet: {items: {Name: item_name}}});
}

function removeItem(list_id,item_name) {
  if (!item_name&&!list_id) return;
  Lists.update({_id:list_id}, {$pull: {items: {Name: item_name}}});
}

function updateLendee(list_id,item_name,lendee_name){
  var l = Lists.findOne({"_id":list_id , "items.Name":item_name});
  if (l && l.items) {
    for (var i = 0; i < l.items.length; i++) {
      if (l.items[i].Name === item_name) {
        l.items[i].LentTo = lendee_name;
      }
    }
    Lists.update({"_id":list_id},{$set:{"items":l.items}}); 	
  }
};

// Creates the template for the listing the items
Template.list.items = function () {
  if (Session.equals('current_list', null))
    return null;
  else {
    var cats = Lists.findOne({_id: Session.get('current_list')});
    if (cats && cats.items) {
      for (var i = 0; i < cats.items.length; i++) {
        var d = cats.items[i];
        d.Lendee = d.LentTo ? d.LentTo : "free";
        d.LendClass = d.LentTo ? "label-important" : "label-success";
      }
      return cats.items;
    }
  }
};

// Additional view states for items
Template.list.list_selected = function() {
  return ((Session.get('current_list') != null) && (!Session.equals('current_list', null)));
};

Template.categories.list_status = function() {
  if (Session.equals('current_list', this._id)) {
    return "";
  }
  else {
   return "btn-inverse";
  }
};

Template.list.list_adding = function() {
  return (Session.get('list_adding', true));
}

Template.list.lendee_editing = function() { 	
  return (Session.equals('lendee_input', this.Name));
};

/// event handlers for lists
Template.list.events({'click #btnAddItem': function (e, t) {
    Session.set('list_adding', true);
    Meteor.flush();
    focusText(t.find("#item_to_add"));
  },
  'keyup #item_to_add': function (e, t) {
    if (e.which === 13) {
      addItem(Session.get('current_list'), e.target.value); 	
      Session.set('list_adding',false);
    }
  },
  'focusout #item_to_add': function(e, t) {
    Session.set('list_adding', false);
  },
  'click .delete_item': function(e, t) {
    removeItem(Session.get('current_list'), e.target.id);
  },
  'click .lendee' : function(e, t) {
    Session.set('lendee_input', this.Name); 	
    Meteor.flush();
    focusText(t.find("#edit_lendee"), this.LentTo);
  },
  'keyup #edit_lendee': function (e, t) {
    if (e.which === 13) {
      updateLendee(Session.get('current_list'), this.Name, e.target.value);
      Session.set('lendee_input',null);
    }
    if (e.which === 27) {
      Session.set('lendee_input', null);
    }
  }
});


// Accounts ui admin
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});


///// Generic Helper Functions /////

//this function puts our cursor where it needs to be.
function focusText(i, val) {
  i.focus();
  i.value = val || "";
  i.select();
};

