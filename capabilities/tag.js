

module.exports = function(object) {

    
    
    Object.defineProperty(object, "tag", {
        value: function() {
            
            return this;
        }
    });

};
