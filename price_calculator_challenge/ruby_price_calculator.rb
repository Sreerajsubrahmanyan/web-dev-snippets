class GroceryStore
    def initialize
      @grocery_price = {
        "milk"   => { up: 3.97, sq: 2, sp: 5.00 },
        "bread"  => { up: 2.17, sq: 3, sp: 6.00 },
        "banana" => { up: 0.99, sq: nil, sp: nil },
        "apple"  => { up: 0.89, sq: nil, sp: nil }
      }
      @grocery_count = {}
      @item_prices = {}
      @total_cost = 0
    end
  
    def get_input
      puts "Enter the items:"
      input = gets.chomp.downcase
      @grocery_count = input.split(",").tally
    end
  
    def calculate_price
      @grocery_count.each do |item, count|
        if @grocery_price[item]
          special_qty = @grocery_price[item][:sq]
          special_price = @grocery_price[item][:sp]
          unit_price = @grocery_price[item][:up]
  
           if special_qty && count >= special_qty
             div = count / special_qty
             mod = count % special_qty
             @item_prices[item] = (div * special_price) + (mod * unit_price)
           else
              @item_prices[item] = count * unit_price
           end
  
          @total_cost += @item_prices[item]
        end
      end
    end
  
    def display_bill
      puts "\nItem         Quantity     Price"
      puts "-" * 35
      @grocery_count.each do |item, count|
        next unless @grocery_price[item]
        
        printf("%-12s %-10d $%-8.2f\n", item.capitalize, count, @item_prices[item])
      end
      puts "-" * 35
      puts "Total cost = $#{@total_cost}"
    end
  
    def process_order
      get_input
      calculate_price
      display_bill
    end
end
  
  store = GroceryStore.new
  store.process_order
  