exports.getAllUsers = async (req, res, next) => {
  console.log(req.user.isPremiumUser);

  if (req.user.isPremiumUser) {
    console.log("into getall Users");
    let leaderboardData = [];

    User.find({ _id: { $ne: req.user } })
      .then((users) => {
        return new Promise((resolve, reject) => {
          users.forEach((user, index, arr) => {
            let obj = {};
            obj.userId = user._id;
            obj.name = user.name;
            // obj.totalExpense = user.totalExpense;
            user.populate("latestExpenses.expenses").then((result) => {
              // console.log(result.latestExpenses);
              obj.expenses = result.latestExpenses;
              leaderboardData.push(obj);
              // console.log(leaderboardData);
              if (index === arr.length - 1) resolve();
            });
          });
        });
      })
      //   for (let i = 0; i < users.length; i++) {
      //     let expenses = await users[i].getExpenses();

      //     console.log(users[i]);
      //     console.log(expenses);
      //     let totalExpense = 0;
      //     for (let j = 0; j < expenses.length; j++) {
      //       totalExpense += expenses[j].expenseamount;
      //     }
      //     console.log(totalExpense);
      //     let userObj = {
      //       user: users[i],
      //       expenses,
      //       totalExpense,
      //     };
      //     leaderboard.push(userObj);
      //   }
      //   return res.status(200).json({ success: true, data: leaderboard });
      // }
      .then((result) => {
        // console.log(leaderboardData);
        res.status(200).json({ data: leaderboardData });
      })
      .catch((err) => console.log(err));
  } else {
    res
      .status(403)
      .json({ success: false, message: "user does not premium membership" });
  }
};
