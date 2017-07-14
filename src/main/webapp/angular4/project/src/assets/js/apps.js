/*
Template Name: Infinite Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.7
Version: 1.0.0
Author: Sean Ngu
Website: http://www.seantheme.com/infinite-admin/admin/html/
    ----------------------------
        APPS CONTENT TABLE
    ----------------------------
    
    <!-- ======== GLOBAL SCRIPT SETTING ======== -->
	01. Global Variable
	02. Handle Scrollbar
	03. Handle Header Search Bar
	04. Handle Sidebar Menu
	05. Handle Sidebar Minify Float Menu
	06. Handle Dropdown Close Option
	07. Handle App Notification
	08. Handle Setting Cookie
	09. Handle Panel - Remove / Reload / Collapse / Expand
	10. Handle Tooltip & Popover Activation
	11. Handle Scroll to Top Button Activation
	
    <!-- ======== APPLICATION SETTING ======== -->
    Application Controller
*/



/* 01. Global Variable
------------------------------------------------ */
var MUTED_COLOR   = '#8A8A8F';
var MUTED_TRANSPARENT_1_COLOR   = 'rgba(138, 138, 143, 0.1)';
var MUTED_TRANSPARENT_2_COLOR   = 'rgba(138, 138, 143, 0.2)';
var MUTED_TRANSPARENT_3_COLOR   = 'rgba(138, 138, 143, 0.3)';
var MUTED_TRANSPARENT_4_COLOR   = 'rgba(138, 138, 143, 0.4)';
var MUTED_TRANSPARENT_5_COLOR   = 'rgba(138, 138, 143, 0.5)';
var MUTED_TRANSPARENT_6_COLOR   = 'rgba(138, 138, 143, 0.6)';
var MUTED_TRANSPARENT_7_COLOR   = 'rgba(138, 138, 143, 0.7)';
var MUTED_TRANSPARENT_8_COLOR   = 'rgba(138, 138, 143, 0.8)';
var MUTED_TRANSPARENT_9_COLOR   = 'rgba(138, 138, 143, 0.9)';

var PRIMARY_COLOR = '#007AFF';
var PRIMARY_TRANSPARENT_1_COLOR = 'rgba(0, 122, 255, 0.1)';
var PRIMARY_TRANSPARENT_2_COLOR = 'rgba(0, 122, 255, 0.2)';
var PRIMARY_TRANSPARENT_3_COLOR = 'rgba(0, 122, 255, 0.3)';
var PRIMARY_TRANSPARENT_4_COLOR = 'rgba(0, 122, 255, 0.4)';
var PRIMARY_TRANSPARENT_5_COLOR = 'rgba(0, 122, 255, 0.5)';
var PRIMARY_TRANSPARENT_6_COLOR = 'rgba(0, 122, 255, 0.6)';
var PRIMARY_TRANSPARENT_7_COLOR = 'rgba(0, 122, 255, 0.7)';
var PRIMARY_TRANSPARENT_8_COLOR = 'rgba(0, 122, 255, 0.8)';
var PRIMARY_TRANSPARENT_9_COLOR = 'rgba(0, 122, 255, 0.9)';

var SUCCESS_COLOR = '#4CD964';
var SUCCESS_TRANSPARENT_1_COLOR = 'rgba(76, 217, 100, 0.1)';
var SUCCESS_TRANSPARENT_2_COLOR = 'rgba(76, 217, 100, 0.2)';
var SUCCESS_TRANSPARENT_3_COLOR = 'rgba(76, 217, 100, 0.3)';
var SUCCESS_TRANSPARENT_4_COLOR = 'rgba(76, 217, 100, 0.4)';
var SUCCESS_TRANSPARENT_5_COLOR = 'rgba(76, 217, 100, 0.5)';
var SUCCESS_TRANSPARENT_6_COLOR = 'rgba(76, 217, 100, 0.6)';
var SUCCESS_TRANSPARENT_7_COLOR = 'rgba(76, 217, 100, 0.7)';
var SUCCESS_TRANSPARENT_8_COLOR = 'rgba(76, 217, 100, 0.8)';
var SUCCESS_TRANSPARENT_9_COLOR = 'rgba(76, 217, 100, 0.9)';

