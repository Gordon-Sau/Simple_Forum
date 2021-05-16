function pager(n) {
    function o() {
        var t = Math.ceil(n.nde / 2)
          , i = n.pc - n.nde
          , r = n.cp > t ? Math.max(Math.min(n.cp - t, i), 0) : 0
          , u = n.cp > t ? Math.min(n.cp + t, n.pc) : Math.min(n.nde, n.pc);
        return [r, u]
    }
    var f, e, t;
    n = $.extend({
        cp: 0,
        pc: 0,
        nde: 7,
        nee: 2
    }, n || {});
    var i = []
      , u = function(t) {
        t = t < 0 ? 0 : t < n.pc ? t : n.pc - 1;
        t === n.cp ? i.push('<span class="current">' + (t + 1) + "<\/span>") : i.push('<a href="javascript:SMH.utils.goPage(' + (t + 1) + ')">' + (t + 1) + "<\/a>")
    }
      , r = o();
    if (i.push('<a class="btn-red prev" onclick="SMH.prevC()" href="javascript:void(0);">上一章<\/a>'),
    n.cp === 0 ? i.push('<span class="disabled">上一页<\/span>') : i.push('<a class="btn-red prev" href="javascript:SMH.utils.goPage(' + (pVars.page - 1) + ')">上一页<\/a>'),
    r[0] > 0) {
        for (f = Math.min(n.nee, r[0]),
        t = 0; t < f; t++)
            u(t);
        n.nee < r[0] && i.push("<span>...<\/span>")
    }
    for (t = r[0]; t < r[1]; t++)
        u(t);
    if (r[1] < n.pc)
        for (n.pc - n.nee > r[1] && i.push("<span>...<\/span>"),
        e = Math.max(n.pc - n.nee, r[1]),
        t = e; t < n.pc; t++)
            u(t);
    return n.cp === n.pc - 1 ? i.push('<span class="disabled">下一页<\/span>') : i.push('<a class="btn-red next" href="javascript:SMH.utils.goPage(' + (pVars.page + 1) + ')">下一页<\/a>'),
    i.push('<a class="btn-red next" onclick="SMH.nextC()" href="javascript:void(0);">下一章<\/a>'),
    i.join("")
}