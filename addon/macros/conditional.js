import Ember from 'ember';
import {getVal, getDependentPropertyKeys} from '../utils';

/**
   Conditional computed property

   Example:
   ```js
    var Person = Ember.Object.extend({
      canDrink: EmberCPM.Macros.conditional(Ember.computed.gte('age', 21), 'yes', 'no')
    });
    var boy = Person.create({age: 15});

    boy.get('canDrink') // 'no'
  ```
  @method conditions
  @for macros
  @param {String|ComputedProperty} Dependent key or CP with truthy/falsy value.
  @param {Number|String|ComputedProperty} Positive value, key or CP. Used if the first params is truthy
  @param {Number|String|ComputedProperty} Negative value, key or CP. Used if the first params is falsy
  @return the second or third parameter.
 */
export default function EmberCPM_conditional(condition, positive, negative) {
  var propertyArguments = getDependentPropertyKeys([condition, positive, negative]);
  var isConditionComputed = Ember.Descriptor === condition.constructor;

  propertyArguments.push(function(/* key, value, oldValue */) {
    var conditionEvaluation = isConditionComputed ? condition.func.apply(this, arguments) : this.get(condition);
    return conditionEvaluation ? getVal.call(this, positive) : getVal.call(this, negative);
  });

  return Ember.computed.apply(this, propertyArguments);
}