var INFO_COLOR    = '#5AC8FA';
var INFO_TRANSPARENT_1_COLOR    = 'rgba(90, 200, 250, 0.1)';
var INFO_TRANSPARENT_2_COLOR    = 'rgba(90, 200, 250, 0.2)';
var INFO_TRANSPARENT_3_COLOR    = 'rgba(90, 200, 250, 0.3)';
var INFO_TRANSPARENT_4_COLOR    = 'rgba(90, 200, 250, 0.4)';
var INFO_TRANSPARENT_5_COLOR    = 'rgba(90, 200, 250, 0.5)';
var INFO_TRANSPARENT_6_COLOR    = 'rgba(90, 200, 250, 0.6)';
var INFO_TRANSPARENT_7_COLOR    = 'rgba(90, 200, 250, 0.7)';
var INFO_TRANSPARENT_8_COLOR    = 'rgba(90, 200, 250, 0.8)';
var INFO_TRANSPARENT_9_COLOR    = 'rgba(90, 200, 250, 0.9)';

var WARNING_COLOR = '#FF9500';
var WARNING_TRANSPARENT_1_COLOR = 'rgba(255, 149, 0, 0.1)';
var WARNING_TRANSPARENT_2_COLOR = 'rgba(255, 149, 0, 0.2)';
var WARNING_TRANSPARENT_3_COLOR = 'rgba(255, 149, 0, 0.3)';
var WARNING_TRANSPARENT_4_COLOR = 'rgba(255, 149, 0, 0.4)';
var WARNING_TRANSPARENT_5_COLOR = 'rgba(255, 149, 0, 0.5)';
var WARNING_TRANSPARENT_6_COLOR = 'rgba(255, 149, 0, 0.6)';
var WARNING_TRANSPARENT_7_COLOR = 'rgba(255, 149, 0, 0.7)';
var WARNING_TRANSPARENT_8_COLOR = 'rgba(255, 149, 0, 0.8)';
var WARNING_TRANSPARENT_9_COLOR = 'rgba(255, 149, 0, 0.9)';

var DANGER_COLOR  = '#FF3B30';
var DANGER_TRANSPARENT_1_COLOR  = 'rgba(255, 59, 48, 0.1)';
var DANGER_TRANSPARENT_2_COLOR  = 'rgba(255, 59, 48, 0.2)';
var DANGER_TRANSPARENT_3_COLOR  = 'rgba(255, 59, 48, 0.3)';
var DANGER_TRANSPARENT_4_COLOR  = 'rgba(255, 59, 48, 0.4)';
var DANGER_TRANSPARENT_5_COLOR  = 'rgba(255, 59, 48, 0.5)';
var DANGER_TRANSPARENT_6_COLOR  = 'rgba(255, 59, 48, 0.6)';
var DANGER_TRANSPARENT_7_COLOR  = 'rgba(255, 59, 48, 0.7)';
var DANGER_TRANSPARENT_8_COLOR  = 'rgba(255, 59, 48, 0.8)';
var DANGER_TRANSPARENT_9_COLOR  = 'rgba(255, 59, 48, 0.9)';

var PINK_COLOR    = '#FF2D55';
var PINK_TRANSPARENT_1_COLOR    = 'rgba(255, 45, 85, 0.1)';
var PINK_TRANSPARENT_2_COLOR    = 'rgba(255, 45, 85, 0.2)';
var PINK_TRANSPARENT_3_COLOR    = 'rgba(255, 45, 85, 0.3)';
var PINK_TRANSPARENT_4_COLOR    = 'rgba(255, 45, 85, 0.4)';
var PINK_TRANSPARENT_5_COLOR    = 'rgba(255, 45, 85, 0.5)';
var PINK_TRANSPARENT_6_COLOR    = 'rgba(255, 45, 85, 0.6)';
var PINK_TRANSPARENT_7_COLOR    = 'rgba(255, 45, 85, 0.7)';
var PINK_TRANSPARENT_8_COLOR    = 'rgba(255, 45, 85, 0.8)';
var PINK_TRANSPARENT_9_COLOR    = 'rgba(255, 45, 85, 0.9)';

