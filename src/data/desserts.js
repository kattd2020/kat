// Cheap, easy desserts — pantry-friendly, under 30 minutes, minimal
// equipment. Each recipe has the same shape as a custom event recipe:
// { title, time, ingredients, steps }.

export const DESSERTS = [
  {
    title: 'Microwave Mug Brownie',
    time: '5 min',
    ingredients: [
      '4 tbsp flour',
      '4 tbsp sugar',
      '2 tbsp cocoa powder',
      'Pinch of salt',
      '3 tbsp milk',
      '2 tbsp neutral oil',
      'Splash of vanilla',
      '1 tbsp chocolate chips (optional)',
    ],
    steps: [
      'In a mug, whisk flour, sugar, cocoa, and salt until no lumps.',
      'Stir in milk, oil, and vanilla until smooth.',
      'Drop chocolate chips on top.',
      'Microwave on high 60–90 seconds until the top is just set — center stays fudgy.',
      'Let cool 1 minute and eat with a spoon.',
    ],
  },

  {
    title: 'No-Bake Chocolate Peanut Butter Cookies',
    time: '15 min + chill',
    ingredients: [
      '2 cups sugar',
      '½ cup (1 stick) butter',
      '½ cup milk',
      '¼ cup cocoa powder',
      'Pinch of salt',
      '½ cup creamy peanut butter',
      '1 tsp vanilla',
      '3 cups rolled oats',
    ],
    steps: [
      'Line a sheet pan with parchment.',
      'In a saucepan, combine sugar, butter, milk, cocoa, and salt.',
      'Bring to a rolling boil and let bubble exactly 1 minute, stirring.',
      'Remove from heat; stir in peanut butter, vanilla, and oats.',
      'Drop tablespoon-sized mounds onto the parchment.',
      'Chill 20 minutes until set. Store in the fridge.',
    ],
  },

  {
    title: 'Easy Apple Crisp',
    time: '45 min',
    ingredients: [
      '6 apples, peeled and sliced',
      '2 tbsp sugar',
      '1 tsp cinnamon',
      '1 tbsp lemon juice',
      '1 cup rolled oats',
      '½ cup flour',
      '⅔ cup brown sugar',
      '½ cup (1 stick) butter, melted',
      'Vanilla ice cream, to serve',
    ],
    steps: [
      'Heat oven to 375°F and butter a 9×13 baking dish.',
      'Toss apples with sugar, cinnamon, and lemon juice; spread in the dish.',
      'In a bowl, mix oats, flour, brown sugar, and melted butter with a fork until crumbly.',
      'Scatter the crumb topping evenly over the apples.',
      'Bake 35–40 minutes until the top is deep golden and the apples bubble at the edges.',
      'Serve warm with ice cream.',
    ],
  },

  {
    title: 'Banana Bread Muffins',
    time: '30 min',
    ingredients: [
      '3 ripe bananas, mashed',
      '⅓ cup (⅔ stick) butter, melted',
      '¾ cup sugar',
      '1 egg',
      '1 tsp vanilla',
      '1 tsp baking soda',
      'Pinch of salt',
      '1½ cups flour',
      '½ cup chocolate chips or chopped walnuts (optional)',
    ],
    steps: [
      'Heat oven to 350°F and line a 12-cup muffin tin.',
      'Whisk mashed bananas with melted butter.',
      'Stir in sugar, egg, and vanilla.',
      'Add baking soda, salt, and flour; fold just until no dry flour remains.',
      'Fold in chips or nuts if using.',
      'Scoop into the muffin tin. Bake 20–22 minutes until a toothpick comes out clean.',
    ],
  },

  {
    title: 'Classic Rice Pudding',
    time: '30 min',
    ingredients: [
      '¾ cup white rice',
      '4 cups milk',
      '½ cup sugar',
      '1 egg, beaten',
      '2 tbsp butter',
      '1 tsp vanilla',
      '½ tsp cinnamon, plus more to serve',
      '½ cup raisins (optional)',
    ],
    steps: [
      'In a saucepan, combine rice, 3 cups of the milk, and sugar over medium heat.',
      'Bring to a simmer and cook, stirring often, 20–25 minutes until rice is tender and creamy.',
      'Temper the egg: whisk in the last cup of milk, then pour into the pot.',
      'Cook 2 more minutes, stirring, until thickened.',
      'Off heat, stir in butter, vanilla, cinnamon, and raisins.',
      'Serve warm or chilled, dusted with more cinnamon.',
    ],
  },

  {
    title: 'Oreo Icebox Cake',
    time: '10 min + chill',
    ingredients: [
      '2 cups heavy cream',
      '¼ cup powdered sugar',
      '1 tsp vanilla',
      '1 package (14 oz) Oreos',
      'Chocolate syrup (optional)',
    ],
    steps: [
      'Whip cream with powdered sugar and vanilla to stiff peaks.',
      'Spread a thin layer of cream in the bottom of an 8×8 dish.',
      'Layer Oreos flat to cover, then spread ⅓ of the remaining cream.',
      'Repeat Oreo-cream layers until ingredients run out, ending with cream.',
      'Refrigerate at least 4 hours (overnight is best) so the cookies soften into cake.',
      'Drizzle with chocolate syrup and slice.',
    ],
  },

  {
    title: "S'mores Dip",
    time: '15 min',
    ingredients: [
      '2 cups milk chocolate chips',
      '1 bag (10 oz) large marshmallows',
      '1 tbsp butter',
      'Graham crackers, for dipping',
    ],
    steps: [
      'Heat oven to 450°F.',
      'Butter a cast-iron skillet or 8-inch baking dish.',
      'Spread chocolate chips in an even layer.',
      'Stand marshmallows up in a tight grid on top of the chocolate.',
      'Bake 5–7 minutes until marshmallows are deep golden.',
      'Serve hot with graham crackers for dipping.',
    ],
  },

  {
    title: 'Lemon Icebox Pie',
    time: '10 min + chill',
    ingredients: [
      '1 graham cracker crust (store-bought)',
      '1 can (14 oz) sweetened condensed milk',
      '½ cup fresh lemon juice',
      'Zest of 2 lemons',
      '1 cup heavy cream',
      '2 tbsp powdered sugar',
    ],
    steps: [
      'Whisk condensed milk, lemon juice, and half the zest until thickened.',
      'Pour into the graham crust and smooth the top.',
      'Refrigerate at least 3 hours until set.',
      'Whip cream with powdered sugar to soft peaks.',
      'Top the pie with cream and the remaining lemon zest before serving.',
    ],
  },

  {
    title: 'No-Bake Cheesecake Cups',
    time: '15 min + chill',
    ingredients: [
      '8 oz cream cheese, softened',
      '½ cup powdered sugar',
      '1 tsp vanilla',
      '1 cup heavy cream',
      '1 cup crushed graham crackers',
      '3 tbsp melted butter',
      '1 cup fresh berries or jam, to top',
    ],
    steps: [
      'Mix crushed graham crackers with melted butter; divide into 6 small glasses.',
      'Beat cream cheese with powdered sugar and vanilla until smooth.',
      'Whip heavy cream to stiff peaks and fold into the cream cheese.',
      'Spoon the filling over the crumbs.',
      'Chill at least 1 hour.',
      'Top with berries or jam before serving.',
    ],
  },

  {
    title: 'Chocolate-Covered Strawberries',
    time: '20 min + chill',
    ingredients: [
      '1 lb strawberries, stems on, washed and dried',
      '8 oz semisweet chocolate chips',
      '1 tbsp coconut oil or shortening',
      'Optional: sprinkles, crushed nuts, white chocolate drizzle',
    ],
    steps: [
      'Dry the strawberries THOROUGHLY — any water makes the chocolate seize.',
      'Line a sheet pan with parchment.',
      'Melt chocolate with coconut oil in 30-second microwave bursts, stirring each time.',
      'Hold each berry by the stem and dip into the chocolate, swirling to coat.',
      'Set on the parchment; add sprinkles before the chocolate sets.',
      'Chill 15 minutes until firm. Serve same day.',
    ],
  },
]
