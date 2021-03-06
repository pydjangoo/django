var _ = require('underscore');

var Film = function (ad, yil, yonetmen, karakterler, turler) {
    this.ad = ad;
    this.yil = yil;
    this.yonetmen = yonetmen;
    this.karakterler = karakterler;
    this.turler = turler;
    this.izlendi = false;
    this.izlenmeTarihi = null;

    filmListesi.ekle(this);
};

Film.prototype.izle = function (izlenmeTarihi) {
    this.izlendi = true;

    if (izlenmeTarihi) {
        this.izlenmeTarihi = izlenmeTarihi;
    } else {
        this.izlenmeTarihi = new Date();
    }
};

Film.prototype.oyuncular = function () {
    return this.karakterler.map(function (x) {
        return x.oyuncu;
    })

        /* var oyuncular = [];

           for (var i = 0; i < this.karakterler.length; i++) {
           oyuncular.push(this.karakterler[i].oyuncu);
           }

           return oyuncular; */
};

var Karakter = function (ad, oyuncu) {
    this.ad = ad;
    this.oyuncu = oyuncu;
};

Karakter.prototype.oyuncuAdi = function () {
    return this.oyuncu.tumAd();
};

var Insan = function (ad, soyad, ulke, dogumYili, olumYili) {
    this.ad = ad;
    this.soyad = soyad;
    this.ulke = ulke;
    this.dogumYili = dogumYili;
    this.olumYili = olumYili;
};

Insan.prototype.yas = function () {
    if (this.olumYili) {
        return this.olumYili - this.dogumYili;
    } else {
        return new Date().getFullYear() - this.dogumYili;
    }
};

Insan.prototype.tumAd = function () {
    return this.ad + ' ' + this.soyad;
};

var Oyuncu = function (ad, soyad, ulke, dogumYili, olumYili) {
    Insan.call(this, ad, soyad, ulke, dogumYili, olumYili);
    oyuncuListesi.ekle(this);
};

Oyuncu.prototype = Object.create(Insan.prototype);

Oyuncu.prototype.filmleri = function () {
    var filmler = [];

    filmListesi.filmler.forEach(function (film) {
        var filmdekiOyuncular = film.oyuncular();
        var bulundu = false;

        for (var j = 0; j < filmdekiOyuncular.length; j++) {
            if (filmdekiOyuncular[j] === this) {
                bulundu = true;
            }
        }

        if (bulundu) {
            filmler.push(film);
        }
    });

    return filmler;
    /* for (var i = 0; i < filmListesi.filmler.length; i++) {
       var film = filmListesi.filmler[i];
       var filmdekiOyuncular = film.oyuncular();
       var bulundu = false;

       for (var j = 0; j < filmdekiOyuncular.length; j++) {
       if (filmdekiOyuncular[j] === this) {
       bulundu = true;
       }
       }

       if (bulundu) {
       filmler.push(film);
       }
     */
/*     return filmler; */
};

var Yonetmen = function (ad, soyad, ulke, dogumYili, olumYili) {
    Insan.call(this, ad, soyad, ulke, dogumYili, olumYili);

    yonetmenListesi.ekle(this);

};

Yonetmen.prototype = Object.create(Insan.prototype);

Yonetmen.prototype.filmleri = function () {
    // this = yonetmen
    /* return filmListesi.filmler.filter(function (film) {
       // this = global
       return film.yonetmen === this;
       }, this); */

    var that = this; // that = yonetmen
    var self = this;
    return filmListesi.filmler.filter(function (film) {
        // return film.yonetmen === that;
        return film.yonetmen === self;

    });

    return filmListesi.filmler.filter(function (film) {
        return film.yonetmen === this;
    }.bind(this));


    // return filmListesi.filmler.filter((film) => film.yonetmen === this);

    /*
       var filmler = [];
       for (var i = 0; i < filmListesi.filmler.length; i++) {
       if (filmListesi.filmler[i].yonetmen === this) {
       filmler.push(filmListesi.filmler[i]);
       }
       }

       return filmler; */
};


var Tur = function (ad) {
    this.ad = ad;

    turListesi.ekle(this);

};

Tur.prototype.filmler = function () {
    var filmler = [];

    for (var i = 0; i < filmListesi.filmler.length; i++) {
        var film = filmListesi.filmler[i];
        var bulundu = false;

        for (var j = 0; j < film.turler.length; j++) {
            if (film.turler[j] === this) {
                bulundu = true;
            }
        }

        if (bulundu) {
            filmler.push(film);
        }
    }

    return filmler;
};

var Koleksiyon = function () { };

Koleksiyon.prototype.getCollection = function () {
    throw new Error("Not implemented");
};

Koleksiyon.prototype.serialize = function () {
    return JSON.stringify(this.getCollection(), null, 4);
};

Koleksiyon.prototype.ekle = function (oge) {
    var list = this.getCollection();
    list.push(oge);
};

var OyuncuListesi = function () {
    Koleksiyon.call(this);
    this.oyuncular = [];
};