var PURPLE_COLOR  = '#5856D6';
var PURPLE_TRANSPARENT_1_COLOR  = 'rgba(88, 86, 214, 0.1)';
var PURPLE_TRANSPARENT_2_COLOR  = 'rgba(88, 86, 214, 0.2)';
var PURPLE_TRANSPARENT_3_COLOR  = 'rgba(88, 86, 214, 0.3)';
var PURPLE_TRANSPARENT_4_COLOR  = 'rgba(88, 86, 214, 0.4)';
var PURPLE_TRANSPARENT_5_COLOR  = 'rgba(88, 86, 214, 0.5)';
var PURPLE_TRANSPARENT_6_COLOR  = 'rgba(88, 86, 214, 0.6)';
var PURPLE_TRANSPARENT_7_COLOR  = 'rgba(88, 86, 214, 0.7)';
var PURPLE_TRANSPARENT_8_COLOR  = 'rgba(88, 86, 214, 0.8)';
var PURPLE_TRANSPARENT_9_COLOR  = 'rgba(88, 86, 214, 0.9)';

var YELLOW_COLOR  = '#FFCC00';
var YELLOW_TRANSPARENT_1_COLOR  = 'rgba(255, 204, 0, 0.1)';
var YELLOW_TRANSPARENT_2_COLOR  = 'rgba(255, 204, 0, 0.2)';
var YELLOW_TRANSPARENT_3_COLOR  = 'rgba(255, 204, 0, 0.3)';
var YELLOW_TRANSPARENT_4_COLOR  = 'rgba(255, 204, 0, 0.4)';
var YELLOW_TRANSPARENT_5_COLOR  = 'rgba(255, 204, 0, 0.5)';
var YELLOW_TRANSPARENT_6_COLOR  = 'rgba(255, 204, 0, 0.6)';
var YELLOW_TRANSPARENT_7_COLOR  = 'rgba(255, 204, 0, 0.7)';
var YELLOW_TRANSPARENT_8_COLOR  = 'rgba(255, 204, 0, 0.8)';
var YELLOW_TRANSPARENT_9_COLOR  = 'rgba(255, 204, 0, 0.9)';

var INVERSE_COLOR = '#000000';
var INVERSE_TRANSPARENT_1_COLOR = 'rgba(0, 0, 0, 0.1)';
var INVERSE_TRANSPARENT_2_COLOR = 'rgba(0, 0, 0, 0.2)';
var INVERSE_TRANSPARENT_3_COLOR = 'rgba(0, 0, 0, 0.3)';
var INVERSE_TRANSPARENT_4_COLOR = 'rgba(0, 0, 0, 0.4)';
var INVERSE_TRANSPARENT_5_COLOR = 'rgba(0, 0, 0, 0.5)';
var INVERSE_TRANSPARENT_6_COLOR = 'rgba(0, 0, 0, 0.6)';
var INVERSE_TRANSPARENT_7_COLOR = 'rgba(0, 0, 0, 0.7)';
var INVERSE_TRANSPARENT_8_COLOR = 'rgba(0, 0, 0, 0.8)';
var INVERSE_TRANSPARENT_9_COLOR = 'rgba(0, 0, 0, 0.9)';

var WHITE_COLOR   = '#FFFFFF';
var WHITE_TRANSPARENT_1_COLOR   = 'rgba(255, 255, 255, 0.1)';
var WHITE_TRANSPARENT_2_COLOR   = 'rgba(255, 255, 255, 0.2)';
var WHITE_TRANSPARENT_3_COLOR   = 'rgba(255, 255, 255, 0.3)';
var WHITE_TRANSPARENT_4_COLOR   = 'rgba(255, 255, 255, 0.4)';
var WHITE_TRANSPARENT_5_COLOR   = 'rgba(255, 255, 255, 0.5)';
var WHITE_TRANSPARENT_6_COLOR   = 'rgba(255, 255, 255, 0.6)';
var WHITE_TRANSPARENT_7_COLOR   = 'rgba(255, 255, 255, 0.7)';
var WHITE_TRANSPARENT_8_COLOR   = 'rgba(255, 255, 255, 0.8)';
var WHITE_TRANSPARENT_9_COLOR   = 'rgba(255, 255, 255, 0.9)';


/* 02. Handle Scrollbar
------------------------------------------------ */
var handleSlimScroll = function() {
	"use strict";
	$('[data-scrollbar=true]').each( function() {
		generateSlimScroll($(this));
	});
};
var generateSlimScroll = function(element) {
	if ($(element).attr('data-init')) {
		return;
	}
	var dataHeight = $(element).attr('data-height');
		dataHeight = (!dataHeight) ? $(element).height() : dataHeight;

	var scrollBarOption = {
		height: dataHeight, 
		alwaysVisible: true
	};
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$(element).css('height', dataHeight);
		$(element).css('overflow-x','scroll');
	} else {
		$(element).slimScroll(scrollBarOption);
	}
	$(element).attr('data-init', true);
};


