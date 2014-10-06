var sewi = sewi || {};

/**
 * Helper function to ensure that a class inherits another class.
 * @param  {function} subClass   Function definition of the sub class.
 * @param  {function} superClass Function definition of the super class.
 */
sewi.inherits = function(subClass, superClass) {
    if (_.isFunction(subClass) && _.isFunction(superClass)) {
        subClass.prototype = _.create(superClass.prototype, {'constructor': subClass});
    } else {
        throw new Error('Only class definitions can inherit other class definitions.');
    }
}

/** Declare all constants in this object. */
sewi.constants = {

};
