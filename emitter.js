'use strict';

var START_NUMBER = 0;
var Event = function (name, context, handler) {
    this.name = name;
    this.handler = handler;
    this.context = context;
    this.limit = null;
    this.frequency = 0;
    this.number = 0;
};

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var events = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {object} obj
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);

            if (isEventExists(event, context)) {
                return this;
            }

            addEvent(event, context, handler.bind(context));

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {object} obj
         */
        off: function (event, context) {
            console.info(event, context);
            unsubscribeFromEvent(event, context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {object} obj
         */
        emit: function (event) {
            console.info(event);


            if (isSingleEvent(event)) {
                getEventsByName(event).forEach(callEventHandler);

                return;
            }

            getEventsByName(event).forEach(callEventHandler);

            getEventsByName(event.split('.')[0]).forEach(callEventHandler);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {object} obj
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
            if (!isEventExists(event, context)) {
                addEvent(event, context, handler.bind(context));
            }

            findEventByInfo(event, context).limit = times;
            findEventByInfo(event, context).number = START_NUMBER;

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {object} obj
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
            if (!isEventExists(event, context)) {
                addEvent(event, context, handler.bind(context));
            }

            findEventByInfo(event, context).frequency = frequency;
            findEventByInfo(event, context).number = START_NUMBER;

            return this;
        }
    };

    function isEventExists(eventName, context) {
        return events.some(function (event) {
            return event.name === eventName && event.context === context;
        });
    }

    function addEvent(event, context, handler) {
        events.push(new Event(event, context, handler.bind(context)));
    }

    function unsubscribeFromEvent(event, context) {
        events.splice(events.indexOf(findEventByInfo(event, context)), 1);
    }

    function isSingleEvent(event) {
        return countOfEvents(event) === 1;
    }

    function getEventsByName(eventName) {
        return events.filter(function (event) {
            return event.name === eventName;
        });
    }

    function callEventHandler(event) {
        event.number++;
        if ((!isLimitExists(event) && !isFrequencyExists(event)) ||
            isNumberInLimit(event) || isSuitForFrequency(event)) {
            event.handler();
        }
    }

    function findEventByInfo(eventName, context) {
        return events.find(function (event) {
            return event.name === eventName && event.context === context;
        });
    }

    function countOfEvents(event) {
        return event.split('.').length;
    }

    function isNumberInLimit(event) {
        return event.number <= event.limit;
    }

    function isSuitForFrequency(event) {
        return event.frequency && event.number % event.frequency !== 0;
    }

    function isLimitExists(event) {
        return event.limit;
    }

    function isFrequencyExists(event) {
        return event.frequency;
    }
}

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;