/* 03. Handle Header Search Bar
------------------------------------------------ */
var handleHeaderSearchBar = function() { 
	$('[data-toggle="search-bar"]').live('click', function(e) {
		e.preventDefault();
		
		$('.header-search-bar').addClass('active');
		$('body').append('<a href="javascript:;" data-dismiss="search-bar" id="search-bar-backdrop" class="search-bar-backdrop"></a>');
		$('#search-bar-backdrop').fadeIn(200);
		setTimeout(function() {
			$('#header-search').focus();
		}, 200);
	});
	$('[data-dismiss="search-bar"]').live('click', function(e) {
		e.preventDefault();
		
		$('.header-search-bar').addClass('inactive');
		setTimeout(function() {
			$('.header-search-bar').removeClass('active inactive');
		}, 200);
		$('#search-bar-backdrop').fadeOut(function() {
			$(this).remove();
		});
	});
	$.widget("custom.autocompletewithheader", $.ui.autocomplete, {
		_renderMenu: function (ul, items) {
			var self = this;
			$.each(items, function (index, item) {
				self._renderItem(ul, item);
				if (index == 0) ul.prepend('<li class="ui-autocomplete-header">Suggested Search:</li>');
			});
		}
	});
	var searchTags = ['Report', 'Analytic', 'Product', 'Project', 'Sales', 'Mobile App Development', 'Build Website', 'Helper', 'Profile', 'Setting'];
	$('#header-search').autocompletewithheader({
		source: searchTags,
		minLength: 0
	}).on('focus', function(){ 
		$(this).autocompletewithheader('search'); 
	});
	$('#header-search').autocompletewithheader( "widget" ).addClass('search-bar-autocomplete animated fadeIn');
};


/* 04. Handle Sidebar Menu
------------------------------------------------ */
var handleSidebarMenu = function() {
	"use strict";
	$('.sidebar .nav > .has-sub > a').click(function() {
		var target = $(this).next('.sub-menu');
		var otherMenu = '.sidebar .nav > li.has-sub > .sub-menu';

		if ($('.page-sidebar-minified').length === 0) {
			$(otherMenu).not(target).slideUp(250, function() {
				$(this).closest('li').removeClass('expand');
			});
			$(target).slideToggle(250, function() {
				var targetLi = $(this).closest('li');
				if ($(targetLi).hasClass('expand')) {
					$(targetLi).removeClass('expand');
				} else {
					$(targetLi).addClass('expand');
				}
			});
		}
	});
	$('.sidebar .nav > .has-sub .sub-menu li.has-sub > a').click(function() {
		if ($('.page-sidebar-minified').length === 0) {
			var target = $(this).next('.sub-menu');
			$(target).slideToggle(250);
		}
	});
	$('[data-click="sidebar-toggled"]').live('click', function(e) {
		e.preventDefault();
		
		var targetContainer = '#page-container';
		var targetClass = 'page-sidebar-toggled';
		
		if ($(targetContainer).hasClass(targetClass)) {
			$(targetContainer).removeClass(targetClass);
			$(this).removeClass('active');
		} else {
			$(targetContainer).addClass(targetClass);
			$(this).addClass('active');
		}
	});
};


