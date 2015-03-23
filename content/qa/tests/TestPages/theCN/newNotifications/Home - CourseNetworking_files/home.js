define("modules/email-user-password-reset",["jquery","underscore","backbone"],function(e,t,n){return n.Model.extend({urlRoot:"api/email_user_password_reset/"})}),define("text!templates/common/pop-up-window/forgot-password.html",[],function(){return'<div class="head">\r\n	<h4>Forgot Password?</h4>\r\n</div>\r\n<div class="main">\r\n	<div class="center step-one" id="step_one">\r\n		<p>Please enter the email address associated with your CN account.</p>\r\n		<form id="email_form" method="post">\r\n			<table>\r\n				<tr>\r\n					<td>\r\n						<label for="email_input">Account email:</label>\r\n					</td>\r\n					<td>\r\n						<input id="email_input" type="email" name="email" value="" required="required" />\r\n					</td>\r\n				</tr>\r\n				<tr>\r\n					<td></td>\r\n					<td class="button-wrap">\r\n						<button  class="bt bt-blue-2 bt-size-normal" id="submit" type="submit">SEND</button>\r\n<!--						<button class="bt bt-gray cancel" type="button">CANCEL</button>-->\r\n					</td>\r\n				</tr>\r\n			</table>\r\n		</form>\r\n	</div>\r\n</div>'}),define("views/common/pop-up-window/forgot-pasword",["jquery","underscore","backbone","tools/pop-up-window","modules/email-user-password-reset","tools/regs","text!templates/common/pop-up-window/forgot-password.html"],function(e,t,n,i,o,r,a){var s=i.get("function");return i.get("view").extend({className:"block-window-forgot-password pop-up-window",template:a,initialize_:function(){this.model=new o},events:{"click .cancel":"deleted","click #submit":"create"},create:function(){var t=this,n=this.options&&this.options.email?this.options.email:e.trim(this.$("#email_input").val());return r.check("email",n)?(t.model.save({email:n},{resultTrue:function(){var e="An email with a link to reset your password has been sent to ";e+='<a href="mailto:'+n+'">'+n+"</a>.",s.alert(e)}}),!1):(s.alert("Please input correct email address."),!1)}})}),define("text!templates/common/loading/view.html",[],function(){return'<img src="img/com/frontend/loading/horizontal.gif" alt="Loading" />\r\n'}),define("views/common/loading/view",["jquery","underscore","backbone","text!templates/common/loading/view.html"],function(e,t,n,i){return n.View.extend({className:"block-loading block-horizontal-loading",template:i})}),define("text!templates/site/index/login.html",[],function(){return'<form method="post">\n	<table cellspacing="0" colspan="0">\n		<tbody>\n			<tr class="title">\n				<td colspan="3">\n					<span>Have an account? Log in below:</span>\n				</td>\n			</tr>\n			<tr class="body">\n				<td>\n					<input class="username" type="text" name="username" placeholder="Email Address or CN#" required="required" autofocus="autofocus" />\n				</td>\n				<td>\n					<input class="password" type="password" name="password" placeholder="Password" required="required" />\n				</td>\n				<td>\n					<button id="" type="submit" class="bt bt-blue">\n						LOG IN\n					</button>\n				</td>\n			</tr>\n			<tr class="foot">\n				<td>\n					<input class="remember" type="checkbox" {{^not_remember}}checked="checked"{{/not_remember}} name="remember" value="" />\n					<label for="remember">Remember Me</label>\n					<div class="clear"></div>\n				</td>\n				<td>\n					<a class="forgot_password" href="javascript:;">Forgot Password?</a>\n				</td>\n				<td></td>\n			</tr>\n		</tbody>\n	</table>\n</form>\n'}),define("views/site/index/login",["jquery","underscore","backbone","controller","tools/auth-tool","tools/pop-up-window","cnamplify","views/common/pop-up-window/forgot-pasword","views/common/loading/view","text!templates/site/index/login.html"],function(e,t,n,i,o,r,a,s,l,c){var d=r.get("function");return n.View.extend({className:"block-login",template:c,events:{"submit form":"login","click .forgot_password":"loadForgotPasswordWinow"},initialize:function(e){t.bindAll(this,"lockedForm","resetForm");var o=function(){i.go(n.history.getFragment())};t.isObject(e)&&t.isFunction(e.afterLogin)&&(o=e.afterLogin),this.afterLogin=o},serialize:function(){var e=a.cookie.get("cn_remember");return{not_remember:"off"==e}},afterRender:function(){this.form=this.$("form"),this.resetForm()},login:function(){var n=this,i=n.form.data("locked");if("undefined"===e.type(i)||0===i){var r={username:n.$(".username").val(),password:n.$(".password").val(),remember:n.$(".remember:checked").length};this.lockedForm(),o.create(r,function(){n.afterLogin()},function(i){if("undefined"!==e.type(i)){var o="";t.each(i,function(e){o+=e+"<br />"}),d.alert(o)}n.resetForm()})}return!1},lockedForm:function(){var t=this;t.loadingView=new l,e("#wrapper").prepend(t.loadingView.render().view.el),t.form.data({locked:1}),t.form.find("input").prop("disabled",!0),t.form.addClass("locked-form")},resetForm:function(){this.form.data({locked:0}),this.form.find("input").prop("disabled",!1),this.form.removeClass("locked-form"),this.$(".password").val(""),this.loadingView instanceof n.View&&this.loadingView.remove()},loadForgotPasswordWinow:function(){d.open((new s).render().view.el)}})}),define("text!templates/common/foot.html",[],function(){return'<div class="head">\r\n	<div class="web-fixed-width">\r\n		<ul class="l-float">\r\n			<li>\r\n				<a class="text_terms_of_use" href="javascript:;">\r\n					Terms of Use\r\n				</a>\r\n			</li>\r\n			<li>\r\n				<a class="text_privacy_policy" href="javascript:;">\r\n					Privacy Policy\r\n				</a>\r\n			</li>\r\n			<li>\r\n				<a href="mailto:help@theCN.com">\r\n					help@theCN.com\r\n				</a>\r\n			</li>\r\n		</ul>\r\n		<p class="r-float">\r\n			Copyright &copy; 2011-13.  CourseNetworking LLC.  All rights reserved.\r\n		</p>\r\n		<div class="clear"></div>\r\n	</div>\r\n</div>\r\n<div class="foot">\r\n	<div class="web-fixed-width">\r\n		<p class="r-float">\r\n			Rumi: V3.1.6 Beta,  Apr 3, 2013\r\n		</p>\r\n		<div class="clear"></div>\r\n	</div>\r\n</div>'}),define("views/common/foot",["backbone","text!templates/common/foot.html"],function(e,t){return e.View.extend({className:"block-foot",template:t})}),define("text!templates/layout/site.html",[],function(){return'<div class="wrap-web wrap-site">\r\n	<!-- head -->\r\n	<div class="head">\r\n		<div class="box">\r\n			<div class="center web-fixed-width">\r\n				<a class="l-float" href="" title="CourseNetworking">\r\n					<b class="logo text-hide">theCN logo</b>\r\n				</a>\r\n				<div class="r-float" id="block_login_from">\r\n					\r\n				</div>\r\n				<div class="clear"></div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n	<!-- /head -->\r\n	\r\n	<!-- main -->\r\n	<div class="main">\r\n		<div class="center">\r\n            <div id="block_site_main">\r\n                \r\n            </div>\r\n		</div>\r\n        \r\n		<!-- bottom -->\r\n		<div id="block_foot">\r\n			\r\n		</div>\r\n		<!-- /bottom -->\r\n		\r\n	</div>\r\n	<!-- /main -->\r\n</div>'}),define("views/layout/site",["app","views/site/index/login","views/common/foot","text!templates/layout/site.html"],function(e,t,n,i){return e.useLayout({template:i,views:{"#block_login_from":new t,"#block_foot":new n}})}),define("modules/course/course",["jquery","underscore","backbone","tools/string-help"],function(e,t,n,i){return n.Model.extend({urlRoot:"api/course/",defaults:function(){return t.extend({type:"school_based",name:"",country_id:"",school_id:"",level:1,course_category_name:"",start_course_date:"",end_course_date:"",access_setting_id:"open",logo_url:"img/common/avatar/logo/default.png",country:{id:""},user_position:"",school:{url:""},instructors:[],instructional_users:[],user_score:{sub_total:0},create_from:"",tasks:[],allow_mooc:!1,enable_mooc:!1,is_end:!1},this.defaults_())},defaults_:function(){},initDefaults:function(){var n=this,o=["instructor","creater","assistant","coordinator","teaching_assistant","graduate_assistant","external_reviewer","instructional_designer","librarian"],r=n.get("user_score");r=t.extend(r,{display_sub_total:i.addCommas(r.sub_total)});var a={user_score:r},s=this.get("school");t.isString(s.url)&&s.url.length>0&&(s.url="http://"+s.url.replace(/http:\/\//,""));var l=e.inArray(n.get("user_position"),o)>-1,c=this.get("name");return t.extend({display_name:c,access_setting_string:n.displayAccessSetting(n.get("access_setting_id")),school:s,has_task:n.get("tasks").length>0,has_join:n.get("user_position").length>0,has_instructor:n.get("instructors").length>0,display_instructors_string:n.getDisplayInstructorsString(),has_instructional_users:n.get("instructional_users").length>0,can_manager:l,display_user_position:n.displayUserPosition(n.get("user_position")),display_user_position_sentence:n.displayUserPositionSentence(n.get("user_position")),is_open_type:"open"===n.get("access_setting_id"),is_email_type:"email"===n.get("access_setting_id"),is_code_type:"code"===n.get("access_setting_id"),is_no_one_type:"no_one"===n.get("access_setting_id"),is_fee_type:"fee"===n.get("access_setting_id"),is_not_available:!n.get("is_start")&&!n.get("is_end"),has_auth_read:n.get("user_position").length>0||"open"===n.get("access_setting_id"),can_invite:n.get("enable_mooc")||l},a)},getDisplayInstructorsString:function(){var e=this.get("instructors"),t="";if(e.length>0)for(var n in e)t+=e[n].display_name+", ";return t.substr(0,t.lastIndexOf(","))},initDefaults_:function(){},displayUserPosition:function(e){var t={instructor:"Instructor",student:"Student",coordinator:"Course Coordinator",teaching_assistant:"Teaching Assistant",graduate_assistant:"Graduate Assistant",external_reviewer:"External Reviewer",instructional_designer:"Instructional Designer",librarian:"Librarian",observer:"Observer"};return t[e]?t[e]:"Member"},displayUserPositionSentence:function(e){var t={instructor:"You're an Instructor in this Course",student:"You're a Student in this Course",coordinator:"You're a Course Coordinator in this Course",teaching_assistant:"You're a Teaching Assistant in this Course",graduate_assistant:"You're a Graduate Assistant in this Course",external_reviewer:"You're an External Reviewer in this Course",instructional_designer:"You're an Instructional Designer in this Course",librarian:"You're a Librarian in this Course",observer:"You're an Observer in this Course"};return t[e]?t[e]:"You're an Member in this Course"},displayAccessSetting:function(e){var t={code:"PIN",email:"Email request",no_one:"No one",open:"Any CN member"};return t[e]?t[e]:""}})}),define("modules/course/course-number",["jquery","underscore","modules/course/course"],function(e,t,n){return n.extend({urlRoot:"api/course_number/"})}),define("modules/conexus/conexus",["jquery","underscore","backbone","tools/string-help"],function(e,t,n,i){return n.Model.extend({urlRoot:"api/conexus/",defaults:function(){return{name:"",country_id:"",about:"",logo_attachment_id:"",logo_url:"img/common/avatar/conexus/default.png",country:{id:""},user_position:"",moderators:[],user_score:{sub_total:0},is_end:!1,is_open_type:!0}},initDefaults:function(){var n=this,o=["moderator","creater"],r=n.get("user_score");r=t.extend(r,{display_sub_total:i.addCommas(r.sub_total)});var a={user_score:r};return t.extend({display_name:n.get("name"),has_join:n.get("user_position").length>0,has_moderator:n.get("moderators").length>0,can_manager:e.inArray(n.get("user_position"),o)>-1,display_user_position:n.get("user_position").ucfirst(),is_new:n.isNew(),display_user_sub_total:i.addCommas(n.get("user_score").sub_total),display_moderators_string:n.getDisplayModeratorsString()},a)},getDisplayModeratorsString:function(){var e=this.get("moderators"),t="";if(e.length>0)for(var n in e)t+=e[n].display_name+", ";return t.substr(0,t.lastIndexOf(","))},validateFields:function(){var e=[],t=this.validateName();t&&e.push(t);var n=this.validateCountry();return n&&e.push(n),{errors:e,result:!e.length}},validateName:function(){var e=this.get("name");return t.isUndefined(e)||!e.length?"Please input Conexus name.":void 0},validateCountry:function(){var e=this.get("country_id");return t.isUndefined(e)||!e.length?"Please select your country.":void 0}})}),define("modules/conexus/conexus-number",["jquery","underscore","modules/conexus/conexus"],function(e,t,n){return n.extend({urlRoot:"api/conexus_number/"})}),define("modules/user/conexus-user",["jquery","underscore","backbone","tools/string-help"],function(e,t,n,i){return n.Model.extend({urlRoot:"api/conexus_user/",defaults:function(){return{score:{sub_total_seeds:0,sub_total:0}}},initDefaults:function(){var e=this,n=e.get("score");n=t.extend(n,{display_sub_total:i.addCommas(n.sub_total)});var o={score:n};return t.extend({},o)}})}),define("modules/user/course-user",["jquery","underscore","backbone","tools/string-help"],function(e,t,n,i){return n.Model.extend({urlRoot:"api/course_user/",defaults:function(){return{score:{sub_total_seeds:0,sub_total:0}}},initDefaults:function(){var e=this,n=e.get("score");n=t.extend(n,{display_sub_total:i.addCommas(n.sub_total)});var o={score:n};return t.extend({},o)}})}),define("text!templates/common/pop-up-window/login.html",[],function(){return'<div class="head">\n	<h4>Login</h4>\n</div>\n<div class="main">\n    <div class="center _content"></div>\n    {{#data}}\n    <div class="bottom">\n        <div class="body">\n            {{#is_open_type}}\n               <span>You can join the {{text.club}}: {{display_name}}.</span>\n            {{/is_open_type}}\n            \n            {{#is_code_type}}\n                <label for="code_login_join_course">Please enter the PIN for the {{text.club}}({{display_name}}):</label>\n                <input type="password" id="code_login_join_course" />\n            {{/is_code_type}}\n            \n            {{#is_email_type}}\n                <span>The {{text.club}}({{display_name}}) requires an email invitation.</span>\n            {{/is_email_type}}\n            \n            {{#is_no_one_type}}\n                <span>The {{text.club}}({{display_name}}) is not ready.</span>\n            {{/is_no_one_type}}\n        </div>\n    </div>\n    {{/data}}\n</div>\n\n'}),define("views/common/pop-up-window/login",["jquery","underscore","backbone","tools/pop-up-window","views/site/index/login","modules/user/conexus-user","modules/user/course-user","modules/course/course","modules/conexus/conexus","controller","text!templates/common/pop-up-window/login.html"],function(e,t,n,i,o,r,a,s,l,c,d){var u=i.get("function");return i.get("view").extend({className:"pop-up-window block-window-login",template:d,initialize_:function(e){var i=e||{};this.data=!1,this.text={};var o=!1;t.isEmpty(i)||t.isObject(i.param)&&i.param.model instanceof n.Model&&(this.data=i.param.model.toJSON(),i.param.model instanceof s&&(o=new a({id:this.data.id}),this.text.club="Course"),i.param.model instanceof l&&(o=new r({id:this.data.id}),this.text.club="Conexus"));var d=this,m=function(){u.close(),c.go(n.history.getFragment()),o instanceof n.Model&&o.save({user_auth:{value:d.$("#code_login_join_course").val()}})};this.options=i,this.options.afterLogin=i.afterLogin||m},serialize:function(){return{data:this.data,text:this.text}},beforeRender_:function(){this.setViews({"._content":new o(this.options)})}})}),define("text!templates/site/index/register.html",[],function(){return'<div class="head">\n	<div class="block-register-form">\n		<div class="main">\n			<form id="register_form" method="post" action="">\n				<table cellspacing="0" colspan="0">\n                    {{#show_login_link}}\n                    <tr>\n						<td align="center">\n							<a class="load_login_view" href="javascript:;" style="font-size: 1.4em; padding: 10px 0; display: block;">\n                                If you already have a CN account, please sign in.\n                            </a>\n						</td>\n					</tr>\n                    {{/show_login_link}}\n					<tr>\n						<td>\n							<input id="User_fullname" type="text" name="display_name" placeholder="Full Name" required="required" />\n						</td>\n					</tr>\n					<tr>\n						<td>\n							<input id="User_email" class="user_register_field" type="email" name="email" placeholder="Email Address" required="required" value="{{email}}"/>\n						</td>\n					</tr>\n					<tr>\n						<td>\n							<input id="User_password" class="user_register_field" type="password" name="password" placeholder="Password" required="required" />\n						</td>\n					</tr>\n                    {{#show_checkbox_terms_of_use}}\n                    <tr>\n						<td>\n							<div class="wrap-checkbox">\n                                <div class="left l-float">\n                                    <input id="terms_privacy" type="checkbox" required="required" />\n                                    <label for="terms_privacy" style="font-size: 1.4em;">\n                                        I have read and agree to the <a class="text_terms_of_use" href="javascript:;">Terms of Use</a> and the <a class="text_privacy_policy" href="javascript:;">Privacy Policy</a>.\n                                    </label>\n                                </div>\n								<div class="clear"></div>\n							</div>\n						</td>\n					</tr>\n                    {{/show_checkbox_terms_of_use}}\n                    \n					<tr>\n						<td>\n							<div class="wrap-checkbox {{^show_club_fileds}} display-none{{/show_club_fileds}}" style="min-height: 33px;">\n                                <div class="left l-float">\n                                    <input id="register_have_id" type="checkbox" {{#has_club_id}}checked="checked"{{/has_club_id}}/>\n                                    <label for="register_have_id">\n                                        I have a Course or Conexus ID.\n                                    </label>\n                                </div>\n                                <div class="right r-float">\n                                    <div class="id-wrap {{^has_club_id}}display-none{{/has_club_id}}" id="course_or_conexus_input_wrap">\n                                        <input id="course_or_conexus_input" type="text" placeholder="Example: 0010038" {{#has_club_id}}value="{{#course_id}}{{course_id}}{{/course_id}}{{#conexus_id}}{{conexus_id}}{{/conexus_id}}"{{/has_club_id}} />\n                                    </div>\n                                </div>\n								<div class="clear"></div>\n							</div>\n							<div class="club-wrap">\n								<div class="pin-wrap display-none course_code_wrap">\n									<label for="course_code">Create a Course PIN:</label>\n									<input id="course_code" type="password" maxlength="4" />\n									<div class="clear"></div>\n								</div>\n								<div class="error-wrap error_wrap"></div>\n							</div>\n						</td>\n					</tr>\n                    \n					<tr>\n						<td>\n							<div class="r-float">\n								<button class="bt bt-blue" type="submit">\n									SIGN UP\n								</button>\n							</div>\n						</td>\n					</tr>\n				</table>\n			</form>\n		</div>\n	</div>\n</div>\n'}),function(e){e.fn.serializeObject=function(t){t=e.extend({},t);var n=this,i={},o={},r={validate:/^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,key:/[a-zA-Z0-9_]+|(?=\[\])/g,push:/^$/,fixed:/^\d+$/,named:/^[a-zA-Z0-9_]+$/};return this.build=function(e,t,n){return e[t]=n,e},this.push_counter=function(e){return void 0===o[e]&&(o[e]=0),o[e]++},e.each(e(this).serializeArray(),function(){if(r.validate.test(this.name)){for(var t,o=this.name.match(r.key),a=this.value,s=this.name;void 0!==(t=o.pop());)s=s.replace(RegExp("\\["+t+"\\]$"),""),t.match(r.push)?a=n.build([],n.push_counter(s),a):t.match(r.fixed)?a=n.build([],t,a):t.match(r.named)&&(a=n.build({},t,a));i=e.extend(!0,i,a)}}),i}}(jQuery),define("jquerySerializeObject",function(){}),define("views/site/index/register",["jquery","underscore","backbone","tools/auth-tool","tools/regs","tools/pop-up-window","controller","modules/course/course","modules/course/course-number","modules/conexus/conexus","modules/conexus/conexus-number","modules/user/user","views/common/pop-up-window/login","text!templates/site/index/register.html","jquerySerializeObject"],function(e,t,n,i,o,r,a,s,l,c,d,u,m,h){var p=r.get("function");return n.View.extend({className:"block-register-forms-wrap",template:h,events:{"submit #register_form":"save","change .user_register_field":"setFields","change #User_fullname":"setFullname","change #register_have_id":"showClubIdInput","blur #course_or_conexus_input":"checkClubId","change #course_code":"setCourseCode","click .load_login_view":"loadLoginWindow"},initialize:function(e){t.bindAll(this,"checkCourseId","checkConexusId");var o=this;o.viewController={showClubFileds:!0,showCheckboxTermsOfUse:!1},o.afterRegister=function(e,t){var o=e.model;p.alert('<b style="font-size: 1.4em;">Registration successful</b>. <br /><br /> Please check your email ('+o.get("email")+") to verify your CN account.",{autoClose:!1,callback:function(){i.create({username:o.get("cn_number"),password:o.get("password")},function(){"function"==typeof t?t():a.go(n.history.getFragment())},function(){})}})},o.param={},t.isUndefined(e)||(o.extraData=e.extraData||{},o.paramData=e.data||{},o.param=e.param||{},o.viewController=t.extend(o.viewController,e.viewController||{}),t.isFunction(e.afterRegister)&&(o.afterRegister=e.afterRegister)),o.data={},o.relevantData={type:"",value:{id:"",user_auth:{value:""}}}},serialize:function(){var e={};if(t.isUndefined(this.paramData)||t.isEmpty(this.paramData)||(e=this.paramData),this.param.model instanceof n.Model){e=this.param.model.toJSON();var i={model:e};this.param.model instanceof s?i.type="course":this.param.model instanceof c&&(i.type="conexus")}return{email:e.email,conexus_id:e.conexus_id,course_id:e.course_id,has_club_id:e.conexus_id||e.course_id,show_club_fileds:this.viewController.showClubFileds,show_checkbox_terms_of_use:this.viewController.showCheckboxTermsOfUse,show_login_link:this.viewController.showLoginLink,data:i}},afterRender:function(){this.param.model instanceof n.Model&&this.$("#course_or_conexus_input").blur()},showClubIdInput:function(e){var t=this;this.$(e.currentTarget).prop("checked")?(this.$("#course_or_conexus_input_wrap").show("fast"),this.$("#course_or_conexus_input").attr("required","required")):this.$("#course_or_conexus_input_wrap").hide("fast",function(){t.hideCourseCodeWrap(),t.$(".error_wrap").empty(),t.$("#course_or_conexus_input").val("").removeAttr("required")})},checkClubId:function(e){var t=this.$(e.currentTarget),n=t.val();if(!t.data("locked")&&n.length>0){this.hideCourseCodeWrap();var i=function(){t.data("locked",0)};t.data("locked",1),o.check("courseId",n)?this.checkCourseId(n,i):o.check("conexusId",n)?this.checkConexusId(n,i):(this.$(".error_wrap").html("<p>Please enter a valid Course or Conexus ID.</p>"),t.data("locked",0))}},checkCourseId:function(e,n){var i=this,o=new l({id:e});o.fetch({resultTrue:function(e,t){i.relevantData.type="course",i.relevantData.value.id=t.data.id;var n="",o=e.get("access_setting_id"),r=e.get("course_id");"open"===o||("email"===o?n="The Course(#CID "+r+") requires an email invitation.":"code"===o?(i.showCourseCodeWrap(),n="Please enter the PIN for the Course(#CID "+r+")."):"no_one"===o?n="The Course(#CID "+r+") is not ready.":"fee"===o&&(n="The Course(#CID "+r+") "+r+" must be fee.")),i.$(".error_wrap").html("<p>"+n+"</p>")},resultFalse:function(){i.$(".error_wrap").html("<p>This Course does not exist.</p>")},completeCallback:function(){t.isFunction(n)&&n()}})},checkConexusId:function(e,n){var i=this,o=new d({id:e});o.fetch({resultTrue:function(e,t){i.relevantData.type="conexus",i.relevantData.value.id=t.data.id,i.$(".error_wrap").html("<p>You can join the Conexus "+t.data.conexus_id+".</p>")},resultFalse:function(){i.$(".error_wrap").html("<p>Conexus is not exsit.</p>")},completeCallback:function(){t.isFunction(n)&&n()}})},setCourseCode:function(t){this.relevantData.value.user_auth.value=e.trim(this.$(t.currentTarget).val())},save:function(){var i=this,o=function(){a.go(n.history.getFragment())};if(i.data=i.$("#register_form").serializeObject(),this.setFullname(),this.$("#register_form").attr("locked"))return!1;this.$("#register_form").attr("locked",!0),i.model=new u;var r={};i.extraData&&(r=e.extend(!0,{},r,i.extraData)),i.relevantData.type.length>0&&(r[i.relevantData.type]=i.relevantData.value);var l=i.$("#User_email").val();t.isUndefined(i.paramData)||(t.has(i.paramData,"email")&&t.has(i.paramData,"invited_by_user_id")&&(r=t.extend(r,{email:l,invited_by_user_id:i.paramData.invited_by_user_id})),t.has(i.paramData,"course_id")&&t.has(i.paramData,"email_id")&&(r=t.extend(r,{email:l,course:{id:i.paramData.course_id,invite_email_id:i.paramData.email_id}}),o=function(){var e=new s({id:i.paramData.course_id});e.fetch({resultTrue:function(e){a.go(e.get("course_id"))},resultFalse:function(){a.go(n.history.getFragment())}})}),t.has(i.paramData,"conexus_id")&&t.has(i.paramData,"email_id")&&(r=t.extend(r,{email:l,conexus:{id:i.paramData.conexus_id,invite_email_id:i.paramData.email_id}}),o=function(){var e=new c({id:i.paramData.conexus_id});e.fetch({resultTrue:function(e){a.go(e.get("conexus_id"))},resultFalse:function(){a.go(n.history.getFragment())}})})),i.model.set(t.extend(i.data,r),{silent:!0});var d=i.model.validateRegister();if(d.result)i.model.save({},{resultTrue:function(){i.resetForm(),i.afterRegister(i,o)},resultFalse:function(e){var n="";t.each(e,function(e){n+=e+"<br />"}),p.alert(n,{autoClose:!1,title:"Alert",closeButton:!0})},completeCallback:function(){i.$("#register_form").removeAttr("locked")}});else{var m="";t.each(d.errors,function(e){m+=e+"<br />"}),p.alert(m,{autoClose:!1,title:"Alert",closeButton:!0}),i.$("#register_form").removeAttr("locked")}return!1},resetForm:function(){var t=this;this.$("#register_form *[name]").each(function(){e(this).val("")}),this.$("#course_or_conexus_input_wrap").hide("fast",function(){t.$("#course_or_conexus_input").val("")}),this.$(".error_wrap").empty(),this.$("#register_have_id").prop("checked",!1),this.hideCourseCodeWrap()},setFields:function(e){var n=this,i=n.$(e.currentTarget),o={};o[i.attr("name")]=i.val(),n.data=t.extend(n.data,o)},setFullname:function(){var n=this,i=n.$("#User_fullname").val(),o=e.trim(i).split(" "),r=[];for(var a in o)""!=o[a]&&r.push(o[a]);var s=r[0],l=r.slice(-1)[0],c="";e(r).each(function(e){c+=r[e].ucfirst()+" "});var d={fullname:c,first_name:s,last_name:l};n.data=t.extend(n.data,d)},showCourseCodeWrap:function(){var e=this;this.$(".course_code_wrap").show("fast",function(){e.$("#course_code").attr("required","required")})},hideCourseCodeWrap:function(){var e=this;this.$(".course_code_wrap").hide("fast",function(){e.$("#course_code").val("").removeAttr("required")})},loadLoginWindow:function(){var e=this;p.open(new m({param:{model:e.param.model}}).render().view.el)}})}),define("text!templates/text/about-cn.html",[],function(){return'<div class="head">\r\n    <h4>About theCN.com</h4>\r\n</div>\r\n<div class="main" style="width:520px;">\r\n	<div class="block-language-title">\r\n		<div class="language-title-english language-title-item language-item-on _title">\r\n            English\r\n        </div>\r\n		<div class="language-title-chinese language-title-item _title">\r\n            Chinese\r\n        </div>\r\n		<div class="language-title-spanish language-title-item _title">\r\n            Spanish\r\n        </div>\r\n		<div class="language-title-french language-title-item _title">\r\n            French\r\n        </div>\r\n	</div>\r\n	<div class="center">\r\n		<div class="box _box display-none" style="display:block;">\r\n			<ul>\r\n				<li>\r\n                    <strong>• Students and Instructors: </strong> Create web sites for your courses—credit, open enrollment, or informal courses.  Invite classmates to join. Once you put your classes on CN, you will be connected with others taking similar courses all around the world.  Use CN along with your existing course management system to connect easily and quickly with learners who share your interests globally.\r\n                </li>\r\n				<li>\r\n                    <strong>• Not a Student or an Instructor? </strong> Join a growing number of learning communities and discussion groups (called CN Conexus), throughout the world based on subjects of your interest.  Join one or more CN Conexus.\r\n                 </li>\r\n			</ul>\r\n			<div>TheCN is a different product and fills a different niche in the educational landscape—and it has a different business model.  Unlike most learning technologies, it is free to users and is based on principles of social networking designed to help students and faculty connect globally with other learners interested in the same course subject or topic--both in the credit and noncredit arenas.  Because it is free (no license) and easy to use, it is a wonderful complement to course management systems like Blackboard, Sakai, Epsilen, Moodle, D2L, and other Learning Management Systems. </div>\r\n			<p><a href="http://www.coursenetworking.com" target="_blank">Click here to learn more about CourseNetworking, LLC.</a></p>\r\n		</div>\r\n		<div class="box _box display-none">\r\n			<ul>\r\n				<li><strong>• 学生和教师： </strong> 为您的课程创建网站---学分式课程，公开报名式课程， 或非正式课程。邀请同学加入。将课程放到CN后， 您将可以与世界各地修类似课程的同学和教师相连接。用CN和您现有的课程管理系统轻松快速地与全世界兴趣相同的学习者连接。</li>\r\n				<li><strong>• 非学生或者教师？ </strong> 根据课程兴趣加入日益增加的国际学习社区和讨论小组。 加入一个或多个CN Conexus。</li>\r\n				<li>CN 的与众不同之处在于它用一种全新的商业模式填补了教育领域的空缺。不同于大多数收费学习软件，该产品免费向用户开放，以社交原则为基础，旨在帮助有着类似专业兴趣、来自世界各地的学生和教师建立一个学习交流平台。由于该产品供免费使用（无需证书）、方法简单，所以是对其他课程学习系统如Blackboard, Sakai, Epsilen, Moodle, D2L等的一个完美补充。</li>\r\n			</ul>\r\n			<p class="index-about-box-body-bottom"><a href="http://www.coursenetworking.com" target="_blank">请点击这里了解更多关于CourseNetworking，LLC。</a></p>\r\n		</div>\r\n		<div class="box _box display-none">\r\n			<ul>\r\n				<li><strong>• Estudiantes y Intructores: </strong> Crear sitios web para sus cursos—crédito, inscripción abierta, o cursos informales.  Invita tus compañieros de clase para unirse. Cuando ponga sus clases en CN, estaras connectado con otras personas tomando cursos similares en todo el mundo.Utilice CN junto con su gestión de cursos existentes para conecta facíl y rápidamente con los alumnos que compartan sus intereses global.</li>\r\n				<li><strong>• No es un Estudiante o Instructor? </strong> Unirse a un comunidad de aprendezaje y grupos de disscusion (llamado CN Conexus), en todo el mundo sobre la base de los sujetos de que los interese.  Unirse a uno o más CN Conexus.</li>\r\n			</ul>\r\n			<div>theCN es un producto diferente y llena un nicho diferente en la panorma eductivo—y tiene un model de negocio diferente. A diferencia de la mayoría de las tecnologías de aprendezaje, es gratis para los usarios y se base en los pricipos de redes sociales diseñado para ayudar a los estudiantes y la facultad conectarse globalmente con otros estudiantes interesados en el mismo curso o tema—ambos en estudios de crédito o no crédito.  Por ser gratis (sin licencia) y es facílde usar, es un excelente complemeto a los sistemas de gestión de cursos como Blackboard, Sakai, Epsilen, Moodle, D2L, y otros systemas de gestión de apendizaje</div>\r\n			<p class="index-about-box-body-bottom"><a href="http://www.coursenetworking.com" target="_blank">Haga clic aquí para obtener más información sobre CourseNetworking, LLC.</a></p>\r\n		</div>\r\n		<div class="box _box display-none">\r\n			<ul>\r\n				<li><strong>• Etudiants et  instructeurs: </strong> Créer des sites Web pour vos cours-crédits, inscription ouverte, ou les cours informels. Inviter des camarades de classe à rejoindre. Une fois que vous mettez vos classes sur le CN, vous serez connecté à d’autres prenant des cours similaires à travers le monde entier. Utiliser le CN avec votre système de gestion de cours existant de sorte  à vous connecter facilement et rapidement avec ceux en phase d’apprentissage  à travers le monde partageant vos centres d’intérêts.</li>\r\n				<li><strong>• Pas un étudiant ou un instructeur? </strong> Rejoindre un nombre croissant de communautés d\'apprentissage et de groupes de discussions (appelés CN Conexus) à travers le monde basés sur des sujets vous intéressant. Rejoindre un ou plusieurs CN Conexus.</li>\r\n			</ul>\r\n			<div>Le CN est un produit différent et occupe un créneau différent dans le paysage éducatif- et il a un modèle d\'affaires différent. Contrairement à la plupart des technologies d\'apprentissage, il est gratuit pour les utilisateurs et est basé sur les principes de réseautage social conçue pour aider les étudiants et les professeurs à se connecter au niveau mondial avec d\'autres en phase d’apprentissage intéressés par le même sujet ou la même problématique-, tant dans la sphère des matières à crédits que celle des matières sans credit. Parce qu\'il est gratuit (sans licence) et facile à utiliser, il est un excellent complément aux systèmes de gestion de cours à l’instar de Blackboard, Sakai, Epsilen, Moodle, D2L, et d\'autres systèmes de gestion d\'apprentissage.</div>\r\n			<p class="index-about-box-body-bottom"><a href="http://www.coursenetworking.com" target="_blank">Cliquez ici pour en savoir plus sur CourseNetworking, LLC.</a></p>\r\n		</div>\r\n	</div>\r\n</div>'
}),define("views/text/about-cn",["jquery","underscore","backbone","tools/pop-up-window","text!templates/text/about-cn.html"],function(e,t,n,i,o){return i.get("view").extend({className:"pop-up-window block-window-about-cn",template:o,afterRender_:function(){this.switchTab("._title","._box","language-item-on")},switchTab:function(t,n,i){var o=this;return 0==o.$(t).length?!1:(i=i?i:"",o.$(t).each(function(r){e(this).click(function(){return o.$(t).length!=o.$(n).length||0==o.$(n).length?!1:(""!=i&&e(this).addClass(i).siblings().removeClass(i),o.$(n).hide().eq(r).fadeIn(),void 0)})}),void 0)}})}),define("text!templates/site/index/map.html",[],function(){return'\n	<div class="head">\n		<a class="text_about_cn" href="javascript:;">\n			About theCN.com\n		</a>\n	</div>\n	<div class="main">\n		<img src="img/com/bg/map.png" alt="theCN world map" />\n	</div>\n<!--	<div class="foot horizontal-center">\n		<a class="l-float text-hide bt-app bt-app-ios" href="https://itunes.apple.com/app/thecn/id531484941?mt=8" target="_blank">\n			Available on the App Store\n		</a>\n		<a class="r-float text-hide bt-app bt-app-androld" href="https://play.google.com/store/apps/details?id=coursenetworking.app&feature=search_result#?t=W251bGwsMSwxLDEsImNvdXJzZW5ldHdvcmtpbmcuYXBwIl0" target="_blank">\n			Androld app on Google play\n		</a>\n		<div class="clear"></div>\n	</div>-->\n'}),define("views/site/index/map",["jquery","underscore","backbone","tools/pop-up-window","views/text/about-cn","text!templates/site/index/map.html"],function(e,t,n,i,o,r){return n.View.extend({className:"block-map",template:r,events:{"click .text_about_cn":"loadTextAboutCn"},loadTextAboutCn:function(){i.get("function").open((new o).render().view.el)}})}),define("text!templates/site/index/main.html",[],function(){return'<div class="left l-float">\n    <div id="block_site_map">\n\n    </div>\n</div>\n<div class="right r-float">\n    <div class="block-register-wrap">\n        <h2>Create CN Account</h2>\n        <div id="block_register_from">\n        \n        </div>\n        <div class="block-register-connect">\n            <h2>Or Create Your CN Account Through:</h2>\n            <ul>\n                <li class="l-float">\n                    <a class="text-hide bt-connect bt-connect-facebook show_facebook_register" href="javascript:;">\n                        facebook\n                    </a>\n                </li>\n                <li class="l-float">\n                    <a class="text-hide bt-connect bt-connect-twitter show_twitter_register" href="javascript:;">\n                        twitter\n                    </a>\n                </li>\n            </ul>\n        </div>\n    </div>\n</div>\n<div class="clear"></div>'}),define("views/site/index/main",["jquery","underscore","backbone","views/site/index/register","views/site/index/map","text!templates/site/index/main.html"],function(e,t,n,i,o,r){return n.View.extend({className:"main-site web-fixed-width",template:r,initialize:function(e){this.setViews({"#block_register_from":new i(e),"#block_site_map":new o})}})}),define("views/site/index/home",["views/layout/site","views/site/index/main"],function(e,t){return function(n){e.setViews({"#block_site_main":new t(n)}).render()}});