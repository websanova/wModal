/******************************************
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Websanova
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         This websanova jQuery modal plugin is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @github          http://github.com/websanova/modal
 * @version			1.1.1
 *
 ******************************************/

(function($)
{
	$.fn.wModal = function(option, settings)
	{
		if(typeof option === 'object')
		{
			settings = option;
		}
		else if(typeof option === 'string')
		{
			var values = [];

			var elements = this.each(function()
			{
				var data = $(this).data('_wModal');

				if(data)
				{
					if(option === 'show') data.show(settings || {});
					else if(option === 'hide') data.hide(settings || {});
					else if($.fn.wModal.defaultSettings[option] !== undefined)
					{
						if(settings !== undefined) { data.settings[option] = settings; }
						else { values.push(data.settings[option]); }
					}
				}
			});

			if(values.length === 1) { return values[0]; }
			else if(values.length > 0) { return values; }
			else { return elements; }
		}

		return this.each(function()
		{
			var _settings = $.extend({}, $.fn.wModal.defaultSettings, settings || {});
			var modal = new Modal(_settings, $(this));
			var $el = modal.generate();

			modal.pixel.append($el);

			$(this).data('_wModal', modal);
		});
	}

	$.fn.wModal.defaultSettings = {
		position	: 'cm',		// position of modal (lt, ct, rt, rm, rb, cb, lb, lm, cm)
		offset		: '10',		// offset of modal from edges if not in "m" or "c" position
		fxShow		: 'none',	// show effects (fade, slideUp, slideDown, slideLeft, slideRight)
		fxHide		: 'none',	// hide effects (fade, slideUp, slideDown, slideLeft, slideRight)
		btns		: {},		// button callbacks
		msg			: null		// optional message to set if "_wModal_msg" class is set
	};

	function Modal(settings, elem)
	{
		this.modal = null;
		this.settings = settings;
		this.elem = elem;

		this.tempButtons = {};
		this.rotationTimer = null;

		return this;
	}

	Modal.prototype = 
	{
		generate: function()
		{
			var _this = this;

			if(this.modal) return this.modal;

			// bg - check if bg already exists
			if($('#_wModal_bg').length)
			{
				this.bg = $('#_wModal_bg');
				this.pixel = $('#_wModal_pixel');
			}
			else
			{
				this.bg = $('<div id="_wModal_bg"></div>').css({position:'fixed', left:'0', top:'0', display:'none'});
				$('body').append(this.bg);
				$(window).resize(function(){ if(_this.bg.is(':visible')) _this.resetBg.apply(_this); });

				// positioning pixel setting to body produces some weird effects wtih scrollbars when doing sliding effects
				this.pixel = $('<div id="_wModal_pixel"></div>').css({position:'fixed', left:'0', top:'0', width:'0', height:'0', lineHeight:'0', fontSize:'0'});
				$('body').append(this.pixel);
			}

			// modal
			this.modal = $('<div class="_wModal_holder"></div>').css({position:'absolute', display:'none'});
			this.modal.html(this.elem.html());

			// set message - if set we use it, otherwise we try to pull from the _wModal_message container
			var msg = this.modal.find('._wModal_msg');
			if(msg.length)
			{
				if(this.settings.msg && this.settings.msg !== '') msg.html(this.settings.msg);
				else this.settings.msg = msg.html();
			}

			$(window).resize(function(){ if(_this.modal.is(':visible')) _this.resetModal.apply(_this); });

			this.resetBtns();

			return this.modal;
		},

		resetModal: function()
		{
			var left = null, top = null, right = null, bottom = null;

			var position = this.tempPosition || this.settings.position;
			var offset = this.tempOffset || this.settings.offset;

			var modalWidth = this.modal.outerWidth(true);
			var modalHeight = this.modal.outerHeight(true);

			var viewWidth = $(window).width();
			var viewHeight = $(window).height();

			this.outerX = viewWidth;
			this.outerY = viewHeight;

			var cX = (viewWidth/2) - (modalWidth/2);
			var cY = (viewHeight/2) - (modalHeight/2);
			var rX = viewWidth - modalWidth - offset;
			var bY = viewHeight - modalHeight - offset;

			switch(position)
			{
				case 'cm': left = cX;		top = cY;		break;
				case 'lt': left = offset;	top = offset;	break;
				case 'ct': left = cX;		top = offset; 	break;
				case 'rt': left = rX;		top = offset;	break;
				case 'rm': left = rX;		top = cY;		break;
				case 'rb': left = rX;		top = bY;		break;
				case 'cb': left = cX;		top = bY;		break;
				case 'lb': left = offset;	top = bY;		break;
				case 'lm': left = offset;	top = cY;		break;
			}

			this.modal.css({left:(left ? left + 'px' : 'auto'), top:(top ? top + 'px' : 'auto'), bottom:(bottom ? bottom + 'px' : 'auto'), right: (right ? right + 'px' : 'auto') });
		},

		resetBg: function()
		{
			this.bg.css({width:$(window).width(), height:$(window).height()});
		},

		resetBtns: function(btns)
		{
			var btns = btns || this.settings.btns;
			var _this = this;

			for(var btn in btns)
			{
				(function(btn){
					_this.modal.find('._wModal_btn_' + btn).unbind('click');
					_this.modal.find('._wModal_btn_' + btn).click(function()
					{
						if(_this.tempBtns[btn]) _this.tempBtns[btn].apply(_this);
						else btns[btn].apply(_this);
					});
				})(btn);
			}
		},

		show: function(settings)
		{
			this.tempBtns = settings.btns || {};
			this.tempPosition = settings.position || null;
			this.tempOffset = settings.offset || null;

			this.tempFxShow = settings.fxShow || this.settings.fxShow;
			this.tempFxHide = settings.fxHide || this.settings.fxHide;

			var msg = this.modal.find('._wModal_msg');
			if(msg.length) msg.html(settings.msg || this.settings.msg);

			this.resetBg();
			this.resetModal();

			this.pixel.children('._wModal_holder').hide();

			this['fxShow' + this.tempFxShow.charAt(0).toUpperCase() + this.tempFxShow.substring(1)].apply(this);
		},

		hide: function()
		{
			this['fxHide' + this.tempFxHide.charAt(0).toUpperCase() + this.tempFxHide.substring(1)].apply(this);
		},

		/************************************************
		 * Effects
		 ************************************************/

		 /*** none ***/
		 fxShowNone: function()
		 {
		 	this.bg.show();
		 	this.modal.show();
		 },

		 fxHideNone: function()
		 {
		 	this.modal.hide();
		 	this.bg.hide();
		 },

		 /*** fade ***/
		 fxShowFade: function()
		 {
		 	var _this = this;
		 	this.bg.fadeIn(100, function(){ _this.modal.fadeIn(300); });
		 },

		 fxHideFade: function()
		 {
		 	var _this = this;
		 	this.modal.fadeOut(300, function(){ _this.bg.fadeOut(100); });
		 },

		 /*** slideUp ***/
		 fxShowSlideUp: function(){ this.fxSlide('show', 'top', this.outerY); },
		 fxHideSlideUp: function(){ this.fxSlide('hide', 'top', -1*this.outerY); },

		 /*** slideDown ***/
		 fxShowSlideDown: function(){ this.fxSlide('show', 'top', -1*this.outerY); },
		 fxHideSlideDown: function(){ this.fxSlide('hide', 'top', this.outerY); },

		 /*** slideLeft ***/
		 fxShowSlideLeft: function(){ this.fxSlide('show', 'left', this.outerX); },
		 fxHideSlideLeft: function(){ this.fxSlide('hide', 'left', -1*this.outerX); },

		 /*** slideRight ***/
		 fxShowSlideRight: function(){ this.fxSlide('show', 'left', -1*this.outerX); },
		 fxHideSlideRight: function(){ this.fxSlide('hide', 'left', this.outerX); },

		 /*** slide helper ***/
		 fxSlide: function(state, position, value)
		 {
		 	var _this = this;
		 	var css = {};
		 	css[position] = value;

		 	if(state === 'show')
		 	{
			 	this.modal.show();
			 	var offset = this.modal.offset();
			 	this.modal.hide();

			 	this.modal.css(css);
			 	this.bg.show();
			 	this.modal.show();
			 	
			 	css[position] = offset[position];

			 	this.modal.animate(css);
			 }
			 else
			 {
			 	var _this = this;
		 		this.modal.animate(css, function(){ _this.modal.hide(); _this.bg.hide(); });
			 }
		 },

		fxShowRotateUp: function(){ this.fxRotate(); this.fxShowSlideUp(); },
		fxHideRotateUp: function(){ this.fxRotate(); this.fxHideSlideUp(); },

		fxShowRotateDown: function(){ this.fxRotate(); this.fxShowSlideDown(); },
		fxHideRotateDown: function(){ this.fxRotate(); this.fxHideSlideDown(); },

		fxShowRotateLeft: function(){ this.fxRotate(); this.fxShowSlideLeft(); },
		fxHideRotateLeft: function(){ this.fxRotate(); this.fxHideSlideLeft(); },

		fxShowRotateRight: function(){ this.fxRotate(); this.fxShowSlideRight(); },
		fxHideRotateRight: function(){ this.fxRotate(); this.fxHideSlideRight(); },

		/*** rotate helper ***/
		fxRotate: function()
		{
			var _this = this;
			this.rotationDegree = 0;

			this.rotationTimer = setInterval(function(){

				_this.rotationDegree += 60;
				_this.modal.css('-webkit-transform', 'rotate(' + _this.rotationDegree + 'deg)');
				_this.modal.css('-moz-transform', 'rotate(' + _this.rotationDegree + 'deg)');

				if(_this.rotationDegree % 360 === 0) clearInterval(_this.rotationTimer);
			}, 80);
		}
	}
})(jQuery);