/* 05. Handle Sidebar Minify Float Menu
------------------------------------------------ */
var floatSubMenuTimeout;
var targetFloatMenu;
var handleMouseoverFloatSubMenu = function(elm) {
	clearTimeout(floatSubMenuTimeout);
};
var handleMouseoutFloatSubMenu = function(elm) {
	floatSubMenuTimeout = setTimeout(function() {
		$('.float-sub-menu').remove();
	}, 250);
};
var handleSidebarMinifyFloatMenu = function() {
	$('.float-sub-menu li.has-sub > a').live('click', function() {
		var target = $(this).next('.sub-menu');
		$(target).slideToggle(250, function() {
			var targetMenu = $('.float-sub-menu');
			var targetHeight = $(targetMenu).height() + 20;
			var targetOffset = $(targetMenu).offset();
			var targetTop = $(targetMenu).attr('data-offset-top');
			var windowHeight = $(window).height();
			if ((windowHeight - targetTop) > targetHeight) {
				$('.float-sub-menu').css({
					'top': targetTop,
					'bottom': 'auto',
					'overflow': 'initial'
				});
			} else {
				$('.float-sub-menu').css({
					'bottom': 0,
					'overflow': 'scroll'
				});
			}
		});
	});
	$('.sidebar .nav > li.has-sub > a').hover(function() {
		if (!$('#page-container').hasClass('page-sidebar-minified')) {
			return;
		}
		clearTimeout(floatSubMenuTimeout);
		
		var targetMenu = $(this).closest('li').find('.sub-menu').first();
		if (targetFloatMenu == this) {
			return false;
		} else {
			targetFloatMenu = this;
		}
		var targetMenuHtml = $(targetMenu).html();
		
		if (targetMenuHtml) {
			var targetHeight = $(targetMenu).height() + 20;
			var targetOffset = $(this).offset();
			var targetTop = targetOffset.top - $(window).scrollTop();
			var targetLeft = (!$('#page-container').hasClass('page-sidebar-right')) ? 60 : 'auto';
			var targetRight = (!$('#page-container').hasClass('page-sidebar-right')) ? 'auto' : 60;
			var windowHeight = $(window).height();
			
			if ($('.float-sub-menu').length == 0) {
				targetMenuHtml = '<ul class="float-sub-menu" data-offset-top="'+ targetTop +'" onmouseover="handleMouseoverFloatSubMenu(this)" onmouseout="handleMouseoutFloatSubMenu(this)">' + targetMenuHtml + '</ul>';
				$('body').append(targetMenuHtml);
			} else {
				$('.float-sub-menu').html(targetMenuHtml);
			}
			if ((windowHeight - targetTop) > targetHeight) {
				$('.float-sub-menu').css({
					'top': targetTop,
					'left': targetLeft,
					'bottom': 'auto',
					'right': targetRight
				});
			} else {
				$('.float-sub-menu').css({
					'bottom': 0,
					'top': 'auto',
					'left': targetLeft,
					'right': targetRight
				});
			}
		} else {
			$('.float-sub-menu').remove();
			targetFloatMenu = '';
		}
	}, function() {
		floatSubMenuTimeout = setTimeout(function() {
			$('.float-sub-menu').remove();
			targetFloatMenu = '';
		}, 250);
	});
}


/* 06. Handle Dropdown Close Option
------------------------------------------------ */
var handleDropdownClose = function() {
	$('[data-dropdown-close="false"]').live('click', function(e) {
		e.stopPropagation();
	});
};


