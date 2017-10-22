var LOAD_NUM = 10;
var PRICE = 9.99;

new Vue ({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        results: [],
        newSearch: 'Food',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    computed: {
      noMoreItems: function () {
        return this.items.length === this.results.length & this.results.length > 0;
      },
    },
    methods: {
        appendItems: function(){
            if(this.items.length < this.results.length){
              var append = this.results.slice(this.items.length, this.items.length+LOAD_NUM);
              this.items = this.items.concat(append);
            }
          },
        onSubmit: function () {
          if (this.newSearch.length) {
            this.items =  [];
            // initialise a loading method beore sending ajax request
            this.loading = true;
            // ajax request for Imgur api
            this.$http
              .get('/search/'.concat(this.newSearch))
              .then(function(res){
              this.lastSearch = this.newSearch;
              this.results = res.data;
              this.items = res.data.slice(0, LOAD_NUM);
              this.loading = false;
            });   
          }
            else{
            console.log('Error Please input a search item');
          }
        },
        addItem: function(index) {
           this.total += PRICE;
           var item = this.items[index];
           var found = false;
           for(var i = 0; i < this.cart.length; i++) {
               if(this.cart[i].id === item) {
                      found = true;
                   this.cart[i].qty++;
                   break;
               }
           }
           if(!found) {
            this.cart.push({
                id: item,
                title: item,
                qty: 1,
                price: PRICE
            });
            }
        },
        inc: function (item) {
          item.qty++;
          this.total += PRICE;
        },
        dec: function (item) {
          item.qty--;
          this.total -= PRICE;
          if (item.qty <= 0) {
            for (var i = 0; i < this.cart.length; i++) {
              if (this.cart[i].id === item.id) {
                this.cart.splice(i, 1);
                break;
              }
            }
          }
        }
    },

    filters: {
        currency: function(price){
            return '$'.concat(price.toFixed(2));
        }
    },
    mounted: function(){
      this.onSubmit();

      var vueInstance = this;
      var elem = document.getElementById('product-list-bottom')
      var watcher = scrollMonitor.create(elem);
      watcher.enterViewport(function () {
        vueInstance.appendItems();
      });
    }
});
