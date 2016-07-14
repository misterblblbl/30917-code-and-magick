/******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};

  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {

    /******/ 		// Check if module is in cache
    /******/ 		if(installedModules[moduleId])
    /******/ 			return installedModules[moduleId].exports;

    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = installedModules[moduleId] = {
      /******/ 			exports: {},
      /******/ 			id: moduleId,
      /******/ 			loaded: false
      /******/ 		};

    /******/ 		// Execute the module function
    /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    /******/ 		// Flag the module as loaded
    /******/ 		module.loaded = true;

    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}


  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;

  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;

  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";

  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(0);
  /******/ })
/************************************************************************/
/******/ ([
  /* 0 */
  /***/ function(module, exports, __webpack_require__) {

    'use strict';

    __webpack_require__(1);
    __webpack_require__(5);
    __webpack_require__(3);
    __webpack_require__(6);
    __webpack_require__(10);
    __webpack_require__(7);
    __webpack_require__(9);
    __webpack_require__(11);
    __webpack_require__(12);


    /***/ },
  /* 1 */
  /***/ function(module, exports, __webpack_require__) {

    'use strict';

    var Utils = __webpack_require__(2);
    var Const = __webpack_require__(3);
    var browserCookies = __webpack_require__(4);

    /** @type {HTMLElement} */
    var formContainer = document.querySelector('.overlay-container');

    /** @type {HTMLElement} */
    var formOpenButton = document.querySelector('.reviews-controls-new');

    /** @type {HTMLElement} */
    var formCloseButton = document.querySelector('.review-form-close');

    /** @type {HTMLElement} */
    var form = document.querySelector('.review-form');

    /** @type {HTMLElement} */
    var reviewLinks = document.querySelector('.review-fields');

    /** @type {HTMLElement} */
    var reviewLinksText = document.querySelector('.review-fields-text');

    /** @type {HTMLElement} */
    var reviewLinksName = document.querySelector('.review-fields-name');

    /** @type {HTMLElement} */
    var nameField = document.querySelector('#review-name');

    /** @type {HTMLElement} */
    var reviewField = document.querySelector('#review-text');

    /** @type {HTMLElement} */
    var formSubmitButton = document.querySelector('.review-submit');

    /** @type {HTMLElement} */
    var ratingForm = document.querySelector('.review-form-group-mark');

    /** @type {boolean} */
    var isLowRating;

    /** @type {Date} */
    var now = new Date();

    /**
     * Проверка рейтинга, если рейтинг отрицательный, то значение переменной isLowRating устанавливается в true
     * */
    var checkRating = function() {
      for(var i = 0; i < ratingForm.elements.length; i++) {
        if(i < Const.MIN_RATING && ratingForm.elements[i].checked) {
          isLowRating = true;
          reviewField.required = true;
          break;
        } else if (i >= Const.MIN_RATING && ratingForm.elements[i].checked) {
          isLowRating = false;
          reviewField.required = false;
        }
      }
    };

    /**
     * Проверка поля, если поле заполнено, то возврщается true
     * @param {HTMLElement} field
     * @return {boolean}
     * */
    var checkField = function(field) {
      return field.value !== '';
    };

    /**
     * Получить количество дней, прошедшее с последнего дня рождения
     * @return {number}
     * */
    var getExpirationDate = function() {
      var myLastBirthday;
      if(now < new Date(now.getFullYear(), Const.MY_BIRTHDAY_DATE.month, Const.MY_BIRTHDAY_DATE.day)) {
        myLastBirthday = new Date(now.getFullYear() - 1, Const.MY_BIRTHDAY_DATE.month, Const.MY_BIRTHDAY_DATE.day);
      } else {
        myLastBirthday = new Date(now.getFullYear() - 1, Const.MY_BIRTHDAY_DATE.month, Const.MY_BIRTHDAY_DATE.day);
      }
      return Math.ceil((now - myLastBirthday) / Const.DAYS_IN_MILISECONDS);
    };

    /**
     * Получить из cookies предыдущий отзыв и имя
     * */
    var getPreviousReview = function() {
      nameField.value = browserCookies.get('userName');
      reviewField.value = browserCookies.get('reviewText');
    };

    /**
     * Поле "Имя" всегда обязательное
     * */
    nameField.required = true;
    reviewField.required = isLowRating && !(reviewField.value);
    formSubmitButton.disabled = true;

    /**
     * При изменении рейтинга, проверяем, не установлен ли он в значение меньше 3
     * @param {Event} evt
     * */
    ratingForm.onchange = function(evt) {
      evt.preventDefault();
      checkRating();
      reviewLinksText.classList.toggle('invisible', !isLowRating);
    };

    /**
     * Проверить валидность всех полей формы
     * */
    var checkFormValidity = function() {
      //Проверить рейтинг
      checkRating();

      //Если рейтинг низкий, то проверить заполнено ли поле Имя и Отзыв
      //Если рейтинг высокий, то проверить только Имя

      if(isLowRating) {
        reviewLinksText.classList.toggle('invisible', checkField(reviewField));
        reviewLinksName.classList.toggle('invisible', checkField(nameField));
        reviewLinks.classList.toggle('invisible', checkField(nameField) && checkField(reviewField));

        formSubmitButton.disabled = !(checkField(nameField) && checkField(reviewField));
      } else {
        reviewField.required = isLowRating;
        reviewLinks.classList.toggle('invisible', checkField(nameField));

        formSubmitButton.disabled = !checkField(nameField);
      }
    };

    form.oninput = function() {
      checkFormValidity();
    };

    /**
     * Сохранить введенные данные в cookies при отправке формы
     * */
    form.onsubmit = function() {
      browserCookies.set('userName', nameField.value, {expires: getExpirationDate()});
      browserCookies.set('reviewText', reviewField.value, {expires: getExpirationDate()});
    };

    /**
     * Сделать видимым блок с формой
     * @param {Event} evt
     * */
    formOpenButton.onclick = function(evt) {
      evt.preventDefault();
      formContainer.classList.remove('invisible');
      Utils.removeBodyScroll();
    };

    /**
     * Сделать невидимым блок с формой
     * @param {Event} evt
     * */
    formCloseButton.onclick = function(evt) {
      evt.preventDefault();
      formContainer.classList.add('invisible');
      Utils.returnBodyScroll();
    };

    /**
     * Сделать невидимой форму при нажатии ESC
     * @param {Event} evt
     * */
    window.addEventListener('keydown', function(evt) {
      if(evt.keyCode === Const.Keycodes.ESC) {
        evt.preventDefault();
        formContainer.classList.add('invisible');
        Utils.returnBodyScroll();
      }
    });

    /**
     * Как только документ загружен — получить данные из cookies и добавить в форму
     * */
    window.addEventListener('load', function() {
      getPreviousReview();
      checkFormValidity();
    });


    /***/ },
  /* 2 */
  /***/ function(module, exports) {

    'use strict';

    var Utils = {
      /**
       * Очистить хэш страницы
       */
      clearHash: function() {
        window.location.hash = '';
      },

      /**
       * Проверка хэша на соответсвие регулярному выражению
       * @param {regExp} regExp
       * @return {string|boolean}
       */
      checkHash: function(regExp) {
        var matchedHash = location.hash.match(regExp);
        if (Array.isArray(matchedHash)) {
          return matchedHash[1];
        } else {
          return false;
        }
      },

      /**
       * При поялении попапа убратб скролл с body для избежания двойного скролла
       */
      removeBodyScroll: function() {
        document.body.classList.add('non-scrollable');
      },

      /**
       * Вернуть скролл body
       */
      returnBodyScroll: function() {
        document.body.classList.remove('non-scrollable');
      }
    };

    module.exports = Utils;


    /***/ },
  /* 3 */
  /***/ function(module, exports) {

    'use strict';

    /**
     * Объект со всеми используемыми константами
     * @enum {Object|number|string} */

    var Const = {
      Keycodes: {
        ESC: 27,
        LEFT: 37,
        RIGHT: 39
      },

      IMAGE_LOAD_TIMEOUT: 10000,

      PAGE_SIZE: 3,

      REVIEWS_LOAD_URL: 'https://o0.github.io/assets/json/reviews.json',

      GALLERY_REG_EXP: /#photo\/(\S+)/,

      MIN_RATING: 3,

      MY_BIRTHDAY_DATE: {
        day: 9,
        month: 5
      },

      DAYS_IN_MILISECONDS: 1000 * 60 * 60 * 24
    };

    module.exports = Const;


    /***/ },
  /* 4 */
  /***/ function(module, exports) {

    exports.defaults = {};

    exports.set = function(name, value, options) {
      // Retrieve options and defaults
      var opts = options || {};
      var defaults = exports.defaults;

      // Apply default value for unspecified options
      var expires  = opts.expires || defaults.expires;
      var domain   = opts.domain  || defaults.domain;
      var path     = opts.path     != undefined ? opts.path     : (defaults.path != undefined ? defaults.path : '/');
      var secure   = opts.secure   != undefined ? opts.secure   : defaults.secure;
      var httponly = opts.httponly != undefined ? opts.httponly : defaults.httponly;

      // Determine cookie expiration date
      // If succesful the result will be a valid Date, otherwise it will be an invalid Date or false(ish)
      var expDate = expires ? new Date(
        // in case expires is an integer, it should specify the number of days till the cookie expires
        typeof expires == 'number' ? new Date().getTime() + (expires * 864e5) :
          // else expires should be either a Date object or in a format recognized by Date.parse()
          expires
      ) : '';

      // Set cookie
      document.cookie = name.replace(/[^+#$&^`|]/g, encodeURIComponent)                // Encode cookie name
          .replace('(', '%28')
          .replace(')', '%29') +
        '=' + value.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +                  // Encode cookie value (RFC6265)
        (expDate && expDate.getTime() >= 0 ? ';expires=' + expDate.toUTCString() : '') + // Add expiration date
        (domain   ? ';domain=' + domain : '') +                                          // Add domain
        (path     ? ';path='   + path   : '') +                                          // Add path
        (secure   ? ';secure'           : '') +                                          // Add secure option
        (httponly ? ';httponly'         : '');                                           // Add httponly option
    };

    exports.get = function(name) {
      var cookies = document.cookie.split(';');

      // Iterate all cookies
      for(var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var cookieLength = cookie.length;

        // Determine separator index ("name=value")
        var separatorIndex = cookie.indexOf('=');

        // IE<11 emits the equal sign when the cookie value is empty
        separatorIndex = separatorIndex < 0 ? cookieLength : separatorIndex;

        // Decode the cookie name and remove any leading/trailing spaces, then compare to the requested cookie name
        if (decodeURIComponent(cookie.substring(0, separatorIndex).replace(/^\s+|\s+$/g, '')) == name) {
          return decodeURIComponent(cookie.substring(separatorIndex + 1, cookieLength));
        }
      }

      return null;
    };

    exports.erase = function(name, options) {
      exports.set(name, '', {
        expires:  -1,
        domain:   options && options.domain,
        path:     options && options.path,
        secure:   0,
        httponly: 0}
      );
    };


    /***/ },
  /* 5 */
  /***/ function(module, exports) {

    'use strict';

    (function() {
      /**
       * @const
       * @type {number}
       */
      var HEIGHT = 300;

      /**
       * @const
       * @type {number}
       */
      var WIDTH = 700;

      /**
       * ID уровней.
       * @enum {number}
       */
      var Level = {
        'INTRO': 0,
        'MOVE_LEFT': 1,
        'MOVE_RIGHT': 2,
        'LEVITATE': 3,
        'HIT_THE_MARK': 4
      };

      /**
       * Порядок прохождения уровней.
       * @type {Array.<Level>}
       */
      var LevelSequence = [
        Level.INTRO
      ];

      /**
       * Начальный уровень.
       * @type {Level}
       */
      var INITIAL_LEVEL = LevelSequence[0];

      /**
       * Допустимые виды объектов на карте.
       * @enum {number}
       */
      var ObjectType = {
        'ME': 0,
        'FIREBALL': 1
      };

      /**
       * Допустимые состояния объектов.
       * @enum {number}
       */
      var ObjectState = {
        'OK': 0,
        'DISPOSED': 1
      };

      /**
       * Коды направлений.
       * @enum {number}
       */
      var Direction = {
        NULL: 0,
        LEFT: 1,
        RIGHT: 2,
        UP: 4,
        DOWN: 8
      };

      /**
       * Правила перерисовки объектов в зависимости от состояния игры.
       * @type {Object.<ObjectType, function(Object, Object, number): Object>}
       */
      var ObjectsBehaviour = {};

      /**
       * Обновление движения мага. Движение мага зависит от нажатых в данный момент
       * стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
       * На движение мага влияет его пересечение с препятствиями.
       * @param {Object} object
       * @param {Object} state
       * @param {number} timeframe
       */
      ObjectsBehaviour[ObjectType.ME] = function(object, state, timeframe) {
        // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
        // в воздухе на определенной высоте.
        // NB! Сложность заключается в том, что поведение описано в координатах
        // канваса, а не координатах, относительно нижней границы игры.
        if (state.keysPressed.UP && object.y > 0) {
          object.direction = object.direction & ~Direction.DOWN;
          object.direction = object.direction | Direction.UP;
          object.y -= object.speed * timeframe * 2;

          if (object.y < 0) {
            object.y = 0;
          }
        }

        // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
        // опускается на землю.
        if (!state.keysPressed.UP) {
          if (object.y < HEIGHT - object.height) {
            object.direction = object.direction & ~Direction.UP;
            object.direction = object.direction | Direction.DOWN;
            object.y += object.speed * timeframe / 3;
          } else {
            object.Direction = object.direction & ~Direction.DOWN;
          }
        }

        // Если зажата стрелка влево, маг перемещается влево.
        if (state.keysPressed.LEFT) {
          object.direction = object.direction & ~Direction.RIGHT;
          object.direction = object.direction | Direction.LEFT;
          object.x -= object.speed * timeframe;
        }

        // Если зажата стрелка вправо, маг перемещается вправо.
        if (state.keysPressed.RIGHT) {
          object.direction = object.direction & ~Direction.LEFT;
          object.direction = object.direction | Direction.RIGHT;
          object.x += object.speed * timeframe;
        }

        // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
        if (object.y < 0) {
          object.y = 0;
          object.Direction = object.direction & ~Direction.DOWN;
          object.Direction = object.direction & ~Direction.UP;
        }

        if (object.y > HEIGHT - object.height) {
          object.y = HEIGHT - object.height;
          object.Direction = object.direction & ~Direction.DOWN;
          object.Direction = object.direction & ~Direction.UP;
        }

        if (object.x < 0) {
          object.x = 0;
        }

        if (object.x > WIDTH - object.width) {
          object.x = WIDTH - object.width;
        }
      };

      /**
       * Обновление движения файрбола. Файрбол выпускается в определенном направлении
       * и после этого неуправляемо движется по прямой в заданном направлении. Если
       * он пролетает весь экран насквозь, он исчезает.
       * @param {Object} object
       * @param {Object} state
       * @param {number} timeframe
       */
      ObjectsBehaviour[ObjectType.FIREBALL] = function(object, state, timeframe) {
        if (object.direction & Direction.LEFT) {
          object.x -= object.speed * timeframe;
        }

        if (object.direction & Direction.RIGHT) {
          object.x += object.speed * timeframe;
        }

        if (object.x < 0 || object.x > WIDTH) {
          object.state = ObjectState.DISPOSED;
        }
      };

      /**
       * ID возможных ответов функций, проверяющих успех прохождения уровня.
       * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
       * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
       * нужно прервать.
       * @enum {number}
       */
      var Verdict = {
        'CONTINUE': 0,
        'WIN': 1,
        'FAIL': 2,
        'PAUSE': 3,
        'INTRO': 4
      };

      /**
       * Правила завершения уровня. Ключами служат ID уровней, значениями функции
       * принимающие на вход состояние уровня и возвращающие true, если раунд
       * можно завершать или false если нет.
       * @type {Object.<Level, function(Object):boolean>}
       */
      var LevelsRules = {};

      /**
       * Уровень считается пройденным, если был выпущен файлболл и он улетел
       * за экран.
       * @param {Object} state
       * @return {Verdict}
       */
      LevelsRules[Level.INTRO] = function(state) {
        var fireballs = state.garbage.filter(function(object) {
          return object.type === ObjectType.FIREBALL;
        });

        return fireballs.length ? Verdict.WIN : Verdict.CONTINUE;
      };

      /**
       * Начальные условия для уровней.
       * @enum {Object.<Level, function>}
       */
      var LevelsInitialize = {};

      /**
       * Первый уровень.
       * @param {Object} state
       * @return {Object}
       */
      LevelsInitialize[Level.INTRO] = function(state) {
        state.objects.push(
          // Установка персонажа в начальное положение. Он стоит в крайнем левом
          // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
          // уровне равна 2px за кадр.
          {
            direction: Direction.RIGHT,
            height: 84,
            speed: 2,
            sprite: 'img/wizard.gif',
            spriteReversed: 'img/wizard-reversed.gif',
            state: ObjectState.OK,
            type: ObjectType.ME,
            width: 61,
            x: WIDTH / 3,
            y: HEIGHT - 100
          }
        );

        return state;
      };

      /**
       * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
       * и показывает приветственный экран.
       * @param {Element} container
       * @constructor
       */
      var Game = function(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');

        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._pauseListener = this._pauseListener.bind(this);
      };

      Game.prototype = {
        /**
         * Текущий уровень игры.
         * @type {Level}
         */
        level: INITIAL_LEVEL,

        /**
         * Состояние игры. Описывает местоположение всех объектов на игровой карте
         * и время проведенное на уровне и в игре.
         * @return {Object}
         */
        getInitialState: function() {
          return {
            // Статус игры. Если CONTINUE, то игра продолжается.
            currentStatus: Verdict.CONTINUE,

            // Объекты, удаленные на последнем кадре.
            garbage: [],

            // Время с момента отрисовки предыдущего кадра.
            lastUpdated: null,

            // Состояние нажатых клавиш.
            keysPressed: {
              ESC: false,
              LEFT: false,
              RIGHT: false,
              SPACE: false,
              UP: false
            },

            // Время начала прохождения уровня.
            levelStartTime: null,

            // Все объекты на карте.
            objects: [],

            // Время начала прохождения игры.
            startTime: null
          };
        },

        /**
         * Начальные проверки и запуск текущего уровня.
         * @param {Level=} level
         * @param {boolean=} restart
         */
        initializeLevelAndStart: function(level, restart) {
          level = typeof level === 'undefined' ? this.level : level;
          restart = typeof restart === 'undefined' ? true : restart;

          if (restart || !this.state) {
            // При перезапуске уровня, происходит полная перезапись состояния
            // игры из изначального состояния.
            this.state = this.getInitialState();
            this.state = LevelsInitialize[this.level](this.state);
          } else {
            // При продолжении уровня состояние сохраняется, кроме записи о том,
            // что состояние уровня изменилось с паузы на продолжение игры.
            this.state.currentStatus = Verdict.CONTINUE;
          }

          // Запись времени начала игры и времени начала уровня.
          this.state.levelStartTime = Date.now();
          if (!this.state.startTime) {
            this.state.startTime = this.state.levelStartTime;
          }

          this._preloadImagesForLevel(function() {
            // Предварительная отрисовка игрового экрана.
            this.render();

            // Установка обработчиков событий.
            this._initializeGameListeners();

            // Запуск игрового цикла.
            this.update();
          }.bind(this));
        },

        /**
         * Временная остановка игры.
         * @param {Verdict=} verdict
         */
        pauseLevel: function(verdict) {
          if (verdict) {
            this.state.currentStatus = verdict;
          }

          this.state.keysPressed.ESC = false;
          this.state.lastUpdated = null;

          this._removeGameListeners();
          window.addEventListener('keydown', this._pauseListener);

          this._drawPauseScreen();
        },

        /**
         * Обработчик событий клавиатуры во время паузы.
         * @param {KeyboardsEvent} evt
         * @private
         * @private
         */
        _pauseListener: function(evt) {
          if (evt.keyCode === 32) {
            evt.preventDefault();
            var needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
              this.state.currentStatus === Verdict.FAIL;
            this.initializeLevelAndStart(this.level, needToRestartTheGame);

            window.removeEventListener('keydown', this._pauseListener);
          }
        },

        /**
         * Отрисовка экрана паузы.
         */
        _drawPauseScreen: function() {

          /**
           * Отрисовка окна длиной width и высторой height, в которое будет выводиться сообщение.
           */
          var drawMessageWindow = function(ctx, width, coordinateX, coordinateY, messageText) {
            ctx.font = '16px PT Mono';
            var fontSize = parseInt(ctx.font, 10);
            var messageArr = calculateLines(messageText, fontSize, width * 0.85);
            var height = fontSize * 1.5 + fontSize * 2 * messageArr.length;

            var shadowOffset = 10;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.beginPath();
            ctx.moveTo(coordinateX, coordinateY);
            ctx.lineTo(coordinateX + width, coordinateY);
            ctx.lineTo(coordinateX + width, coordinateY + height);
            ctx.lineTo(coordinateX - 25, coordinateY + height * 1.4);
            ctx.lineTo(coordinateX, coordinateY);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(coordinateX - shadowOffset, coordinateY - shadowOffset);
            ctx.lineTo(coordinateX - shadowOffset + width, coordinateY - shadowOffset);
            ctx.lineTo(coordinateX - shadowOffset + width, coordinateY - shadowOffset + height);
            ctx.lineTo(coordinateX - 25 - shadowOffset, coordinateY - shadowOffset + height * 1.4);
            ctx.lineTo(coordinateX - shadowOffset, coordinateY - shadowOffset);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = 'black';
            messageArr.forEach(function(line, lineNumber) {
              ctx.fillText(line, coordinateX, coordinateY + 20 + lineNumber * 32);
            });
          };

          var calculateLines = function(message, fontSize, width) {
            var letterWidth = fontSize / 2;
            var lettersInLine = Math.floor(width / letterWidth);
            var endOfLine = 0;
            var beginningOfLine = 0;
            var splittedMessage = [];

            for (var lineNumber = 0; lineNumber <= Math.ceil(message.length / lettersInLine); lineNumber++) {
              if(message.length - endOfLine > lettersInLine) {
                endOfLine = message.slice(0, beginningOfLine + lettersInLine).lastIndexOf(' ') + 1;
                splittedMessage.push(message.slice(beginningOfLine, endOfLine));
                beginningOfLine = endOfLine;
              } else {
                splittedMessage.push(message.slice(endOfLine, message.length));
                break;
              }
            }
            return splittedMessage;
          };

          switch (this.state.currentStatus) {
            case Verdict.WIN:
              drawMessageWindow(this.ctx,
                this.canvas.width * 0.4,
                this.canvas.width / 2, this.canvas.height * 0.1,
                'Поздравляю! Вы победили!');
              break;
            case Verdict.FAIL:
              drawMessageWindow(this.ctx,
                this.canvas.width * 0.4,
                this.canvas.width / 2, this.canvas.height * 0.1,
                'Ой :-( Вы проиграли. Нажмите пробел, чтобы попробовать ещё раз.');
              break;
            case Verdict.PAUSE:
              drawMessageWindow(this.ctx,
                this.canvas.width * 0.4,
                this.canvas.width / 2, this.canvas.height * 0.1,
                'Игра на паузе');
              break;
            case Verdict.INTRO:
              drawMessageWindow(this.ctx,
                this.canvas.width * 0.4,
                this.canvas.width / 2, this.canvas.height * 0.1,
                'Добро пожаловать в «Код и магию»! Нажмите пробел, чтобы начать игру.');
              break;
          }
        },

        /**
         * Предзагрузка необходимых изображений для уровня.
         * @param {function} callback
         * @private
         */
        _preloadImagesForLevel: function(callback) {
          if (typeof this._imagesArePreloaded === 'undefined') {
            this._imagesArePreloaded = [];
          }

          if (this._imagesArePreloaded[this.level]) {
            callback();
            return;
          }

          var levelImages = [];
          this.state.objects.forEach(function(object) {
            levelImages.push(object.sprite);

            if (object.spriteReversed) {
              levelImages.push(object.spriteReversed);
            }
          });

          var i = levelImages.length;
          var imagesToGo = levelImages.length;

          while (i-- > 0) {
            var image = new Image();
            image.src = levelImages[i];
            image.onload = function() {
              if (--imagesToGo === 0) {
                this._imagesArePreloaded[this.level] = true;
                callback();
              }
            }.bind(this);
          }
        },

        /**
         * Обновление статуса объектов на экране. Добавляет объекты, которые должны
         * появиться, выполняет проверку поведения всех объектов и удаляет те, которые
         * должны исчезнуть.
         * @param {number} delta Время, прошеднее с отрисовки прошлого кадра.
         */
        updateObjects: function(delta) {
          // Персонаж.
          var me = this.state.objects.filter(function(object) {
            return object.type === ObjectType.ME;
          })[0];

          // Добавляет на карту файрбол по нажатию на Shift.
          if (this.state.keysPressed.SHIFT) {
            this.state.objects.push({
              direction: me.direction,
              height: 24,
              speed: 5,
              sprite: 'img/fireball.gif',
              type: ObjectType.FIREBALL,
              width: 24,
              x: me.direction & Direction.RIGHT ? me.x + me.width : me.x - 24,
              y: me.y + me.height / 2
            });

            this.state.keysPressed.SHIFT = false;
          }

          this.state.garbage = [];

          // Убирает в garbage не используемые на карте объекты.
          var remainingObjects = this.state.objects.filter(function(object) {
            ObjectsBehaviour[object.type](object, this.state, delta);

            if (object.state === ObjectState.DISPOSED) {
              this.state.garbage.push(object);
              return false;
            }

            return true;
          }, this);

          this.state.objects = remainingObjects;
        },

        /**
         * Проверка статуса текущего уровня.
         */
        checkStatus: function() {
          // Нет нужны запускать проверку, нужно ли останавливать уровень, если
          // заранее известно, что да.
          if (this.state.currentStatus !== Verdict.CONTINUE) {
            return;
          }

          if (!this.commonRules) {
            /**
             * Проверки, не зависящие от уровня, но влияющие на его состояние.
             * @type {Array.<functions(Object):Verdict>}
             */
            this.commonRules = [
              /**
               * Если персонаж мертв, игра прекращается.
               * @param {Object} state
               * @return {Verdict}
               */
                function checkDeath(state) {
                var me = state.objects.filter(function(object) {
                  return object.type === ObjectType.ME;
                })[0];

                return me.state === ObjectState.DISPOSED ?
                  Verdict.FAIL :
                  Verdict.CONTINUE;
              },

              /**
               * Если нажата клавиша Esc игра ставится на паузу.
               * @param {Object} state
               * @return {Verdict}
               */
                function checkKeys(state) {
                return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
              },

              /**
               * Игра прекращается если игрок продолжает играть в нее два часа подряд.
               * @param {Object} state
               * @return {Verdict}
               */
                function checkTime(state) {
                return Date.now() - state.startTime > 3 * 60 * 1000 ?
                  Verdict.FAIL :
                  Verdict.CONTINUE;
              }
            ];
          }

          // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
          // по всем универсальным проверкам и проверкам конкретного уровня.
          // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
          // любое другое состояние кроме CONTINUE или пока не пройдут все
          // проверки. После этого состояние сохраняется.
          var allChecks = this.commonRules.concat(LevelsRules[this.level]);
          var currentCheck = Verdict.CONTINUE;
          var currentRule;

          while (currentCheck === Verdict.CONTINUE && allChecks.length) {
            currentRule = allChecks.shift();
            currentCheck = currentRule(this.state);
          }

          this.state.currentStatus = currentCheck;
        },

        /**
         * Принудительная установка состояния игры. Используется для изменения
         * состояния игры от внешних условий, например, когда необходимо остановить
         * игру, если она находится вне области видимости и установить вводный
         * экран.
         * @param {Verdict} status
         */
        setGameStatus: function(status) {
          if (this.state.currentStatus !== status) {
            this.state.currentStatus = status;
          }
        },

        /**
         * Отрисовка всех объектов на экране.
         */
        render: function() {
          // Удаление всех отрисованных на странице элементов.
          this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

          // Выставление всех элементов, оставшихся в this.state.objects согласно
          // их координатам и направлению.
          this.state.objects.forEach(function(object) {
            if (object.sprite) {
              var image = new Image(object.width, object.height);
              image.src = (object.spriteReversed && object.direction & Direction.LEFT) ?
                object.spriteReversed :
                object.sprite;
              this.ctx.drawImage(image, object.x, object.y, object.width, object.height);
            }
          }, this);
        },

        /**
         * Основной игровой цикл. Сначала проверяет состояние всех объектов игры
         * и обновляет их согласно правилам их поведения, а затем запускает
         * проверку текущего раунда. Рекурсивно продолжается до тех пор, пока
         * проверка не вернет состояние FAIL, WIN или PAUSE.
         */
        update: function() {
          if (!this.state.lastUpdated) {
            this.state.lastUpdated = Date.now();
          }

          var delta = (Date.now() - this.state.lastUpdated) / 10;
          this.updateObjects(delta);
          this.checkStatus();

          switch (this.state.currentStatus) {
            case Verdict.CONTINUE:
              this.state.lastUpdated = Date.now();
              this.render();
              requestAnimationFrame(function() {
                this.update();
              }.bind(this));
              break;

            case Verdict.WIN:
            case Verdict.FAIL:
            case Verdict.PAUSE:
            case Verdict.INTRO:
            default:
              this.pauseLevel();
              break;
          }
        },

        /**
         * @param {KeyboardEvent} evt [description]
         * @private
         */
        _onKeyDown: function(evt) {
          switch (evt.keyCode) {
            case 37:
              this.state.keysPressed.LEFT = true;
              break;
            case 39:
              this.state.keysPressed.RIGHT = true;
              break;
            case 38:
              this.state.keysPressed.UP = true;
              break;
            case 27:
              this.state.keysPressed.ESC = true;
              break;
          }

          if (evt.shiftKey) {
            this.state.keysPressed.SHIFT = true;
          }
        },

        /**
         * @param {KeyboardEvent} evt [description]
         * @private
         */
        _onKeyUp: function(evt) {
          switch (evt.keyCode) {
            case 37:
              this.state.keysPressed.LEFT = false;
              break;
            case 39:
              this.state.keysPressed.RIGHT = false;
              break;
            case 38:
              this.state.keysPressed.UP = false;
              break;
            case 27:
              this.state.keysPressed.ESC = false;
              break;
          }

          if (evt.shiftKey) {
            this.state.keysPressed.SHIFT = false;
          }
        },

        /** @private */
        _initializeGameListeners: function() {
          window.addEventListener('keydown', this._onKeyDown);
          window.addEventListener('keyup', this._onKeyUp);
        },

        /** @private */
        _removeGameListeners: function() {
          window.removeEventListener('keydown', this._onKeyDown);
          window.removeEventListener('keyup', this._onKeyUp);
        }
      };

      window.Game = Game;
      window.Game.Verdict = Verdict;

      var gameElement = document.querySelector('.demo');

      var game = new Game(gameElement);
      game.initializeLevelAndStart();
      game.setGameStatus(window.Game.Verdict.INTRO);

      var clouds = document.querySelector('.header-clouds');
      var header = document.querySelector('header');
      var headerInitialPosition = header.getBoundingClientRect().top;
      var headerPositionAfterScroll;
      clouds.style.backgroundPositionX = '0px';
      var previousPosition = parseInt(clouds.style.backgroundPositionX, 10);
      var THROTTLE_DELAY = 100;
      var CLOUDS_SPEED = 3;


      // Возвращает true при скролле вниз и false при скролле вверх
      var getScrollDirection = function() {
        headerPositionAfterScroll = header.getBoundingClientRect().top;
        if(headerInitialPosition - headerPositionAfterScroll > 0) {
          headerInitialPosition = headerPositionAfterScroll;
          return true;
        } else {
          headerInitialPosition = headerPositionAfterScroll;
          return false;
        }
      };

      // Проверяет, виден ли блок
      var isBlockVisible = function(element) {
        var GAP = 150;
        return window.innerHeight - GAP + element.getBoundingClientRect().top > 0;
      };

      var moveClouds = function(callback) {
        var flag = callback();
        if (flag) {
          if (getScrollDirection()) {
            previousPosition -= CLOUDS_SPEED;
            clouds.style.backgroundPositionX = previousPosition + 'px';
          } else {
            previousPosition += CLOUDS_SPEED;
            clouds.style.backgroundPositionX = previousPosition + 'px';
          }
        }
      };

      var lastCall = Date.now();

      window.addEventListener('scroll', function() {
        moveClouds(function() {
          if(Date.now() - lastCall >= THROTTLE_DELAY) {
            lastCall = Date.now();

            //Остановить игру, если блок с игрой не виден
            if(!isBlockVisible(gameElement)) {
              game.setGameStatus(window.Game.Verdict.PAUSE);
            }
            return isBlockVisible(clouds);
          } else {
            return true;
          }
        });
      });

    })();


    /***/ },
  /* 6 */
  /***/ function(module, exports, __webpack_require__) {

    'use strict';

    var loadReviews = __webpack_require__(7);
    var Filter = __webpack_require__(8);
    var getFilteredReviews = __webpack_require__(9);
    var Review = __webpack_require__(10);
    var Const = __webpack_require__(3);

    /** @type {HTMLElement} */
    var reviewsFilters = document.querySelector('.reviews-filter');

    /** @type {HTMLElement} */
    var reviewsContainer = document.querySelector('.reviews-list');

    /** @type {HTMLElement} */
    var reviewsBlock = document.querySelector('.reviews');

    /** @type {HTMLElement} */
    var moreReviewsButton = document.querySelector('.reviews-controls-more');

    /** @type {Array.<Object>} */
    var reviews = [];

    /** @type {Array.<Object>} */
    var filteredReviews = [];

    /** @type {Array.<Object>} */
    var renderedReviews = [];

    /** @type {number} */
    var pageNumber = 0;

    /** @constant {Filter} */
    var DEFAULT_FILTER = Filter.ALL;

    /** Отрисовка отзывов на страницу
     * @param {Array.<Object>} reviewsToRender
     * @param {number} page - страница, с которой начинается отрисовка
     * @param {number} pageSize - размер отрисовываемой страницы
     */

    var renderReviews = function(reviewsToRender, page, pageSize) {
      var from = page * pageSize;
      var to = from + pageSize;

      var container = document.createDocumentFragment();

      if(reviewsToRender.length) {
        reviewsToRender.slice(from, to).forEach(function(data) {
          renderedReviews.push(new Review(data, container));
        });
      } else {
        var reviewsMessage = document.createElement('div');
        reviewsMessage.textContent = 'Подходящие отзывы не найдены';
        reviewsMessage.style.marginBottom = '30px';
        reviewsContainer.appendChild(reviewsMessage);
      }
      reviewsContainer.appendChild(container);
    };

    //Пока длится загрузка файла, показываем прелоадер и прячем блок с фильтрами .reviews-filter
    var showPreloader = function() {
      reviewsBlock.classList.add('reviews-list-loading');
      reviewsFilters.classList.add('invisible');
    };

    //Убираем прелоадер и отображаем блок с фильтрами
    var removePreloader = function() {
      reviewsBlock.classList.remove('reviews-list-loading');
      reviewsFilters.classList.remove('invisible');
    };

    /** Отрисовка отфильтрованных отзывов на страницу
     * @param {string} filter
     */
    var setFilter = function(filter) {
      //Очищаем отзывы
      if(renderedReviews) {
        renderedReviews.forEach(function(review) {
          review.remove();
        });
        renderedReviews = [];
      }

      //Показываем кнопку для пролистывания отзывов
      moreReviewsButton.classList.remove('invisible');

      filteredReviews = getFilteredReviews(reviews, filter);
      pageNumber = 0;
      renderReviews(filteredReviews, pageNumber, Const.PAGE_SIZE);
    };

    //Проверить, сохранён ли последний примененный фильтр в localStorage, если да, то применить его
    //и подсветить инпут с выбранным фильтром
    var checkLastFilters = function() {
      var lastFilter = localStorage.getItem('lastFilter') || DEFAULT_FILTER;
      reviewsFilters.querySelector('#' + lastFilter).checked = true;
      setFilter(lastFilter);
    };

    // установить обработчик изменения фильтра
    var setFiltrationEnabled = function() {
      reviewsFilters.addEventListener('click', function(evt) {
        if(evt.target.name === 'reviews') {
          setFilter(evt.target.id);
          localStorage.setItem('lastFilter', evt.target.id);
        }
      });
    };

    //Обработчик на кнопку подгрузки отзывов
    //Кнопка исчезает, когда все отзывы загружены
    moreReviewsButton.onclick = function() {
      var pagesCountLimit = Math.floor(filteredReviews.length / Const.PAGE_SIZE);

      if(pageNumber < pagesCountLimit - 1) {
        pageNumber++;
        renderReviews(filteredReviews, pageNumber, Const.PAGE_SIZE);
      } else if (pageNumber === pagesCountLimit - 1) {
        moreReviewsButton.classList.add('invisible');
        pageNumber++;
        renderReviews(filteredReviews, pageNumber, Const.PAGE_SIZE);
      }
    };

    showPreloader();
    loadReviews(function(loadedReviews) {
        reviews = loadedReviews;
        setFiltrationEnabled(true);
        checkLastFilters();
      }, removePreloader()
    );


    /***/ },
  /* 7 */
  /***/ function(module, exports, __webpack_require__) {

    'use strict';
    var Const = __webpack_require__(3);

    /** @type {HTMLElement} */
    var reviewsBlock = document.querySelector('.reviews');

    /** Загрузка отзывов
     * @param {callback} callbackAfter - функция отрисовки, которая будет вызвана после загрузки отзывов
     * @param {callback} callbackBefore - отобразить загрузчики
     */
    var loadReviews = function(callbackAfter, callbackBefore) {
      if(typeof callbackBefore === 'function') {
        callbackBefore();
      }
      var xhr = new XMLHttpRequest();

      xhr.onload = function(evt) {
        var loadedData = JSON.parse(evt.target.response);
        callbackAfter(loadedData);
      };

      xhr.ontimeout = function() {
        reviewsBlock.classList.remove('reviews-list-loading');
        reviewsBlock.classList.add('reviews-load-failure');
      };

      xhr.timeout = Const.IMAGE_LOAD_TIMEOUT;
      xhr.open('GET', Const.REVIEWS_LOAD_URL);
      xhr.send();
    };

    module.exports = loadReviews;


    /***/ },
  /* 8 */
  /***/ function(module, exports) {

    'use strict';

    /** Cписок возможных фильтров для отзывов
     * @enum {string} */
    var Filter = {
      'ALL': 'reviews-all',
      'BAD': 'reviews-bad',
      'GOOD': 'reviews-good',
      'RECENT': 'reviews-recent',
      'POPULAR': 'reviews-popular'
    };

    module.exports = Filter;


    /***/ },
  /* 9 */
  /***/ function(module, exports, __webpack_require__) {

    'use strict';

    var Filter = __webpack_require__(8);

    /** Фильтрация отзывов
     * @param {Array.<Object>} reviewsList
     * @param {string} filter - применяемый фильтр
     * @returns {Array.<Object>} - отфильтрованный массив с отзывами
     */
    var getFilteredReviews = function(reviewsList, filter) {
      var reviewsToFilter = reviewsList.slice(0);

      switch (filter) {
        case Filter.BAD:
          reviewsToFilter.sort(function(a, b) {
            return a.rating - b.rating;
          });
          break;
        case Filter.GOOD:
          reviewsToFilter.sort(function(a, b) {
            return b.rating - a.rating;
          });
          break;
        case Filter.RECENT:
          reviewsToFilter.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
          });
          break;
        case Filter.POPULAR:
          reviewsToFilter.sort(function(a, b) {
            return b.review_usefulness - a.review_usefulness;
          });
          break;
      }
      return reviewsToFilter;
    };

    module.exports = getFilteredReviews;


    /***/ },
  /* 10 */
  /***/ function(module, exports, __webpack_require__) {

    'use strict';

    var getReviewElement = __webpack_require__(11);

    /**
     * Конструктор компоненты с отзывом
     * @param {Object} data
     * @param {Element} container
     * @constructor
     */

    var Review = function(data, container) {
      this.data = data;

      this.element = getReviewElement(this.data);
      container.appendChild(this.element);

      /** @type {HTMLElement} */
      this.reviewQuizYes = this.element.querySelector('.review-quiz-answer-yes');

      /** @type {HTMLElement} */
      this.reviewQuizNo = this.element.querySelector('.review-quiz-answer-no');

      this.onReviewClickYes = this.onReviewClickYes.bind(this);
      this.onReviewClickNo = this.onReviewClickNo.bind(this);

      //Обработчик событий на клики по блокам для голосования
      this.reviewQuizYes.addEventListener('click', this.onReviewClickYes);
      this.reviewQuizNo.addEventListener('click', this.onReviewClickNo);

      this.remove = this.remove.bind(this);
    };
    /**
     * Подсветить "Да" или "Нет" при голосовании, убрать подсветку с притивоположного варианта
     * */
    Review.prototype.onReviewClickYes = function() {
      this.reviewQuizYes.classList.add('review-quiz-answer-active');
      this.reviewQuizNo.classList.remove('review-quiz-answer-active');
    };

    Review.prototype.onReviewClickNo = function() {
      this.reviewQuizNo.classList.add('review-quiz-answer-active');
      this.reviewQuizYes.classList.remove('review-quiz-answer-active');
    };
    /**
     * Удалить отзыв и обработчики
     * */
    Review.prototype.remove = function() {
      this.element.removeEventListener('click', this.onReviewClick);
      this.element.parentNode.removeChild(this.element);
    };

    module.exports = Review;


    /***/ },
  /* 11 */
  /***/ function(module, exports, __webpack_require__) {

    'use strict';

    var Const = __webpack_require__(3);

    /** @type {HTMLElement} */
    var template = document.getElementById('review-template');

    /** @type {HTMLElement} */
    var elementToClone;

    // Проверяем, поддерживает ли браузер тег template
    if('content' in template) {
      elementToClone = template.content.querySelector('.review');
    } else {
      elementToClone = template.querySelector('.review');
    }

    /**
     * @param {Object} data
     * @return {HTMLElement}
     */

    var getReviewElement = function(data) {
      var element = elementToClone.cloneNode(true);

      element.querySelector('.review-text').textContent = data.description;
      element.querySelector('.review-rating').style.width = (data.rating * 30) + 'px';

      var authorPhoto = new Image(124, 124);

      authorPhoto.onload = function() {
        clearTimeout(imageLoadTimeOut);
      };

      authorPhoto.onerror = function() {
        element.classList.add('review-load-failure');
      };

      authorPhoto.src = data.author.picture;
      authorPhoto.alt = data.author.name;
      element.replaceChild(authorPhoto, element.querySelector('.review-author'));
      authorPhoto.classList.add('review-author');

      var imageLoadTimeOut = setTimeout(function() {
        authorPhoto.src = '';
        element.classList.add('review-load-failure');
      }, Const.IMAGE_LOAD_TIMEOUT);

      return element;
    };

    module.exports = getReviewElement;


    /***/ },
  /* 12 */
  /***/ function(module, exports, __webpack_require__) {

    'use strict';

    var Gallery = __webpack_require__(13);
    var Const = __webpack_require__(3);
    var Utils = __webpack_require__(2);

    /** @type {Array<HTMLElement>} */
    var photogalleryImages = document.querySelectorAll('.photogallery-image img');

    /** Массив из src всех изображений в галерее
     * @type {Array<String>} */
    var images = Array.prototype.map.call(photogalleryImages, function(item) {
      return item.getAttribute('src');
    });

    /** @type {HTMLElement} */
    var galleryContainer = document.querySelector('.photogallery');

    /** @type {Gallery} */
    var gallery = new Gallery(images);

    /**
     * При загрузке страницы проверяет хэщ, и если он соответствует регулярному выражению
     * рендерит картинку по хэшу
     */
    var renderGalleryOnLoad = function() {
      var src = Utils.checkHash(Const.GALLERY_REG_EXP);
      if(typeof src === 'string') {
        gallery.renderGallery(src);
        gallery.showGallery();
      }
    };

    /**
     * @param {Event} evt
     * Открывает галерею при клике на картинку
     * изменяет хэш
     */
    var renderGalleryOnClick = function(evt) {
      evt.preventDefault();
      var index = images.indexOf(evt.target.getAttribute('src'));
      gallery.showGallery();
      gallery.changeLocation(images[index]);
    };

    galleryContainer.addEventListener('click', renderGalleryOnClick);

    window.addEventListener('load', renderGalleryOnLoad);





    /***/ },
  /* 13 */
  /***/ function(module, exports, __webpack_require__) {

    'use strict';

    var Const = __webpack_require__(3);
    var Utils = __webpack_require__(2);

    /**
     * @param {Array<String>} images - Массив адресами изображений, которые будут открыты в галерее
     * @constructor
     */
    var Gallery = function(images) {

      this.images = images;

      /** @type {HTMLElement} */
      this.galleryOverlay = document.querySelector('.overlay-gallery');

      /** @type {HTMLElement} */
      this.imageContainer = document.querySelector('.overlay-gallery-preview');

      /**
       * Номер текущего изображения в галерее
       * @type {HTMLElement} */
      this.numberCurrent = document.querySelector('.preview-number-current');

      /**
       * Всего изображений в галерее
       * @type {HTMLElement} */
      this.numberTotal = document.querySelector('.preview-number-total');

      /**
       * Кнопка закрытия галереи
       * @type {HTMLElement} */
      this.closeOverlay = document.querySelector('.overlay-gallery-close');

      /** @type {HTMLElement} */
      this.arrowLeft = document.querySelector('.overlay-gallery-control-left');

      /** @type {HTMLElement} */
      this.arrowRight = document.querySelector('.overlay-gallery-control-right');

      /**
       * Индекс отображаемого изображения в переданном массиве адресов
       * @type {number} */
      this.currentIndex = 0;

      /** @type {Image} */
      this.image = new Image();

      /** @type {number} */
      this.numberTotal.innerHTML = this.images.length;

      this.changeLocation = this.changeLocation.bind(this);

      this.renderGallery = this.renderGallery.bind(this);

      this.showGallery = this.showGallery.bind(this);

      this.hideGallery = this.hideGallery.bind(this);

      this._onHashChange = this._onHashChange.bind(this);

      this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);

      this._onCloseClick = this._onCloseClick.bind(this);

      this._onArrowLeft = this._onArrowLeft.bind(this);

      this._onArrowRight = this._onArrowRight.bind(this);

      window.addEventListener('hashchange', this._onHashChange);
    };

    /**
     * Отрисовка галереи. Принимает как параметр индекс адреса изображения в массиве
     * или строку с адресом изображения
     * @param {number|string} indexOrSrc
     */
    Gallery.prototype.renderGallery = function(indexOrSrc) {
      if(typeof indexOrSrc === 'string') {
        this.currentIndex = this.images.indexOf(indexOrSrc);
      } else if(typeof indexOrSrc === 'number') {
        this.currentIndex = indexOrSrc;
      }

      if(this.currentIndex > this.images.length - 1) {
        this.currentIndex = 0;
      } else if (this.currentIndex < 0) {
        this.currentIndex = this.images.length - 1;
      }

      this.image.src = this.images[this.currentIndex];
      this.imageContainer.appendChild(this.image);
      this.numberCurrent.innerHTML = this.currentIndex + 1;
    };

    /**
     * Изменияет хэш страницы
     * @param {string} src
     */
    Gallery.prototype.changeLocation = function(src) {
      window.location.hash = 'photo/' + src;
    };

    /**
     * Делает видимым контейнер с галереей
     * Добавляет обработчики на кнопки управления галереей
     */
    Gallery.prototype.showGallery = function() {
      if(this.galleryOverlay.classList.contains('invisible')) {
        this.galleryOverlay.classList.remove('invisible');
        Utils.removeBodyScroll();
      }
      document.addEventListener('keydown', this._onDocumentKeyDown);
      this.closeOverlay.addEventListener('click', this._onCloseClick);
      this.arrowLeft.addEventListener('click', this._onArrowLeft);
      this.arrowRight.addEventListener('click', this._onArrowRight);
    };

    /**
     * Делает невидимым контейнер с галереей
     * Удаляет обработчики с кнопок управления галереей
     */
    Gallery.prototype.hideGallery = function() {
      Utils.clearHash();
      this.galleryOverlay.classList.add('invisible');
      Utils.returnBodyScroll();

      document.removeEventListener('keydown', this._onDocumentKeyDown);
      this.closeOverlay.removeEventListener('click', this._onCloseClick);
      this.arrowLeft.removeEventListener('click', this._onArrowLeft);
      this.arrowRight.removeEventListener('click', this._onArrowRight);
    };

    /**
     * Перерисовывает галерею при изменении хэша страницы
     * @private
     */
    Gallery.prototype._onHashChange = function() {
      var matchedHash = Utils.checkHash(Const.GALLERY_REG_EXP);
      if (matchedHash) {
        this.changeLocation(matchedHash);
        this.renderGallery(matchedHash);
      } else {
        this.hideGallery();
        Utils.clearHash();
      }
    };

    /**
     * Прячет галерею при клику на кнопку закрытия
     * @private
     */
    Gallery.prototype._onCloseClick = function() {
      this.hideGallery();
    };

    /**
     * Прячет галерею при клику на кнопку закрытия
     * @private
     */
    Gallery.prototype._onArrowLeft = function() {
      if (this.currentIndex < 0) {
        this.currentIndex = this.images.length - 1;
      } else {
        this.changeLocation(this.images[--this.currentIndex]);
      }
    };

    /**
     * Показывает следующее изображение в галерее
     * @private
     */
    Gallery.prototype._onArrowRight = function() {
      if(this.currentIndex + 1 > this.images.length - 1) {
        this.currentIndex = 0;
        this.changeLocation(this.images[this.currentIndex]);
      } else {
        this.changeLocation(this.images[++this.currentIndex]);
      }
    };

    /**
     * Показывает предыдущее изображение в галерее
     * @private
     */
    Gallery.prototype._onDocumentKeyDown = function(evt) {
      if(evt.keyCode === Const.Keycodes.ESC) {
        this.hideGallery();
      } else if(evt.keyCode === Const.Keycodes.LEFT) {
        this._onArrowLeft();
      } else if(evt.keyCode === Const.Keycodes.RIGHT) {
        this._onArrowRight();
      }
    };

    module.exports = Gallery;


    /***/ }
  /******/ ]);