/* 07. Handle App Notification
------------------------------------------------ */
var handleAppNotification = function() {
	$.extend({
		notification: function(data) {
			var title = (data.title) ? data.title : '';
			var content = (data.content) ? data.content : '';
			var icon = (data.icon) ? data.icon : '';
			var iconClass = (data.iconClass) ? data.iconClass : '';
			var img = (data.img) ? data.img : '';
			var imgClass = (data.imgClass) ? data.imgClass : '';
			var closeBtn = (data.closeBtn) ? data.closeBtn : '';
			var closeBtnText = (data.closeBtnText) ? data.closeBtnText : '';
			var btn = (data.btn) ? data.btn : '';
			var btnText = (data.btnText) ? data.btnText : '';
			var btnAttr = (data.btnAttr) ? data.btnAttr : '';
			var btnUrl = (data.btnUrl) ? data.btnUrl : '#';
			var autoclose = (data.autoclose) ? data.autoclose : '';
			var autocloseTime = (data.autocloseTime) ? data.autocloseTime : 5000;
			var customClass = (data.class) ? data.class : '';
			var inverseMode = (data.inverseMode) ? 'page-notification-inverse' : '';
	
			var titleHtml = (title) ? '<h4 class="notification-title">'+ title +'</h4>' : '';
			var contentHtml = (content) ? '<p class="notification-desc">'+ content +'</p>' : '';
			var mediaHtml = (icon) ? '<div class="notification-media"><i class="'+ icon +' '+ iconClass +'"></i></div>' : '';
				mediaHtml = (img) ? '<div class="notification-media"><img src="'+ img +'" class="'+ imgClass +'"></i></div>' : mediaHtml;
			var customBtnHtml = (btn && btnText) ? '<a href="'+ btnUrl +'" '+ btnAttr +'>'+ btnText +'</a>' : '';
			var closeBtnHtml = (closeBtn && closeBtn == 'disabled') ? '' : '<a href="#" data-dismiss="notification">Close</a>';
			var infoHtml = (!titleHtml && !contentHtml) ? '' : '<div class="notification-info">'+ titleHtml + contentHtml +'</div>';
			var btnHtmlClass = (!customBtnHtml && closeBtnHtml || customBtnHtml && !closeBtnHtml) ? 'single-btn' : '';
			var btnHtml = '<div class="notification-btn '+ btnHtmlClass +'">'+ customBtnHtml + closeBtnHtml + '</div>';
			var finalHtml = '<div class="page-notification '+ customClass +' bounceInRight animated '+ inverseMode +'">'+ mediaHtml + infoHtml + btnHtml + '</div>';
	
			if ($('#page-notification-container').length === 0) {
				$('body').append('<div id="page-notification-container" class="page-notification-container"></div>');
			}
			$('#page-notification-container').append(finalHtml);
			if (autoclose) {
				var targetElm = $('#page-notification-container').find('.page-notification').last();
				setTimeout(function() {
					$(targetElm).notification('destroy');
				}, autocloseTime);
			}
		}
	});
	
	$('[data-toggle="notification"]').live('click', function(e) {
		e.preventDefault();
		var data = {
			title: ($(this).attr('data-title')) ? $(this).attr('data-title') : '',
			content: ($(this).attr('data-content')) ? $(this).attr('data-content') : '',
			icon: ($(this).attr('data-icon')) ? $(this).attr('data-icon') : '',
			iconClass: ($(this).attr('data-icon-class')) ? $(this).attr('data-icon-class') : '',
			img: ($(this).attr('data-img')) ? $(this).attr('data-img') : '',
			imgClass: ($(this).attr('data-img-class')) ? $(this).attr('data-img-class') : '',
			btn: ($(this).attr('data-btn')) ? $(this).attr('data-btn') : '',
			btnText: ($(this).attr('data-btn-text')) ? $(this).attr('data-btn-text') : '',
			btnAttr: ($(this).attr('data-btn-attr')) ? $(this).attr('data-btn-attr') : '',
			btnUrl: ($(this).attr('data-btn-url')) ? $(this).attr('data-btn-url') : '',
			autoclose: ($(this).attr('data-autoclose')) ? $(this).attr('data-autoclose') : '',
			autocloseTime: ($(this).attr('data-autoclose-time')) ? $(this).attr('data-autoclose-time') : '',
			customClass: ($(this).attr('data-class')) ? $(this).attr('data-class') : '',
			inverseMode: ($(this).attr('data-inverse-mode')) ? $(this).attr('data-inverse-mode') : '',
		};
		$.notification(data);
	});
	$('[data-dismiss="notification"]').live('click', function(e) {
		e.preventDefault();
		$(this).closest('.page-notification').fadeOut(function() {
			$(this).remove();
		});
	});
}


