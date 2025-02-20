grocery_price = {"milk"=>3.97,"bread"=>2.17,"banana"=>0.99,"apple"=>0.89}

puts "Enter the items"
input = gets.chomp.downcase

grocery = input.split(",")
 sum = 0
 count_milk = grocery.count("milk")
 div_milk = count_milk / 2
 mod_milk = count_milk % 2

 count_bread = grocery.count("bread")
 div_bread = count_bread / 3
 mod_bread = count_bread % 3

 grocery.each { |item|  sum += grocery_price[item] unless item =="milk" || item == "bread" }
 sum += (div_milk * 5) + (mod_milk * 3.97) + (div_bread * 6) + (mod_bread * 2.17)
puts "Total Cost = $#{sum}"