OyuncuListesi.prototype = Object.create(Koleksiyon.prototype);

OyuncuListesi.prototype.getCollection = function () {
    return this.oyuncular;
};


var KarakterListesi = function () {
    Koleksiyon.call(this);
    this.karakterler = [];
};

KarakterListesi.prototype = Object.create(Koleksiyon.prototype);

KarakterListesi.getCollection = function () {
    return this.karakterler;
};

OyuncuListesi.getCollection = function () {
    return this.oyuncular;
};

var YonetmenListesi = function () {
    Koleksiyon.call(this);
    this.yonetmenler = [];
};

YonetmenListesi.prototype = Object.create(Koleksiyon.prototype);

YonetmenListesi.prototype.getCollection = function () {
    return this.yonetmenler;
};


var TurListesi = function () {
    Koleksiyon.call(this);
    this.turler = [];
};

TurListesi.prototype = Object.create(Koleksiyon.prototype);

TurListesi.prototype.getCollection = function () {
    return this.turler;
};

var FilmListesi = function () {
    Koleksiyon.call(this);
    this.filmler = [];
};

FilmListesi.prototype = Object.create(Koleksiyon.prototype);

_.extend(FilmListesi.prototype, {

    getCollection: function () {
        return this.filmler;
    },

    izlenenler: function () {
        var filmler = [];

        for (var i = 0; i < this.filmler.length; i++) {
            if (this.filmler[i].izlendi) {
                filmler.push(this.filmler[i]);
            }
        }
        return filmler;
    },

    izlenecekler: function () {
        var filmler = [];

        for (var i = 0; i < this.filmler.length; i++) {
            if (!this.filmler[i].izlendi) {
                filmler.push(this.filmler[i]);
            }
        }
        return filmler;

    },

    filmAdlari: function () {
        var filmAdlari = [];

        for (var i = 0; i < this.filmler.length; i++) {
            filmAdlari.push(this.filmler[i].ad);
        }

        return filmAdlari;
    },

    yonetmenAdlari: function () {
        var yonetmenAdlari = [];

        for (var i = 0; i < this.filmler.length; i++) {
            yonetmenAdlari.push(this.filmler[i].yonetmen.tumAd());
        }

        return yonetmenAdlari;

    },

    ozet: function () {
        console.log(this.izlenenler().length + ' adet film izlendi');
        console.log(this.izlenenler());

        console.log(this.izlenecekler().length + ' adet film izlenecek');
        console.log(this.izlenecekler());

    },

    ekle: function (film) {
        this.filmler.push(film);
    },

    /*     yonetmeneAitFilmler:  */

});


// Veri girisi

// Tablolari olustur
var oyuncuListesi = new OyuncuListesi();
var yonetmenListesi = new YonetmenListesi();
var karakterListesi = new KarakterListesi();
var turListesi = new TurListesi();
var filmListesi = new FilmListesi();


// Oyunculari ekle
var timRobbins = new Oyuncu("Tim", "Robbins", "Amerika", 1958);
var morganFreeman = new Oyuncu("Morgan", "Freeman", "Amerika", 1937);
var marlonBrando = new Oyuncu("Marlon","Brando", "Amerika", 1924, 2004);
var alPacino = new Oyuncu("Al", "Pacino", "Amerika", 1940);

// Yonetmenlerik Ekle
var frankDarabont = new Yonetmen("Frank", "Darabont", "Fransa", 1959);
var francisCoppola = new Yonetmen("Francis", "Coppola", "Amerika", 1939);

// Turleri Ekle
var crime = new Tur("crime");
var drama = new Tur("drama");

// Karakterleri Ekle
var andyDufresne = new Karakter("Andy Dufresne", timRobbins);
var donvito = new Karakter("Don Vito Corleone", marlonBrando);
var michaelCorleone = new Karakter("Michael Corleone", alPacino);
var redding = new Karakter("Redding", morganFreeman);

// Filmleri Ekle
var shawshankRedemption = new Film("Shawshank Redemption", 1994, frankDarabont, [andyDufresne, redding], [drama, crime]);
var godfather1 = new Film("Godfather1", 1972, francisCoppola, [donvito, michaelCorleone], [drama]);


// [shawshankRedemption, godfather1]);


shawshankRedemption.izle();

console.log(filmListesi.ozet());


console.log(shawshankRedemption.oyuncular());

console.log(redding.oyuncuAdi());

console.log(redding.oyuncu.yas());

console.log(shawshankRedemption.yonetmen.tumAd());

console.log(shawshankRedemption.yonetmen.yas());

console.log("Crime", crime.filmler());
console.log("Drama", drama.filmler());


console.log(filmListesi.serialize());

console.log(turListesi.serialize());

console.log(oyuncuListesi.serialize());

console.log(yonetmenListesi.serialize());

var fs = require('fs');

fs.writeFileSync('oyuncular.json', oyuncuListesi.serialize());
fs.writeFileSync('filmler.json', filmListesi.serialize());