/* 08. Handle Setting Cookie
------------------------------------------------ */
var handleSettingCookie = function() {
	// Sidebar Inverse Cookie 
	$('#setting_sidebar_inverse').live('change', function() {
		if ($(this).is(':checked')) {
			Cookies.set('sidebar-inverse', 'true');
			$('#sidebar').addClass('sidebar-inverse');
		} else {
			Cookies.set('sidebar-inverse', 'false');
			$('#sidebar').removeClass('sidebar-inverse');
		}
	});
	if (Cookies.get('sidebar-inverse') == 'false') {
		$('#setting_sidebar_inverse').prop('checked', false);
		$('#setting_sidebar_inverse').trigger('change');
	} else {
		$('#setting_sidebar_inverse').prop('checked', true);
		$('#setting_sidebar_inverse').trigger('change');
	}
	
	
	// Sidebar Minify Cookie 
	$('#setting_sidebar_minified').live('change', function() {
		if ($(this).is(':checked')) {
			Cookies.set('sidebar-minified', 'true');
			$('#page-container').addClass('page-sidebar-minified');
		} else {
			Cookies.set('sidebar-minified', 'false');
			$('#page-container').removeClass('page-sidebar-minified');
		}
	});
	if (Cookies.get('sidebar-minified') == 'true') {
		$('#setting_sidebar_minified').prop('checked', true);
		$('#setting_sidebar_minified').trigger('change');
	} else {
		$('#setting_sidebar_minified').prop('checked', false);
		$('#setting_sidebar_minified').trigger('change');
	}
	
	
	// Header Inverse Cookie 
	$('#setting_header_inverse').live('change', function() {
		if ($(this).is(':checked')) {
			Cookies.set('header-inverse', 'true');
			$('#header').removeClass('navbar-default').addClass('navbar-inverse');
		} else {
			Cookies.set('header-inverse', 'false');
			$('#header').removeClass('navbar-inverse').addClass('navbar-default');
		}
	});
	if (Cookies.get('header-inverse') == 'false') {
		$('#setting_header_inverse').prop('checked', false);
		$('#setting_header_inverse').trigger('change');
	} else {
		$('#setting_header_inverse').prop('checked', true);
		$('#setting_header_inverse').trigger('change');
	}
	
	
	// Header Fixed Cookie 
	$('#setting_fixed_header').live('change', function() {
		if ($(this).is(':checked')) {
			Cookies.set('header-fixed', 'true');
			$('#header').addClass('navbar-fixed-top');
			$('#page-container').addClass('page-header-fixed');
		} else {
			if ($('#setting_fixed_sidebar').is(':checked')) {
				alert('Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar.');
				$('#setting_fixed_sidebar').prop('checked', false);
				$('#setting_fixed_sidebar').trigger('change');
			}
			Cookies.set('header-fixed', 'false');
			$('#header').removeClass('navbar-fixed-top');
			$('#page-container').removeClass('page-header-fixed');
		}
	});
	if (Cookies.get('header-fixed') == 'false') {
		$('#setting_fixed_header').prop('checked', false);
		$('#setting_fixed_header').trigger('change');
	} else {
		$('#setting_fixed_header').prop('checked', true);
		$('#setting_fixed_header').trigger('change');
	}
	
	
	// Sidebar Fixed Cookie 
	$('#setting_fixed_sidebar').live('change', function() {
		if ($(this).is(':checked')) {
			if (!$('#setting_fixed_header').is(':checked')) {
				alert('Default Header with Fixed Sidebar option is not supported. Proceed with Fixed Header with Fixed Sidebar.');
				$('#setting_fixed_header').prop('checked', true);
				$('#setting_fixed_header').trigger('change');
			}
			Cookies.set('sidebar-fixed', 'true');
			$('#page-container').addClass('page-sidebar-fixed');
			$('.sidebar [data-scrollbar="true"]').removeAttr('data-init');
			generateSlimScroll($('.sidebar [data-scrollbar="true"]'));
		} else {
			Cookies.set('sidebar-fixed', 'false');
			$('#page-container').removeClass('page-sidebar-fixed');
			
			$('.sidebar [data-scrollbar="true"]').slimScroll({destroy: true});
			$('.sidebar [data-scrollbar="true"]').removeAttr('style');
		}
	});
	if (Cookies.get('sidebar-fixed') == 'false') {
		$('#setting_fixed_sidebar').prop('checked', false);
		$('#setting_fixed_sidebar').trigger('change');
	} else {
		$('#setting_fixed_sidebar').prop('checked', true);
		$('#setting_fixed_sidebar').trigger('change');
	}
};


