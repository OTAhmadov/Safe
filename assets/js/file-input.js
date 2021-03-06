/* ===========================================================
 * File input plugin
 * ========================================================== */
+function (c) {
    var b = window.navigator.appName == "Microsoft Internet Explorer";
    var a = function (f, e) {
        this.$element = c(f);
        this.$input = this.$element.find(":file");
        if (this.$input.length === 0) {
            return
        }
        this.name = this.$input.attr("name") || e.name;
        this.$hidden = this.$element.find('input[type=hidden][name="' + this.name + '"]');
        if (this.$hidden.length === 0) {
            this.$hidden = c('<input type="hidden" />');
            this.$element.prepend(this.$hidden)
        }
        this.$preview = this.$element.find(".fileinput-preview");
        var d = this.$preview.css("height");
        if (this.$preview.css("display") != "inline" && d != "0px" && d != "none") {
            this.$preview.css("line-height", d)
        }
        this.original = {
            exists: this.$element.hasClass("fileinput-exists"),
            preview: this.$preview.html(),
            hiddenVal: this.$hidden.val()
        };
        this.listen()
    };
    a.prototype.listen = function () {
        this.$input.on("change.bs.fileinput", c.proxy(this.change, this));
        c(this.$input[0].form).on("reset.bs.fileinput", c.proxy(this.reset, this));
        this.$element.find('[data-trigger="fileinput"]').on("click.bs.fileinput", c.proxy(this.trigger, this));
        this.$element.find('[data-dismiss="fileinput"]').on("click.bs.fileinput", c.proxy(this.clear, this))
    }, a.prototype.change = function (i) {
        if (i.target.files === undefined) {
            i.target.files = i.target && i.target.value ? [{name: i.target.value.replace(/^.+\\/, "")}] : []
        }
        if (i.target.files.length === 0) {
            return
        }
        this.$hidden.val("");
        this.$hidden.attr("name", "");
        this.$input.attr("name", this.name);
        var g = i.target.files[0];
        if (this.$preview.length > 0 && (typeof g.type !== "undefined" ? g.type.match("image.*") : g.name.match(/\.(gif|png|jpe?g)$/i)) && typeof FileReader !== "undefined") {
            var d = new FileReader();
            var h = this.$preview;
            var f = this.$element;
            d.onload = function (j) {
                var e = c("<img>").attr("src", j.target.result);
                i.target.files[0].result = j.target.result;
                f.find(".fileinput-filename").text(g.name);
                if (h.css("max-height") != "none") {
                    e.css("max-height", parseInt(h.css("max-height"), 10) - parseInt(h.css("padding-top"), 10) - parseInt(h.css("padding-bottom"), 10) - parseInt(h.css("border-top"), 10) - parseInt(h.css("border-bottom"), 10))
                }
                h.html(e);
                f.addClass("fileinput-exists").removeClass("fileinput-new");
                f.trigger("change.bs.fileinput", i.target.files);
                $(".crop-btn").show();
            };
            d.readAsDataURL(g)
        } else {
            this.$element.find(".fileinput-filename").text(g.name);
            this.$preview.text(g.name);
            this.$element.addClass("fileinput-exists").removeClass("fileinput-new");
            this.$element.trigger("change.bs.fileinput")
        }
    }, a.prototype.clear = function (f) {
        if (f) {
            f.preventDefault()
        }
        this.$hidden.val("");
        this.$hidden.attr("name", this.name);
        this.$input.attr("name", "");
        if (b) {
            var d = this.$input.clone(true);
            this.$input.after(d);
            this.$input.remove();
            this.$input = d
        } else {
            this.$input.val("")
        }
        this.$preview.html("");
        this.$element.find(".fileinput-filename").text("");
        this.$element.addClass("fileinput-new").removeClass("fileinput-exists");
        if (f !== false) {
            this.$input.trigger("change");
            this.$element.trigger("clear.bs.fileinput")
        }
    }, a.prototype.reset = function () {
        this.clear(false);
        this.$hidden.val(this.original.hiddenVal);
        this.$preview.html(this.original.preview);
        this.$element.find(".fileinput-filename").text("");
        if (this.original.exists) {
            this.$element.addClass("fileinput-exists").removeClass("fileinput-new")
        } else {
            this.$element.addClass("fileinput-new").removeClass("fileinput-exists")
        }
        this.$element.trigger("reset.bs.fileinput")
    }, a.prototype.trigger = function (d) {
        this.$input.trigger("click");
        d.preventDefault()
    };
    c.fn.fileinput = function (d) {
        return this.each(function () {
            var f = c(this), e = f.data("fileinput");
            if (!e) {
                f.data("fileinput", (e = new a(this, d)))
            }
            if (typeof d == "string") {
                e[d]()
            }
        })
    };
    c.fn.fileinput.Constructor = a;
    c(document).on("click.fileinput.data-api", '[data-provides="fileinput"]', function (g) {
        var f = c(this);
        if (f.data("fileinput")) {
            return
        }
        f.fileinput(f.data());
        var d = c(g.target).closest('[data-dismiss="fileinput"],[data-trigger="fileinput"]');
        if (d.length > 0) {
            g.preventDefault();
            d.trigger("click.bs.fileinput")
        }
    })
}(window.jQuery);
