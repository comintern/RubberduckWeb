define(["designer/util/util.instances","designer/util/util.model","jquery","wsbcore/helper"],function(e,t,s,i){function r(e,s){this.$element=e,this.model=new t(s),this.mode=this.model.get("mode"),this.subscriptions=[],this.hasError=!1,this.i18N=this.model.get("i18N"),this.init()}var a="wsb-social-twitter",o=!1;i.require(["js!//platform.twitter.com/widgets"],s.noop,function(){o=!0}),r.prototype={init:function(){var e=this;if(this.$header=s("."+a+"-header",this.$element),this.$feed=s("."+a+"-feed",this.$element),this.$ul=s("ul",this.$feed),this.$footer=s("."+a+"-footer",this.$element),this.model.isKO){var t=function(){e.refresh()},i=this.mutatorViewModel=this.model.get("mutatorViewModel",!0);if(i)for(var r in i)this.model.ko.isObservable(i[r])&&this.subscriptions.push(i[r].subscribe(t))}if(!window.twttr){var o={_e:[],ready:function(e){o._e.push(e)}};window.twttr=o}"designer"===this.mode?require(["wsbcore/overlay"],function(){e.refresh()}):this.refresh()},refresh:function(){var e,t=this;if(this.$ul.empty(),this.$header.children().not("."+a+"-title").remove(),s("."+a+"-title",this.$header).text(""),"designer"===this.mode){if(this.$element.sfMsgOverlay({message:this.i18N.resources.Loading}),!this.model.get("isAuthorized"))return this.onError();if(e=this.getData(),!e)return this.onError()}else if(e=this.getData(),!e)return this.destroy();s.ajax({url:this.model.get("ajaxUrl"),data:e,cache:!1,dataType:"json",success:function(e){e&&"success"===e.status?t.onSuccess(e.data):t.onError(e)},error:function(){t.onError()}}),this.updateDisplay()},updateDisplay:function(e){if(("designer"!==this.mode||this.$element.first().is(":visible"))&&(this.$feed.height(this.$element.height()-this.$header.outerHeight(!0)-this.$footer.outerHeight(!0)),"designer"===this.mode))if(this.$overlay&&this.$overlay.length||(this.$overlay=s("<div/>").addClass(a+"-overlay").appendTo(this.$element)),this.$overlay.css({filter:"alpha(opacity = 0)","background-color":"transparent"}).children().remove(),this.hasError||e){var t=this;this.hasError=!0,this.$element.addClass("hasError").sfMsgOverlay({message:null,style:null}),this.$connectButton||(this.$connectButton=s("<div/>").addClass("social-authorization").append(s("<div/>").addClass("wsb-twitter-yikes").html(this.i18N.resources.Yikes)).append(s("<span/>").addClass("social-btn-twitter social-btn-connect").append(s("<i/>").addClass("icon-wsb-white icon-twitter")).append(this.i18N.resources.Social__Twitter__ConnectToTwitter)).append(s("<div/>").addClass("social-authorization-message").html(this.i18N.resources.Social__Twitter__MustAuthorize)));var i=this.$connectButton.clone().appendTo(this.$overlay);e&&e.constructor===String&&s(".social-authorization-message",i).prepend(s("<p/>").addClass("social-error").text(e)),i.css("top",(this.$overlay.height()-i.outerHeight())/2).find(".social-btn-twitter").bind("click",function(){t.mutatorViewModel.openAuthWindow()})}else this.$element.removeClass("hasError")},getData:function(){var e=0===this.model.get("TwitterFeedType")?"user":"search",t=this.model.get("TwitterTweetCount"),s={};switch(this.mode){case"designer":case"preview":case"mobilepreview":if(s={websiteId:this.model.get("websiteId"),count:t},"user"===e){if(s.username=this.model.get("TwitterUsername"),!s.username)return!1}else if(s.query=this.model.get("TwitterSearchTerm"),!s.query)return!1;break;case"publish":case"mobilepublish":s={action:e,options:{value:this.model.get("user"===e?"TwitterUsername":"TwitterSearchTerm"),limit:t}}}return s},onSuccess:function(e){var t=s.isArray(e)?e:e.statuses;this.createButtons();for(var i in t)this.createTweet(t[i]);"designer"===this.mode&&(this.mutatorViewModel.toggleButton(!0),this.$element.sfMsgOverlay({message:null}))},onError:function(e){if("designer"===this.mode)switch(this.mutatorViewModel.toggleButton(!1),parseInt(e&&e.code?e.code:0)){case 401:this.mutatorViewModel.removeAuth(),this.updateDisplay(this.i18N.resources.Social__Twitter__PleaseReconnect);break;case 403:case 429:case 500:case 502:case 503:case 504:this.mutatorViewModel.removeAuth(),this.updateDisplay(this.i18N.resources.Social__Twitter__ErrorConnecting);break;case 400:case 404:case 406:this.$element.sfMsgOverlay({message:this.i18N.resources.Social__Twitter__InvalidRequest,style:null}),this.hasError=!1,this.updateDisplay();break;default:this.model.get("isAuthorized")?this.$element.sfMsgOverlay({message:null,style:null}):this.hasError=!0,this.updateDisplay()}else this.destroy()},createTweet:function(e){var t=s("<li/>").appendTo(this.$ul),i=this.normalizeFeed(e);t.append(s("<a/>").addClass("tweet-time").attr({href:i.feedUrl,target:"_blank"}).append(s("<time/>").attr("title",i.timePosted).text(i.timeString))),t.append(s("<div/>").addClass("tweet-author").append(s("<a/>").attr({href:i.profileUrl,target:"_blank"}).append(s("<img/>").addClass("tweet-avatar").attr("src",i.profileImg)).append(s("<span/>").addClass("tweet-user").append(s("<span/>").text(i.userName))).append(s("<span/>").addClass("tweet-nick").text("@").append(s("<span/>").text(i.screenName))))),t.append(s("<div/>").addClass("tweet-text").append(i.$tweet))},createButtons:function(){if(this.$header.find(".twitter-share-button").remove(),s("<a/>").addClass("twitter-share-button").attr({href:"https://twitter.com/share","data-text":this.i18N.resources.Social__Twitter__CheckOutSite,"data-count":"none"}).text("Tweet").css("margin-bottom",5).appendTo(this.$header),0===this.model.get("TwitterFeedType")){this.$header.find(".twitter-follow-button").remove();var e=this.model.get("TwitterUsername");s("<a/>").addClass("twitter-follow-button").attr({href:"https://twitter.com/"+e,"data-show-count":"false"}).text(this.i18N.resources.Social__Twitter__Follow.sfFormat("@"+e)).appendTo(this.$header),s("."+a+"-title",this.$header).text("@"+e)}if(o)this.hasError=!1,this.updateDisplay();else{var t=this;window.twttr.ready(function(){window.twttr.widgets.load(),t.hasError=!1,t.updateDisplay()})}},normalizeFeed:function(e){var t=Boolean(location.protocol.match(/https/)),i=e.retweeted_status,r=null;i&&(r=e,e=e.retweeted_status);var a=this.formatTweet(e),o=s("<p/>").html(a.tweet);if(a.media.length){var n=s("<div/>").addClass("tweet-media");for(var l in a.media){var h=a.media[l];n.append(s("<a/>").addClass("tweet-media-link").attr({href:h.url,title:h.expanded_url,target:"_blank"}).append(s("<img/>").attr("src",(t?h.media_url_https:h.media_url)+":thumb")))}o.after(n)}i&&r&&o.after(s("<div/>").addClass("tweet-retweet").text(this.i18N.resources.Client__Retweeted_by+" ").append(s("<a/>").attr({title:this.i18N.resources.Social__Twitter__OnTwitter.sfFormat("@"+r.user.screen_name),href:"https://twitter.com/"+r.user.screen_name,target:"_blank"}).text(r.user.name)));var d=e.user.screen_name,u="https://twitter.com/"+d;return{userName:e.user.name,screenName:d,profileUrl:u,profileImg:e.user.profile_image_url.replace(/^https+\:/,""),feedUrl:u+"/statuses/"+e.id_str,timePosted:this.i18N.resources.Client__Time_posted.sfFormat(this.formatTimeStamp(e.created_at)),timeString:this.formatTimeText(e.created_at),$tweet:o}},getDate:function(e){return new Date(/msie|trident/i.test(navigator.userAgent)?e.replace(/( \+)/," UTC$1"):e)},formatTweet:function(e){var t=function(e){var t=[];for(var s in e.entities){var i=e.entities[s];if(i.length)for(var r in i.reverse()){var a=i[r].indices[0],o={type:s,obj:i[r]};if(t.length){if(a>t[0].obj.indices[0])t.unshift(o);else if(1===t.length||a<t[t.length-1].obj.indices[0])t.push(o);else for(var n in t)if(a>t[n].obj.indices[0]){t.splice(n,0,o);break}}else t.push(o)}}return t},s=t(e),i=e.text,r=[];if(s.length)for(var a in s){var o=s[a];switch(o.type){case"hashtags":i=i.substring(0,o.obj.indices[0])+i.substring(o.obj.indices[0]).replace("#"+o.obj.text,'<a class="tweet-hash" title="'+this.i18N.resources.Client__Search_on_Twitter.sfFormat(o.obj.text)+'" href="https://twitter.com/search?q=%23'+encodeURIComponent(o.obj.text)+'&src=hash" target="_blank">#<span>'+o.obj.text+"</span></a>","i");break;case"user_mentions":i=i.substring(0,o.obj.indices[0])+i.substring(o.obj.indices[0]).replace("@"+o.obj.screen_name,'<a class="tweet-mention" title="@'+o.obj.name+' on Twitter" href="https://twitter.com/'+o.obj.screen_name+'" target="_blank">@<span>'+o.obj.screen_name+"</span></a>","i");break;case"media":"photo"===o.obj.type&&r.push(o.obj);case"urls":i=i.substring(0,o.obj.indices[0])+i.substring(o.obj.indices[0]).replace(o.obj.url,'<a class="tweet-'+("media"===o.type?"media-link":"link")+'" title="'+o.obj.expanded_url+'" href="'+o.obj.url+'" target="_blank">'+o.obj.display_url+"</a>","i")}}return{tweet:i,media:r}},formatTimeStamp:function(e){return this.getDate(e).toLocaleString()},formatTimeText:function(e){var t=this.i18N.abbreviatedMonthNames,s=this.getDate(e),i=new Date-s,r=1e3,a=60*r,o=60*a,n=24*o;if(!isNaN(i)&&i>=0){if(2*r>i)return this.i18N.resources.Client__now;if(a>i)return Math.floor(i/r)+"s";if(o>i)return Math.floor(i/a)+"m";if(n>i)return Math.floor(i/o)+"h";if(i>n&&2*n>i)return this.i18N.resources.Client__yesterday;if(365*n>i)return("0"+s.getDate()).slice(-2)+" "+t[s.getMonth()]}return("0"+s.getDate()).slice(-2)+" "+t[s.getMonth()]+" "+s.getFullYear()},destroy:function(){for(var e in this.subscriptions)this.subscriptions[e].dispose();n.destroy(this.$element),this.$element.remove()}};var n=new e(a,r);return{render:function(e,t){var s=n.get(e);return s?s.refresh():s=n.create(e,t),s},destroy:function(e){var t=n.get(e);return t?(n.destroy(e),!0):!1}}});
//# sourceMappingURL=social.twitter.js.map