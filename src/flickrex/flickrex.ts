/// <reference path="../../typings/jquery.d.ts" />

module com.drikin.FlickrEx {
    declare var window: any;

    interface FlickrURLObj {
        node: any;
        url_string: string;
        farm_id: string;
        server_id: string;
        id: string;
        secret: string;
        size: string;
        file_ext: string;
    }

    export class Base {
        api_key:  string = "18c9f79a96fd34c3b3f16a93fb0a5d3c"; // default key
        api_type: string = "json&nojsoncallback=1"; // only support json format
        base_url: string = "https://api.flickr.com/services/rest/?";

        constructor() {
            if (window.FLICKREX_API_KEY !== undefined) {
                this.api_key = window.FLICKREX_API_KEY;
                delete window.FLICKREX_API_KEY;
            }
            this.base_url = this.appendURLParams({api_key: this.api_key});
            this.base_url = this.appendURLParams({format: this.api_type});
        }

        private appendURLParams(params): string {
            var return_url = this.base_url;
            for (var key in params) {
                return_url += "&" + key + "=" + params[key];
            }
            return return_url;
        }

        private getJsonResult(request_url: string, callback) {
            jQuery.ajax(request_url, {
                success: (data)=> {
                    callback(data);
                },
                dataType: 'json',
            });
        }

        private parseFlickrImageURL(node: any): FlickrURLObj { // {{{
            var url_string = jQuery(node).attr('data-original') || jQuery(node).attr('data-lazy-src') || jQuery(node).attr('src');
            var url_elems = url_string.split('/');
            var host_name = url_elems[2];
            // workaround for c<num> based url e.g. http://c<num>.staticflickr.com/{farm-id}/{server-id}/{id}_{secret}.jpg
            if (host_name.match(/^c/)) {
                var farm_id = url_elems[3];
                var server_id = url_elems[4];
                var url_last_components = url_elems[5].split('_');
            } else {
                var farm_id = host_name.split('.').slice(0, 1)[0].replace('farm', '');
                var server_id = url_elems[3];
                var url_last_components = url_elems[4].split('_');
            }
            var id = url_last_components.slice(0, 1)[0];
            var secret = url_last_components.slice(1, 2)[0];
            var secret = url_last_components.slice(1, 2)[0];
            var size_info = url_last_components.slice(2, 3);
            if (size_info.length) {
                var size = size_info.length&&size_info[0].split('.').slice(0, 1)[0];
            } else {
                var size = '';
            }
            var file_ext = url_elems.slice(-1)[0].split('.').slice(-1)[0];

            var obj = {
                node:node,
                url_string: url_string,
                farm_id: farm_id,
                server_id: server_id,
                id: id,
                secret: secret,
                size: size,
                file_ext: file_ext
            };
            //console.log(node);
            return obj;
        } // }}}

        public getAllFlickrImageObjects(jquery_selector: string = 'img') {
            var imgs = jQuery(jquery_selector).filter(function(idx) {
                var src_str = jQuery(this).attr('src');
                var original_str = jQuery(this).attr('data-original');
                var lazy_src_str = jQuery(this).attr('data-lazy-src');
                return ( src_str&&src_str.match(/static.?flickr.com/) || original_str&&original_str.match(/static.?flickr.com/) || lazy_src_str&&lazy_src_str.match(/static.?flickr.com/) );
            });
            var objs = [];
            for (var i = 0, l = imgs.length; i < l; i++) {
                objs.push(this.parseFlickrImageURL(imgs[i]));
            }
            return objs;
        }

        public getExif(photo_id: string, callback: any): void {
            var request_url = this.appendURLParams({
                method: "flickr.photos.getExif",
                photo_id: photo_id
            });
            this.getJsonResult(request_url, callback);
        }

        public getRecentURL(callback: any): void {
            var request_url = this.appendURLParams({method: "flickr.photos.getRecent"});
            this.getJsonResult(request_url, callback);
        }

    }
}

