// TODO support path like
//
//
//  /blog
//  /blog/*
//  /blog/**
//  /blog/**/*
//  /user/settings/password
//  /user/blog/*  --> /user/blog/1, /user/blog/2, /user/blog/100
//    /user:id




//TODO replace module with widget or component, So that people will not confuse that this is not a requirejs thing..

(function() {
  "use strict";
  choona.Router = choona.View.extend({
    initialize: function() {
      choona.View.apply(this, arguments);
      this.router = [];
      var self = this;
      choona.Util.for(this.config.routes, function(module, path) {
        self.router.push({
          path: path,
          callback: function() {
            self.removeSubView("router");
            self.loadSubView({
              id: "router",
              module: module
            });
          }
        });
      });


      //TODO - there should be mode for speficify that we want to load all modules on same place with ending previous module
      //TODO OR you want to hide module !

      this.onDocumentClick = function(e) {
        var path = e.target.getAttribute("href");
        var x = self.loadPath(path, false);
        if (x === false) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      };
      this.onPopstate = function(e) {
        var path = document.location.pathname;
        self.loadPath(path, true);
      };

      document.addEventListener("click", this.onDocumentClick, false);
      window.addEventListener("popstate", this.onPopstate, false);
    },
    template: "<router id='router'></router>",
    loadPath: function(path, back) {

      //TODO Router API in sandbox, need match function !
      //https://github.com/PaulKinlan/leviroutes/blob/master/routes.js
      //https://github.com/olivernn/davis.js/blob/master/davis.js
      // https://github.com/haithembelhaj/RouterJs/blob/master/Router.js
      //https://github.com/flatiron/director/blob/master/lib/director/browser.js
      //todo TODOAPP USING CHOONA.rOUTER

      //TODO - we need to add test cases !!

      var self = this;
      var pathMatched = false;
      this.router.map(function(v, i) {
        if (v.path === path) {
          pathMatched = true;
          if (back === false) {
            history.pushState({}, "", path);
          }
          var x = true;
          if (typeof self.config.before === "function") {
            x = self.config.before(path);
          }
          if (x === true) {
            v.callback();
          }
        }
      });
      return !pathMatched;
    },
    end: function() {
      document.removeEventListener("click", this.onDocumentClick);
      window.removeEventListener("popstate", this.onPopstate);
      delete this.onDocumentClick;
      delete this.onPopstate;
    }
  });
})();
