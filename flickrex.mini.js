var com;
(function(d){d=d.drikin||(d.drikin={});d=d.FlickrEx||(d.FlickrEx={});var e=function(){this.api_key="18c9f79a96fd34c3b3f16a93fb0a5d3c";this.api_type="json&nojsoncallback=1";this.base_url="http://api.flickr.com/services/rest/?";void 0!==window.FLICKR_API_KEY&&(this.api_key=window.FLICKR_API_KEY,delete window.FLICKR_API_KEY);this.base_url=this.appendURLParams({api_key:this.api_key});this.base_url=this.appendURLParams({format:this.api_type})};e.prototype.appendURLParams=function(c){var b=this.base_url,a;
for(a in c)b+="&"+a+"="+c[a];return b};e.prototype.getJsonResult=function(c,b){jQuery.ajax(c,{success:function(a){b(a)},dataType:"json"})};e.prototype.parseFlickrImageURL=function(c){var b=$(c).attr("src"),a=b.split("/"),d=a[2].split(".").slice(0,1)[0].replace("farm",""),e=a[3],f=a[4].split("_"),h=f.slice(0,1)[0],g=f.slice(1,2)[0],g=f.slice(1,2)[0],f=f.slice(2,3)[0].split(".").slice(0,1)[0],a=a.slice(-1)[0].split(".").slice(-1)[0];return{node:c,url_string:b,farm_id:d,server_id:e,id:h,secret:g,size:f,
file_ext:a}};e.prototype.getAllFlickrImageObjects=function(){for(var c=jQuery("img").filter(function(){return $(this).attr("src").match(/staticflickr.com/)}),b=[],a=0,d=c.length;a<d;a++)b.push(this.parseFlickrImageURL(c[a]));return b};e.prototype.getExif=function(c,b){var a=this.appendURLParams({method:"flickr.photos.getExif",photo_id:c});this.getJsonResult(a,b)};e.prototype.getRecentURL=function(c){var b=this.appendURLParams({method:"flickr.photos.getRecent"});this.getJsonResult(b,c)};d.Base=e})(com||
(com={}));