/* 09. Handle Panel - Remove / Reload / Collapse / Expand
------------------------------------------------ */
var panelActionRunning = false;
var handlePanelAction = function() {
    "use strict";
    
    if (panelActionRunning) {
        return false;
    }
    panelActionRunning = true;
    
    // remove
    $(document).on('hover', '[data-toggle=panel-remove]', function(e) {
        if (!$(this).attr('data-init')) {
            $(this).tooltip({
                title: 'Remove',
                placement: 'bottom',
                trigger: 'hover',
                container: 'body'
            });
            $(this).tooltip('show');
            $(this).attr('data-init', true);
        }
    });
    $(document).on('click', '[data-toggle=panel-remove]', function(e) {
        e.preventDefault();
        $(this).tooltip('destroy');
        $(this).closest('.panel').remove();
    });
    
    // collapse
    $(document).on('hover', '[data-toggle=panel-collapse]', function(e) {
        if (!$(this).attr('data-init')) {
            $(this).tooltip({
                title: 'Collapse / Expand',
                placement: 'bottom',
                trigger: 'hover',
                container: 'body'
            });
            $(this).tooltip('show');
            $(this).attr('data-init', true);
        }
    });
    $(document).on('click', '[data-toggle=panel-collapse]', function(e) {
        e.preventDefault();
        $(this).closest('.panel').find('.panel-body').slideToggle();
    });
    
    // reload
    $(document).on('hover', '[data-toggle=panel-reload]', function(e) {
        if (!$(this).attr('data-init')) {
            $(this).tooltip({
                title: 'Reload',
                placement: 'bottom',
                trigger: 'hover',
                container: 'body'
            });
            $(this).tooltip('show');
            $(this).attr('data-init', true);
        }
    });
    $(document).on('click', '[data-toggle=panel-reload]', function(e) {
        e.preventDefault();
        var target = $(this).closest('.panel');
        if (!$(target).hasClass('panel-loading')) {
            var targetBody = $(target).find('.panel-body');
            var spinnerHtml = '<div class="panel-loading"><div class="spinner"></div></div>';
            $(target).addClass('panel-loading');
            $(targetBody).prepend(spinnerHtml);
            setTimeout(function() {
                $(target).removeClass('panel-loading');
                $(target).find('.panel-loading').remove();
            }, 2000);
        }
    });
    
    // expand
    $(document).on('hover', '[data-toggle=panel-expand]', function(e) {
        if (!$(this).attr('data-init')) {
            $(this).tooltip({
                title: 'Expand / Compress',
                placement: 'bottom',
                trigger: 'hover',
                container: 'body'
            });
            $(this).tooltip('show');
            $(this).attr('data-init', true);
        }
    });
    $(document).on('click', '[data-toggle=panel-expand]', function(e) {
        e.preventDefault();
        var target = $(this).closest('.panel');
        var targetBody = $(target).find('.panel-body');
        var targetTop = 40;
        if ($(targetBody).length !== 0) {
            var targetOffsetTop = $(target).offset().top;
            var targetBodyOffsetTop = $(targetBody).offset().top;
            targetTop = targetBodyOffsetTop - targetOffsetTop;
        }
        
        if ($('body').hasClass('panel-expand') && $(target).hasClass('panel-expand')) {
            $('body, .panel').removeClass('panel-expand');
            $('.panel').removeAttr('style');
            $(targetBody).removeAttr('style');
        } else {
            $('body').addClass('panel-expand');
            $(this).closest('.panel').addClass('panel-expand');
            
            if ($(targetBody).length !== 0 && targetTop != 40) {
                var finalHeight = 40;
                $(target).find(' > *').each(function() {
                    var targetClass = $(this).attr('class');
                    
                    if (targetClass != 'panel-heading' && targetClass != 'panel-body') {
                        finalHeight += $(this).height() + 30;
                    }
                });
                if (finalHeight != 40) {
                    $(targetBody).css('top', finalHeight + 'px');
                }
            }
        }
        $(window).trigger('resize');
    });
};


/* 10. Handle Tooltip & Popover Activation
------------------------------------------------ */
var handelTooltipPopoverActivation = function() {
    "use strict";
    if ($('[data-toggle="tooltip"]').length !== 0) {
        $('[data-toggle=tooltip]').tooltip();
    }
    if ($('[data-toggle="popover"]').length !== 0) {
        $('[data-toggle=popover]').popover();
    }
};


/* 11. Handle Scroll to Top Button Activation
------------------------------------------------ */
var handleScrollToTopButton = function() {
    "use strict";
    $(document).scroll( function() {
        var totalScroll = $(document).scrollTop();

        if (totalScroll >= 200) {
            $('[data-click=scroll-top]').addClass('in');
        } else {
            $('[data-click=scroll-top]').removeClass('in');
        }
    });
    $('.content').scroll( function() {
        var totalScroll = $('.content').scrollTop();

        if (totalScroll >= 200) {
            $('[data-click=scroll-top]').addClass('in');
        } else {
            $('[data-click=scroll-top]').removeClass('in');
        }
    });

    $('[data-click=scroll-top]').click(function(e) {
        e.preventDefault();
        $('html, body, .content').animate({
            scrollTop: $("body").offset().top
        }, 500);
    });
};


/* Application Controller
------------------------------------------------ */
var App = function () {
	"use strict";
	
	return {
		//main function
		init: function () {
		    this.initSidebar();
		    this.initHeader();
		    this.initComponent();
		    this.initCookie();
		},
		initSidebar: function() {
			handleSidebarMinifyFloatMenu();
			handleSidebarMenu();
		},
		initHeader: function() {
			handleHeaderSearchBar();
		},
		initComponent: function() {
			handleSlimScroll();
			handlePanelAction();
			handelTooltipPopoverActivation();
			handleScrollToTopButton();
			handleDropdownClose();
			handleAppNotification();
		},
		initCookie: function() {
			handleSettingCookie();
		},
		scrollTop: function() {
            $('html, body, .content').animate({
                scrollTop: $('body').offset().top
            }, 0);
		}
	};
}();